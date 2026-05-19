import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/encryption";
import Anthropic from "@anthropic-ai/sdk";

function buildSystemPrompt(agent: {
  name: string;
  domain: string;
  description: string;
  skills: string;
  personality: string;
  tone: number;
  language: string;
}) {
  const skills = JSON.parse(agent.skills || "[]");
  const toneDesc =
    agent.tone <= 3
      ? "very formal and professional"
      : agent.tone <= 6
      ? "balanced, professional but approachable"
      : "casual and friendly";

  return `You are ${agent.name}, an AI agent specialized in ${agent.domain}.

Description: ${agent.description}

Key skills: ${skills.join(", ")}

Personality: ${agent.personality || "Professional and helpful"}

Communication tone: ${toneDesc} (tone level: ${agent.tone}/10)

Language: Always respond in ${agent.language}.

Always respond in character. Never break character. Be concise and helpful.`;
}

export async function POST(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { agentId } = await params;
  const { message, conversationId } = await req.json();

  const [agent, user] = await Promise.all([
    prisma.agent.findFirst({ where: { id: agentId, userId: (session.user as any).id } }),
    prisma.user.findUnique({ where: { id: (session.user as any).id }, select: { apiKey: true } }),
  ]);

  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const rawKey = user?.apiKey ? decryptApiKey(user.apiKey) : "";
  if (!rawKey) {
    return NextResponse.json(
      { error: "NO_API_KEY" },
      { status: 402 }
    );
  }

  let convId = conversationId;
  if (!convId) {
    const conv = await prisma.conversation.create({
      data: { agentId, userId: (session.user as any).id },
    });
    convId = conv.id;
  }

  await prisma.message.create({
    data: { conversationId: convId, role: "user", content: message },
  });

  const history = await prisma.message.findMany({
    where: { conversationId: convId },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  try {
    const client = new Anthropic({ apiKey: rawKey });
    const systemPrompt = buildSystemPrompt(agent);

    const messages = history.slice(0, -1).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await client.messages.create({
      model: agent.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [...messages, { role: "user", content: message }],
    });

    const assistantContent =
      response.content[0].type === "text" ? response.content[0].text : "";

    const savedMessage = await prisma.message.create({
      data: { conversationId: convId, role: "assistant", content: assistantContent },
    });

    return NextResponse.json({ message: savedMessage, conversationId: convId });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to get response from AI" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { agentId } = await params;
  const url = new URL(req.url);
  const conversationId = url.searchParams.get("conversationId");

  if (conversationId) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  }

  const conv = await prisma.conversation.findFirst({
    where: { agentId, userId: (session.user as any).id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json(conv || { messages: [], id: null });
}
