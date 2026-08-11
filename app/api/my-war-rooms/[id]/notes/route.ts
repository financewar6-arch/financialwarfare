import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { hasFeatureAccess, PremiumFeature } from "@/lib/entitlements";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasAccess = await hasFeatureAccess(
    session.user.id,
    PremiumFeature.MY_WAR_ROOM
  );
  if (!hasAccess) {
    return NextResponse.json(
      { error: "Feature not available" },
      { status: 403 }
    );
  }

  const warRoom = await prisma.myWarRoom.findUnique({
    where: { id: params.id },
  });

  if (!warRoom || warRoom.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { content, type = "general" } = await req.json();

  const note = await prisma.personalNote.create({
    data: {
      myWarRoomId: params.id,
      content,
      type,
      createdAt: new Date(),
    },
  });

  return NextResponse.json(note, { status: 201 });
}
