import { NextRequest, NextResponse } from "next/server";
import { getContentQueueByStatus, updateContentQueueItem } from "@/lib/db";
import { generateVideo } from "@/lib/video/video-generator";

// Cron Job: Auto-generate videos for approved scripts
// Runs every 30 minutes during market hours
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const secret = request.headers.get("authorization")?.replace("Bearer ", "");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all APPROVED scripts waiting for video generation
    const approvedItems = getContentQueueByStatus("APPROVED", 10);

    if (approvedItems.length === 0) {
      return NextResponse.json({
        message: "No approved scripts to process",
        processed: 0,
        successful: 0,
        failed: 0,
      });
    }

    let successful = 0;
    let failed = 0;

    // Process each approved item
    for (const item of approvedItems) {
      try {
        const result = await generateVideo({
          contentQueueId: item.id,
          template: "market_moves", // Default template
        });

        if (result.status === "success") {
          successful++;
          // Publish video after successful generation
          updateContentQueueItem(item.id, {
            status: "PUBLISHED",
            publishedAt: Date.now(),
          });
          console.log(`✓ Generated & published video for ${item.assetSymbol}`);
        } else {
          failed++;
          console.error(`✗ Failed to generate video for ${item.assetSymbol}: ${result.error}`);
        }
      } catch (error) {
        failed++;
        console.error(`✗ Error processing ${item.assetSymbol}:`, error);

        // Mark as failed
        updateContentQueueItem(item.id, {
          status: "FAILED",
        });
      }
    }

    return NextResponse.json({
      message: "Cron job completed",
      processed: approvedItems.length,
      successful,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        error: String(error),
        processed: 0,
        successful: 0,
        failed: 0,
      },
      { status: 500 }
    );
  }
}
