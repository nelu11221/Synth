import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AgentsGrid } from "@/components/dashboard/AgentsGrid";

export default async function AgentsPage() {
  const session = await getServerSession(authOptions);
  const agents = await prisma.agent.findMany({
    where: { userId: (session?.user as any)?.id },
    orderBy: { createdAt: "desc" },
  });

  return <AgentsGrid initialAgents={agents} />;
}
