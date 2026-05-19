import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/encryption";
import Anthropic from "@anthropic-ai/sdk";

interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { question } = await req.json();
  if (!question?.trim()) return NextResponse.json({ error: "Question required" }, { status: 400 });

  const task = await prisma.task.findUnique({
    where: { id, userId: (session.user as any).id },
    include: {
      agent: true,
      user: { select: { apiKey: true } },
    },
  });

  if (!task || !task.result) return NextResponse.json({ error: "Task not found or not executed" }, { status: 404 });
  if (!task.agent) return NextResponse.json({ error: "No agent assigned" }, { status: 400 });

  const rawKey = task.user.apiKey ? decryptApiKey(task.user.apiKey) : "";
  if (!rawKey) return NextResponse.json({ error: "NO_API_KEY" }, { status: 402 });

  try {
    const client = new Anthropic({ apiKey: rawKey });
    const agent = task.agent;
    const skills = JSON.parse(agent.skills || "[]") as string[];

    const systemPrompt = [
      `You are ${agent.name}, an AI agent specialized in ${agent.domain}.`,
      skills.length > 0 ? `Your skills: ${skills.join(", ")}.` : "",
      agent.personality ? `Personality: ${agent.personality}.` : "",
      `You previously completed a task and are now answering follow-up questions about it.`,
      `Be concise and helpful. Reference your previous work when relevant.`,
    ].filter(Boolean).join("\n");

    const history = (task.conversation as ConversationTurn[] | null) || [];

    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      {
        role: "user",
        content: `Here is the task I gave you: "${task.title}"\n\nYour previous response:\n${task.result}`,
      },
      { role: "assistant", content: "Understood. I have the context of my previous work. What would you like to know?" },
      ...history,
      { role: "user", content: question },
    ];

    const res = await client.messages.create({
      model: agent.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const answer = res.content[0].type === "text" ? res.content[0].text.trim() : "";

    const updatedConversation: ConversationTurn[] = [
      ...history,
      { role: "user", content: question },
      { role: "assistant", content: answer },
    ];

    await prisma.task.update({
      where: { id },
      data: { conversation: updatedConversation as any },
    });

    return NextResponse.json({ answer, conversation: updatedConversation });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Follow-up failed" }, { status: 500 });
  }
}
