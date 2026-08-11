import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PREMIUM_CONFIG } from "@/lib/premium-config";

const prisma = new PrismaClient();

/**
 * GET /api/my-war-rooms
 * Get all war rooms for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Get all war rooms for this user
    const warRooms = await prisma.myWarRoom.findMany({
      where: { userId },
      include: {
        thesis: true,
        notes: true,
        watching: true,
      },
      orderBy: { lastViewedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      warRooms,
      total: warRooms.length,
    });
  } catch (error) {
    console.error("Error in GET /api/my-war-rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch war rooms", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/my-war-rooms
 * Create a new war room or perform actions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, warRoomId, ...data } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Check if premium feature is enabled
    if (!PREMIUM_CONFIG.enabled) {
      return NextResponse.json(
        { error: "MY WAR ROOM feature is not enabled" },
        { status: 403 }
      );
    }

    // CREATE a new war room
    if (action === "create") {
      const warRoom = await prisma.myWarRoom.create({
        data: {
          userId,
          assetSlug: data.assetSlug,
          assetName: data.assetName,
          assetSymbol: data.assetSymbol,
          status: "active",
          isPremium: false,
          thesis: {
            create: {
              content: data.thesisContent,
            },
          },
          watching: data.watching
            ? {
                create: {
                  catalyst: data.watching.catalyst,
                  mainRisk: data.watching.mainRisk,
                  upcomingEvent: data.watching.upcomingEvent,
                },
              }
            : undefined,
        },
        include: {
          thesis: true,
          notes: true,
          watching: true,
        },
      });

      return NextResponse.json({
        success: true,
        warRoom,
        message: "War room created successfully",
      });
    }

    // UPDATE a war room
    if (action === "update") {
      if (!warRoomId) {
        return NextResponse.json(
          { error: "War room ID required" },
          { status: 400 }
        );
      }

      // Verify ownership
      const existing = await prisma.myWarRoom.findUnique({
        where: { id: warRoomId },
      });

      if (!existing || existing.userId !== userId) {
        return NextResponse.json(
          { error: "War room not found" },
          { status: 404 }
        );
      }

      const warRoom = await prisma.myWarRoom.update({
        where: { id: warRoomId },
        data: {
          thesis: data.thesisContent
            ? {
                update: {
                  content: data.thesisContent,
                },
              }
            : undefined,
          watching: data.watching
            ? {
                upsert: {
                  create: {
                    catalyst: data.watching.catalyst,
                    mainRisk: data.watching.mainRisk,
                    upcomingEvent: data.watching.upcomingEvent,
                  },
                  update: {
                    catalyst: data.watching.catalyst,
                    mainRisk: data.watching.mainRisk,
                    upcomingEvent: data.watching.upcomingEvent,
                  },
                },
              }
            : undefined,
          status: data.status,
        },
        include: {
          thesis: true,
          notes: true,
          watching: true,
        },
      });

      return NextResponse.json({
        success: true,
        warRoom,
      });
    }

    // ADD NOTE
    if (action === "add_note") {
      if (!warRoomId || !data.content) {
        return NextResponse.json(
          { error: "War room ID and note content required" },
          { status: 400 }
        );
      }

      // Verify ownership
      const existing = await prisma.myWarRoom.findUnique({
        where: { id: warRoomId },
      });

      if (!existing || existing.userId !== userId) {
        return NextResponse.json(
          { error: "War room not found" },
          { status: 404 }
        );
      }

      await prisma.personalNote.create({
        data: {
          warRoomId,
          content: data.content,
        },
      });

      const warRoom = await prisma.myWarRoom.findUnique({
        where: { id: warRoomId },
        include: {
          thesis: true,
          notes: true,
          watching: true,
        },
      });

      return NextResponse.json({
        success: true,
        warRoom,
      });
    }

    // UPDATE NOTE
    if (action === "update_note") {
      if (!warRoomId || !data.noteId || !data.content) {
        return NextResponse.json(
          { error: "War room ID, note ID, and content required" },
          { status: 400 }
        );
      }

      // Verify ownership
      const existing = await prisma.myWarRoom.findUnique({
        where: { id: warRoomId },
      });

      if (!existing || existing.userId !== userId) {
        return NextResponse.json(
          { error: "War room not found" },
          { status: 404 }
        );
      }

      await prisma.personalNote.update({
        where: { id: data.noteId },
        data: { content: data.content },
      });

      const warRoom = await prisma.myWarRoom.findUnique({
        where: { id: warRoomId },
        include: {
          thesis: true,
          notes: true,
          watching: true,
        },
      });

      return NextResponse.json({
        success: true,
        warRoom,
      });
    }

    // DELETE NOTE
    if (action === "delete_note") {
      if (!warRoomId || !data.noteId) {
        return NextResponse.json(
          { error: "War room ID and note ID required" },
          { status: 400 }
        );
      }

      // Verify ownership
      const existing = await prisma.myWarRoom.findUnique({
        where: { id: warRoomId },
      });

      if (!existing || existing.userId !== userId) {
        return NextResponse.json(
          { error: "War room not found" },
          { status: 404 }
        );
      }

      await prisma.personalNote.delete({
        where: { id: data.noteId },
      });

      const warRoom = await prisma.myWarRoom.findUnique({
        where: { id: warRoomId },
        include: {
          thesis: true,
          notes: true,
          watching: true,
        },
      });

      return NextResponse.json({
        success: true,
        warRoom,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST /api/my-war-rooms:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: String(error) },
      { status: 500 }
    );
  }
}
