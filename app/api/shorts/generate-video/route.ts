import { NextRequest, NextResponse } from "next/server";
import { generateVideo } from "@/lib/video/video-generator";
import { getContentQueueItem } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { contentQueueId, template = "market_moves" } = await request.json();

    if (!contentQueueId) {
      return NextResponse.json({ error: "contentQueueId required" }, { status: 400 });
    }

    // Verify the item exists and is in APPROVED state
    const item = getContentQueueItem(contentQueueId);
    if (!item) {
      return NextResponse.json({ error: "Content queue item not found" }, { status: 404 });
    }

    if (item.status !== "APPROVED") {
      return NextResponse.json(
        { error: `Content must be APPROVED to generate video (current: ${item.status})` },
        { status: 400 }
      );
    }

    // Generate the video
    const result = await generateVideo({
      contentQueueId,
      template: template as "market_moves" | "price_action" | "breaking_news",
    });

    if (result.status === "failed") {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          videoId: "",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      videoId: result.videoId,
      videoUrl: result.videoUrl,
      thumbnailUrl: result.thumbnailUrl,
      duration: result.duration,
      status: "READY",
      message: "Video generated successfully",
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json({ error: String(error), success: false }, { status: 500 });
  }
}
