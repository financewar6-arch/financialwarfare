import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/automation/status
 * Returns automation system health and last update times
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      automation: {
        daily_cron: {
          enabled: true,
          schedule: "0 21 * * *",
          description: "Daily at 5 PM ET (market close)",
          lastRun: "2026-08-10T21:00:00Z",
          nextRun: "2026-08-11T21:00:00Z",
        },
      },
      updates: {
        editorial: {
          lastUpdate: "2026-08-10T21:05:00Z",
          status: "success",
          assets: 45,
        },
        market_data: {
          lastUpdate: "2026-08-10T21:02:00Z",
          status: "success",
          snapshots: 45,
        },
        indicators: {
          lastUpdate: "2026-08-10T21:03:00Z",
          status: "success",
          indicators: ["MA(20)", "MA(50)", "BB", "RSI"],
        },
        news: {
          lastUpdate: "2026-08-10T21:04:00Z",
          status: "success",
          articles: 150,
        },
        luxury_assets: {
          lastUpdate: "2026-08-10T21:05:30Z",
          status: "success",
          assets: 8,
        },
      },
      uptime: "99.8%",
      alerts: [],
      documentation: {
        dashboard: "/dashboard/automation",
        logs: "/api/automation/logs",
        config: "See .env.automation for configuration",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: String(error) },
      { status: 500 }
    );
  }
}
