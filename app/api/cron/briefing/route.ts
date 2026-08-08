import { NextRequest, NextResponse } from "next/server";
import { runDailyBriefingPipeline } from "@/lib/scheduler/cron-jobs";

/**
 * Vercel Cron API endpoint for daily market briefing
 * Configure in vercel.json:
 *   "crons": [{
 *     "path": "/api/cron/briefing",
 *     "schedule": "0 9 * * MON-FRI"  // 9 AM EST weekdays
 *   }]
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const cronSecret = request.headers.get("authorization");
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await runDailyBriefingPipeline();
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: "Daily briefing generated",
    });
  } catch (error) {
    console.error("Briefing job failed:", error);
    return NextResponse.json(
      {
        error: "Briefing generation failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
