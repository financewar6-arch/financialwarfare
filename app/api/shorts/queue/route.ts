import { NextRequest, NextResponse } from "next/server";
import { getContentQueueByStatus, getAllContentQueue } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let items;

    if (status) {
      items = getContentQueueByStatus(status, limit);
    } else {
      items = getAllContentQueue(limit);
    }

    return NextResponse.json({
      items,
      total: items.length,
      status: status || "all",
    });
  } catch (error) {
    console.error("Failed to fetch queue:", error);
    return NextResponse.json({ error: String(error), items: [] }, { status: 500 });
  }
}
