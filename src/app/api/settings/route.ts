import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptApiKey, decryptApiKey } from "@/lib/encryption";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, name: true, email: true, apiKey: true },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const decryptedKey = user.apiKey ? decryptApiKey(user.apiKey) : "";
  const maskedKey = decryptedKey
    ? `${decryptedKey.slice(0, 14)}${"•".repeat(20)}${decryptedKey.slice(-4)}`
    : "";

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    hasApiKey: !!user.apiKey,
    maskedKey,
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, apiKey } = await req.json();

  const updateData: Record<string, string> = {};
  if (name !== undefined) updateData.name = name;
  if (apiKey !== undefined && apiKey !== "") {
    updateData.apiKey = encryptApiKey(apiKey.trim());
  }

  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: updateData,
  });

  return NextResponse.json({ success: true, name: user.name });
}
