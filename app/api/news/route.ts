import { NextRequest, NextResponse } from "next/server";
import { getCachedNews, getCacheStatus } from "@/lib/news-cache";

export async function GET(request: NextRequest) {
  // Return cached news (updated every 12 hours via cron job)
  const articles = getCachedNews();
  const status = getCacheStatus();

  return NextResponse.json({
    articles,
    cache: {
      cachedAt: status.cachedAt,
      expiresAt: status.expiresAt,
      isExpired: status.isExpired,
    },
  });
}
