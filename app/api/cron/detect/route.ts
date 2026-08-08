import { NextRequest, NextResponse } from "next/server";
import { runDetectionPipeline } from "@/lib/scheduler/cron-jobs";

/**
 * Vercel Cron API endpoint for market event detection
 * Runs every 5 minutes during market hours
 * Detects price spikes and volume surges, enriches with AI analysis
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get("authorization");
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await runDetectionPipeline();
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: "Detection pipeline executed",
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        error: "Pipeline failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
