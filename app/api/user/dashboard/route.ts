import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = request.nextUrl.searchParams.get("userId") || (session.user as any).id;

    // Verify user owns this data
    if (userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Fetch user's war room count
    const warRooms = await prisma.myWarRoom.findMany({
      where: { userId },
      select: { id: true },
    });

    // TODO: Fetch watchlist from database once implemented
    const watchlistCount = 5;

    return NextResponse.json({
      success: true,
      warRoomCount: warRooms.length,
      watchlistCount,
      userId,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
