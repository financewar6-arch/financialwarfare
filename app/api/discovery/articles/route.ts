import { NextRequest, NextResponse } from "next/server";
import { getAllMarketEvents } from "@/lib/db";
import { ASSETS } from "@/lib/assets";

export async function GET(request: NextRequest) {
  try {
    const events = getAllMarketEvents();

    // Filter for high-importance events that haven't expired
    const articleEvents = events
      .filter((e) => (e.importanceScore || 50) >= 70 && e.expiresAt > Date.now())
      .slice(0, 50);

    const articles = articleEvents
      .map((event) => {
        const asset = ASSETS[event.assetSlug as keyof typeof ASSETS];
        if (!asset) return null;

        return {
          symbol: event.assetSymbol,
          name: asset.name,
          direction: event.priceChange >= 0 ? "up" : "down",
          priceChange: event.priceChange,
          headline: event.headline,
          category: asset.category || "stocks",
          timestamp: event.timestamp || event.updatedAt,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      articles,
      total: articles.length,
    });
  } catch (error) {
    console.error("Failed to fetch discovery articles:", error);
    return NextResponse.json({ error: String(error), articles: [] }, { status: 500 });
  }
}
