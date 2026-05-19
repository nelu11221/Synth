import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/encryption";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message, systemPrompt, model } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { apiKey: true },
  });

  const rawKey = user?.apiKey ? decryptApiKey(user.apiKey) : "";

  if (!rawKey) {
    return NextResponse.json({
      content: "⚠️ Adaugă Anthropic API Key în Settings pentru a testa agentul.",
    });
  }

  try {
    const client = new Anthropic({ apiKey: rawKey });
    const response = await client.messages.create({
      model: model || "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ content });
  } catch (err: any) {
    return NextResponse.json({ content: `Eroare: ${err.message || "Failed to get response"}` });
  }
}
