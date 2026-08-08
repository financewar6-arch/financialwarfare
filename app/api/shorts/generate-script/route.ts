import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateYoutubeScript } from "@/lib/generators/youtube-script-generator";
import { getMarketEvent, updateMarketEvent } from "@/lib/db";
import { createContentQueueItem } from "@/lib/db";
import type { ContentQueue } from "@/lib/models/video-content";

export async function POST(request: NextRequest) {
  try {
    const { marketEventId } = await request.json();

    if (!marketEventId) {
      return NextResponse.json({ error: "marketEventId required" }, { status: 400 });
    }

    // Fetch market event
    const event = getMarketEvent(marketEventId);
    if (!event) {
      return NextResponse.json({ error: "Market event not found" }, { status: 404 });
    }

    // Generate script from market event
    const script = await generateYoutubeScript({ event });

    // Create content queue item (goes to DRAFT for user review)
    const queueItem: ContentQueue = {
      id: uuidv4(),
      marketEventId: event.id,
      videoType: "YOUTUBE_SHORT",
      scriptId: script.id,
      title: event.headline,
      description: event.summary || event.whyItMatters || "",
      assetSlug: event.assetSlug,
      assetSymbol: event.assetSymbol,
      assetName: event.assetName,
      priceChange: event.priceChange,
      status: "DRAFT",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      flaggedIssues: script.flaggedIssues,
    };

    createContentQueueItem(queueItem);

    // Mark event as script generated
    updateMarketEvent(event.id, {
      youtubeScriptGenerated: true,
    });

    return NextResponse.json({
      success: true,
      contentQueueId: queueItem.id,
      scriptId: script.id,
      status: "DRAFT",
      script: script,
      flaggedIssues: script.flaggedIssues,
      message: "Script generated and awaiting approval",
    });
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
