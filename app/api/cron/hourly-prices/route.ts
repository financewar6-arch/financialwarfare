import { NextRequest, NextResponse } from "next/server";
import { ASSETS } from "@/lib/assets";

/**
 * Vercel Cron: Hourly Price Update
 * Runs every hour: 0 * * * *
 * Fetches fresh prices from Finnhub for real-time updates
 */

async function fetchFinnhubQuote(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;

    const data = await response.json();
    return {
      symbol,
      price: data.c || 0,
      change24h: data.dp || 0,
      volume24h: data.v || 0,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(`Finnhub fetch error for ${symbol}:`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = {
      timestamp: new Date().toISOString(),
      updated: 0,
      failed: 0,
      prices: [] as any[],
    };

    // Fetch prices for top 20 assets (respects rate limits)
    const assets = Object.values(ASSETS).slice(0, 20);

    for (const asset of assets) {
      const quote = await fetchFinnhubQuote(asset.symbol);
      if (quote) {
        results.prices.push({
          slug: asset.slug,
          symbol: asset.symbol,
          price: quote.price,
          change24h: quote.change24h,
          volume24h: quote.volume24h,
        });
        results.updated++;
      } else {
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      message: "Hourly price update complete",
      nextRun: new Date(Date.now() + 3600000).toISOString(),
    });
  } catch (error) {
    console.error("Hourly price update error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
