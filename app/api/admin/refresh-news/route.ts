import { NextRequest, NextResponse } from "next/server";
import { fetchAndCacheNews, getCacheStatus } from "@/lib/news-cache";

export async function GET(request: NextRequest) {
  // Security: Check for admin token in header
  const adminToken = request.headers.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN || "default-change-me";

  if (adminToken !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    console.log("📰 Refreshing news cache...");
    await fetchAndCacheNews("market");
    const status = getCacheStatus();

    return NextResponse.json({
      success: true,
      message: "News cache refreshed successfully",
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to refresh news:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh news cache",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Allow POST requests for easier curl/webhook calls
  return GET(request);
}
