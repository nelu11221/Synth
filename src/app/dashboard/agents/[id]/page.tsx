import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AgentChat } from "@/components/dashboard/AgentChat";

export default async function AgentChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const agent = await prisma.agent.findFirst({
    where: { id, userId: (session?.user as any)?.id },
  });

  if (!agent) notFound();

  const conversation = await prisma.conversation.findFirst({
    where: { agentId: id, userId: (session?.user as any)?.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <AgentChat
      agent={agent}
      initialMessages={conversation?.messages || []}
      conversationId={conversation?.id || null}
    />
  );
}
