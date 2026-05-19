import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardOverview } from "@/components/dashboard/Overview";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const [agents, tasks, recentMessages] = await Promise.all([
    prisma.agent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.task.findMany({ where: { userId }, include: { agent: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.message.findMany({
      where: { conversation: { userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { conversation: { include: { agent: true } } },
    }),
  ]);

  const activeAgents = agents.filter((a) => a.isActive).length;
  const completedTasks = await prisma.task.count({ where: { userId, status: "done" } });
  const todayMessages = await prisma.message.count({
    where: {
      conversation: { userId },
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  return (
    <DashboardOverview
      userName={session?.user?.name || ""}
      stats={{ activeAgents, completedTasks, todayMessages, timeSaved: completedTasks * 0.5 }}
      agents={agents}
      tasks={tasks}
      recentMessages={recentMessages}
    />
  );
}
