import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/encryption";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  const userId = (session.user as any).id;

  const [agents, user] = await Promise.all([
    prisma.agent.findMany({ where: { userId, isActive: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { apiKey: true } }),
  ]);

  if (agents.length === 0) {
    return NextResponse.json({ error: "No active agents" }, { status: 400 });
  }

  const rawKey = user?.apiKey ? decryptApiKey(user.apiKey) : "";
  if (!rawKey) return NextResponse.json({ error: "NO_API_KEY" }, { status: 402 });

  try {
    const client = new Anthropic({ apiKey: rawKey });

    /* ── Step 1: Orchestrator decides who responds ── */
    const agentList = agents.map((a) => `- ${a.name} (${a.domain})`).join("\n");
    const orchestratorRes = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 120,
      system: `You are a routing orchestrator. Analyze the user message and decide which agents should respond.

Rules:
- If the message mentions a specific agent by name (full or partial match, case-insensitive), ONLY that agent responds. No exceptions.
- If the message is general (greetings, questions for everyone, small talk like "hello", "how are you", "what can you do"), ALL agents respond.
- If unsure, default to ALL agents.

Available agents:
${agentList}

Respond ONLY with valid JSON: {"respondents": ["AgentName"]} or {"respondents": ["all"]}
No extra text, no explanation.`,
      messages: [{ role: "user", content: `User message: "${message}"` }],
    });

    /* ── Step 2: Parse respondents ── */
    let respondentNames: string[] = ["all"];
    try {
      const raw = orchestratorRes.content[0].type === "text"
        ? orchestratorRes.content[0].text.trim()
        : "";
      // Strip any markdown code fences the model might add
      const cleaned = raw.replace(/```[a-z]*\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      respondentNames = Array.isArray(parsed.respondents) ? parsed.respondents : ["all"];
    } catch {
      respondentNames = ["all"];
    }

    /* ── Step 3: Strict case-insensitive name match ── */
    const respondingAgents = respondentNames[0] === "all"
      ? agents
      : agents.filter((a) =>
          respondentNames.some(
            (r) => a.name.toLowerCase() === r.toLowerCase()
          )
        );

    // Fallback: if named match found nothing, try contains match before giving up
    const finalAgents =
      respondingAgents.length > 0
        ? respondingAgents
        : agents.filter((a) =>
            respondentNames.some(
              (r) =>
                a.name.toLowerCase().includes(r.toLowerCase()) ||
                r.toLowerCase().includes(a.name.toLowerCase())
            )
          ).slice(0, 1) || [agents[0]];

    /* ── Step 3: Persist user message ── */
    const conv = await prisma.conversation.upsert({
      where: { id: `team-${userId}` },
      create: { id: `team-${userId}`, agentId: finalAgents[0].id, userId },
      update: { agentId: finalAgents[0].id },
    });

    await prisma.message.create({
      data: { conversationId: conv.id, role: "user", content: message },
    });

    /* ── Step 4: Parallel agent responses ── */
    const agentResponses = await Promise.all(
      finalAgents.map(async (agent) => {
        try {
          const toneDesc =
            agent.tone <= 3 ? "very formal and professional"
            : agent.tone <= 6 ? "balanced and professional"
            : "casual, friendly and approachable";

          const skills = JSON.parse(agent.skills || "[]") as string[];

          const systemPrompt = [
            `You are ${agent.name}, an AI agent specialized in ${agent.domain}.`,
            skills.length > 0 ? `Your core skills: ${skills.join(", ")}.` : "",
            agent.personality ? `Your personality: ${agent.personality}.` : "",
            `Your communication style is ${toneDesc}.`,
            `You respond in ${agent.language || "English"}.`,
            `You are in a team chat alongside other AI agents and a human user.`,
            `Keep your response concise — 2 to 4 sentences max.`,
            `Stay fully in character. Only address topics within your area of expertise.`,
            `When greeted, respond warmly and briefly mention your specialty.`,
          ].filter(Boolean).join("\n");

          const res = await client.messages.create({
            model: agent.model,
            max_tokens: 300,
            system: systemPrompt,
            messages: [{ role: "user", content: message }],
          });

          const content =
            res.content[0].type === "text" ? res.content[0].text.trim() : "";
          if (!content) return null;

          const saved = await prisma.message.create({
            data: {
              conversationId: conv.id,
              role: "assistant",
              content,
              agentName: agent.name,
              agentEmoji: agent.emoji,
            },
          });

          return {
            agentId: agent.id,
            agentName: agent.name,
            agentEmoji: agent.emoji,
            agentDomain: agent.domain,
            message: saved,
          };
        } catch {
          return null;
        }
      })
    );

    const responses = agentResponses
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .map((r, i) => ({ ...r, delay: i * 1200 }));

    return NextResponse.json({ responses });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to get response from AI" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const convId = `team-${(session.user as any).id}`;
  const messages = await prisma.message.findMany({
    where: { conversationId: convId },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json(messages);
}
