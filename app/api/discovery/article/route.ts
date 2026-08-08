import { NextRequest, NextResponse } from "next/server";
import { getMarketEvent, getAllMarketEvents } from "@/lib/db";
import { ASSETS } from "@/lib/assets";

interface ArticleResponse {
  symbol: string;
  name: string;
  direction: "up" | "down";
  priceChange: number;
  headline: string;
  whyItMoved: string;
  whyItMatters: string;
  relatedAssets: Array<{ symbol: string; name: string; priceChange: number }>;
  whatToWatch: string[];
  sources: Array<{ title: string; source: string; timeAgo: string }>;
  warRoomUrl: string;
  timestamp: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol")?.toUpperCase();
    const direction = (searchParams.get("direction") || "up") as "up" | "down";
    const category = searchParams.get("category") || "stocks";

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    // Find the asset
    const asset = Object.values(ASSETS).find((a) => a.symbol === symbol);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Get all market events for this asset
    const allEvents = getAllMarketEvents();
    const events = allEvents.filter((e) => e.assetSymbol === symbol);

    if (events.length === 0) {
      return NextResponse.json({ error: "No events for this asset" }, { status: 404 });
    }

    // Get the most recent event matching direction
    const mainEvent = events.find((e) => {
      if (direction === "up") return e.priceChange >= 1;
      return e.priceChange <= -1;
    }) || events[0];

    // Check importance score
    if ((mainEvent.importanceScore || 50) < 70) {
      return NextResponse.json(
        { error: "Event importance too low for article" },
        { status: 404 }
      );
    }

    // Find related assets (other assets moving similarly)
    const relatedAssets = allEvents
      .filter(
        (e) =>
          e.assetSymbol !== symbol &&
          Math.sign(e.priceChange) === Math.sign(mainEvent.priceChange) &&
          Math.abs(e.priceChange) >= 0.5
      )
      .slice(0, 3)
      .map((e) => ({
        symbol: e.assetSymbol,
        name: ASSETS[e.assetSlug as keyof typeof ASSETS]?.name || e.assetName,
        priceChange: e.priceChange,
      }));

    // Build what to watch
    const whatToWatch = [
      mainEvent.whatToWatch || `Monitor ${symbol} for further developments`,
      ...(mainEvent.risks?.slice(0, 2) || []),
    ].filter(Boolean);

    // Mock sources (in production, these would come from news API)
    const sources = [
      {
        title: mainEvent.headline,
        source: "Market Intelligence",
        timeAgo: "just now",
      },
      {
        title: `${symbol} trading activity increases`,
        source: "Trading Desk",
        timeAgo: "5 min ago",
      },
      {
        title: `Sector ${direction === "up" ? "strength" : "weakness"} in ${asset.name}`,
        source: "Market Analysis",
        timeAgo: "15 min ago",
      },
    ];

    const article: ArticleResponse = {
      symbol: mainEvent.assetSymbol,
      name: asset.name,
      direction,
      priceChange: mainEvent.priceChange,
      headline: mainEvent.headline,
      whyItMoved: mainEvent.whyItMoved || "Market movement detected",
      whyItMatters: mainEvent.whyItMatters || "This is an important market development",
      relatedAssets,
      whatToWatch,
      sources,
      warRoomUrl: `/war-room/${asset.slug}`,
      timestamp: mainEvent.timestamp || Date.now(),
    };

    return NextResponse.json(article);
  } catch (error) {
    console.error("Article generation error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
