import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const [tasks, agents] = await Promise.all([
    prisma.task.findMany({
      where: { userId },
      include: { agent: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.agent.findMany({ where: { userId }, select: { id: true, name: true, emoji: true } }),
  ]);

  return <KanbanBoard initialTasks={tasks as any} agents={agents} />;
}
