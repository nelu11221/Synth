import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: (session.user as any).id },
    include: { agent: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, agentId, priority, deadline, status } = await req.json();

  const task = await prisma.task.create({
    data: {
      userId: (session.user as any).id,
      title,
      agentId: agentId || null,
      priority: priority || "medium",
      deadline: deadline ? new Date(deadline) : null,
      status: status || "todo",
    },
    include: { agent: true },
  });

  /* Auto-execute if an agent is assigned — non-blocking */
  if (task.agentId) {
    const baseUrl = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    setTimeout(() => {
      fetch(`${baseUrl}/api/tasks/${task.id}/execute`, {
        method: "POST",
        headers: { "x-internal-token": process.env.NEXTAUTH_SECRET || "" },
      }).catch(() => {});
    }, 1500);
  }

  return NextResponse.json(task);
}
