import { NextRequest, NextResponse } from "next/server";
import { detectAndPersistMarketEvents, getPersistedMarketEvents } from "@/lib/frontline";
import { getEventsByStatus, getRecentEvents } from "@/lib/db";

// GET /api/admin/events?status=ready&minScore=60
// Returns persisted market events from database
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const minScore = parseInt(searchParams.get("minScore") || "40");
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    let events;

    if (status) {
      events = getEventsByStatus(status, limit);
    } else {
      events = getRecentEvents(minScore, limit);
    }

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/admin/events/detect
// Manually trigger event detection and persistence
// (In production, this would be called by cron)
export async function POST(request: NextRequest) {
  try {
    const events = await detectAndPersistMarketEvents();

    return NextResponse.json({
      success: true,
      detected: events.length,
      events: events.slice(0, 10), // Return first 10
    });
  } catch (error) {
    console.error("Event detection failed:", error);
    return NextResponse.json(
      { error: "Event detection failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
