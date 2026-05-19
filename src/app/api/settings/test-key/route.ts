import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { apiKey } = await req.json();
  if (!apiKey?.trim()) {
    return NextResponse.json({ valid: false, error: "No API key provided" });
  }

  try {
    const client = new Anthropic({ apiKey: apiKey.trim() });
    await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 10,
      messages: [{ role: "user", content: "Hi" }],
    });
    return NextResponse.json({ valid: true });
  } catch (err: any) {
    const msg = err?.message || "Invalid key";
    const isAuth = msg.toLowerCase().includes("auth") || msg.includes("401") || msg.includes("invalid");
    return NextResponse.json({
      valid: false,
      error: isAuth ? "Invalid API key — check it and try again." : `Error: ${msg}`,
    });
  }
}
