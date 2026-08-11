import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { hasFeatureAccess, PremiumFeature } from "@/lib/entitlements";

export async function GET(req: NextRequest) {
  const prisma = getPrisma();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has access to My War Rooms
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

  const warRooms = await prisma.myWarRoom.findMany({
    where: { userId: session.user.id },
    include: {
      thesis: true,
      notes: true,
      watching: true,
    },
    orderBy: { lastViewedAt: "desc" },
  });

  return NextResponse.json(warRooms);
}

export async function POST(req: NextRequest) {
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

  const { assetSlug, assetName, assetSymbol, thesisStatement } =
    await req.json();

  // Check if asset already has a war room for this user
  const existing = await prisma.myWarRoom.findFirst({
    where: {
      userId: session.user.id,
      assetSlug,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "War room already exists for this asset" },
      { status: 409 }
    );
  }

  const warRoom = await prisma.myWarRoom.create({
    data: {
      userId: session.user.id,
      assetSlug,
      assetName,
      assetSymbol,
      status: "active",
      isPremium: true,
      thesis: {
        create: {
          statement: thesisStatement,
          confidence: "medium",
          createdAt: new Date(),
        },
      },
    },
    include: {
      thesis: true,
    },
  });

  return NextResponse.json(warRoom, { status: 201 });
}
