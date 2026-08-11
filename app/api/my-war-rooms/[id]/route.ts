import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { hasFeatureAccess, PremiumFeature } from "@/lib/entitlements";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    include: {
      thesis: true,
      notes: true,
      watching: true,
    },
  });

  if (!warRoom) {
    return NextResponse.json({ error: "War room not found" }, { status: 404 });
  }

  // Security: users can only view their own war rooms
  if (warRoom.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Update lastViewedAt
  await prisma.myWarRoom.update({
    where: { id: params.id },
    data: { lastViewedAt: new Date() },
  });

  return NextResponse.json(warRoom);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  if (!warRoom) {
    return NextResponse.json({ error: "War room not found" }, { status: 404 });
  }

  if (warRoom.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { status } = await req.json();

  const updated = await prisma.myWarRoom.update({
    where: { id: params.id },
    data: { status },
    include: {
      thesis: true,
      notes: true,
      watching: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warRoom = await prisma.myWarRoom.findUnique({
    where: { id: params.id },
  });

  if (!warRoom) {
    return NextResponse.json({ error: "War room not found" }, { status: 404 });
  }

  if (warRoom.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.myWarRoom.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
