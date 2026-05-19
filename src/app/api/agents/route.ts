import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agents = await prisma.agent.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, emoji, color, domain, description, skills, model, personality, tone, language } = body;

  const agent = await prisma.agent.create({
    data: {
      userId: (session.user as any).id,
      name,
      emoji: emoji || "🤖",
      color: color || "#7c3aed",
      domain,
      description,
      skills: JSON.stringify(skills || []),
      model: model || "claude-haiku-4-5",
      personality: personality || "",
      tone: tone || 5,
      language: language || "English",
    },
  });

  return NextResponse.json(agent);
}
