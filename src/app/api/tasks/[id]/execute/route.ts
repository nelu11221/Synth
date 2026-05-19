import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/encryption";
import Anthropic from "@anthropic-ai/sdk";

/* Map stored model slugs → valid Anthropic model IDs */
const MODEL_MAP: Record<string, string> = {
  "claude-haiku-4-5":          "claude-haiku-4-5-20251001",
  "claude-haiku-4-5-20251001": "claude-haiku-4-5-20251001",
  "claude-haiku":              "claude-haiku-4-5-20251001",
  "haiku":                     "claude-haiku-4-5-20251001",
  "claude-sonnet-4-5":         "claude-sonnet-4-6",
  "claude-sonnet-4-6":         "claude-sonnet-4-6",
  "claude-sonnet":             "claude-sonnet-4-6",
  "sonnet":                    "claude-sonnet-4-6",
  "claude-opus-4-5":           "claude-opus-4-7",
  "claude-opus-4-7":           "claude-opus-4-7",
  "claude-opus":               "claude-opus-4-7",
  "opus":                      "claude-opus-4-7",
};

const FALLBACK_MODEL = "claude-haiku-4-5-20251001";

function resolveModel(raw: string): string {
  const resolved = MODEL_MAP[raw] || MODEL_MAP[raw.toLowerCase()];
  if (!resolved) {
    console.warn(`[execute] Unknown model "${raw}", falling back to ${FALLBACK_MODEL}`);
    return FALLBACK_MODEL;
  }
  return resolved;
}

async function setFailed(id: string, message: string) {
  await prisma.task.update({
    where: { id },
    data: { status: "failed", errorMessage: message },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`[execute] Starting task ${id}`);

  const session = await getServerSession(authOptions);
  const internalToken = req.headers.get("x-internal-token");
  const isInternal = internalToken === process.env.NEXTAUTH_SECRET;

  if (!session?.user && !isInternal) {
    console.warn(`[execute] Unauthorized attempt for task ${id}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Load task with agent + user apiKey */
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      agent: true,
      user: { select: { apiKey: true } },
    },
  });

  if (!task) {
    console.error(`[execute] Task ${id} not found`);
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (!task.agent) {
    console.error(`[execute] Task ${id} has no agent assigned`);
    await setFailed(id, "No agent assigned to this task");
    return NextResponse.json({ error: "No agent assigned" }, { status: 400 });
  }

  console.log(`[execute] Task: "${task.title}" | Agent: ${task.agent.name} | Model raw: ${task.agent.model}`);

  /* Resolve API key */
  const rawKey = task.user?.apiKey ? decryptApiKey(task.user.apiKey) : "";
  if (!rawKey) {
    console.error(`[execute] No API key for task ${id}`);
    await setFailed(id, "No API key set in Settings — go to Dashboard → Settings to add your Anthropic key");
    return NextResponse.json({ error: "NO_API_KEY" }, { status: 402 });
  }

  /* Mark in-progress */
  await prisma.task.update({ where: { id }, data: { status: "in-progress", errorMessage: null } });

  try {
    const client = new Anthropic({ apiKey: rawKey });
    const agent = task.agent;

    /* Resolve model */
    const model = resolveModel(agent.model);
    console.log(`[execute] Using model: ${model} (raw: ${agent.model})`);

    /* Build system prompt */
    const skills = JSON.parse(agent.skills || "[]") as string[];
    const toneDesc =
      agent.tone <= 3 ? "very formal and professional"
      : agent.tone <= 6 ? "balanced and professional"
      : "casual and approachable";

    const systemPrompt = [
      `You are ${agent.name}, an AI agent specialized in ${agent.domain}.`,
      skills.length > 0 ? `Your skills: ${skills.join(", ")}.` : "",
      agent.personality ? `Your personality: ${agent.personality}.` : "",
      `Your tone is ${toneDesc}. You respond in ${agent.language || "English"}.`,
      `Complete the assigned task thoroughly. Format your response with clear sections using markdown where appropriate.`,
      `Be specific, actionable, and comprehensive in your response.`,
    ].filter(Boolean).join("\n");

    console.log(`[execute] Calling Anthropic for task ${id}...`);

    const res = await client.messages.create({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `Please complete this task:\n\n**Task:** ${task.title}`,
      }],
    });

    const result = res.content[0].type === "text" ? res.content[0].text.trim() : "";
    console.log(`[execute] Task ${id} completed. Result length: ${result.length} chars`);

    await prisma.task.update({
      where: { id },
      data: { status: "done", result, executedAt: new Date(), errorMessage: null },
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    const msg = err?.message || "Unknown error during execution";
    console.error(`[execute] Task ${id} failed:`, msg);
    await setFailed(id, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
