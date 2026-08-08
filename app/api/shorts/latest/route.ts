import { NextRequest, NextResponse } from "next/server";
import { getLatestVideos, getMarketEvent } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const videos = getLatestVideos(limit);

    if (!videos.length) {
      return NextResponse.json({ videos: [], total: 0 });
    }

    // Transform VideoMetadata to Short format for frontend
    const shorts = videos.map((video) => {
      // Fetch the related MarketEvent to get asset details
      const event = video.marketEventId ? getMarketEvent(video.marketEventId) : null;

      // Generate full news brief from market event
      const generateNewsBrief = (evt: any) => {
        if (!evt) return "";

        const priceDirection = evt.priceChange >= 0 ? "gaining" : "losing";
        const priceStr = Math.abs(evt.priceChange).toFixed(2);

        return `${evt.headline}

${evt.assetName} (${evt.assetSymbol}) is ${priceDirection} ${priceStr}% today. ${evt.whyItMoved || "Market movement detected."}

${evt.whyItMatters || "This is an important market development."} Traders should monitor this situation closely as it could indicate broader market trends. Keep watching this asset for further developments.`;
      };

      return {
        id: video.id,
        title: video.title,
        assetSymbol: event?.assetSymbol || "ASSET",
        assetName: event?.assetName || "Asset",
        priceChange: event?.priceChange || 0,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnail?.url,
        duration: video.duration,
        generatedAt: video.generatedAt,
        assetSlug: event?.assetSlug || "",
        headline: event?.headline || video.title,
        whyItMoved: event?.whyItMoved || "Market movement detected",
        significance: event?.whyItMatters || "Important market event",
        newsBrief: generateNewsBrief(event),
      };
    });

    return NextResponse.json({
      videos: shorts,
      total: videos.length,
    });
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json({ error: String(error), videos: [] }, { status: 500 });
  }
}
