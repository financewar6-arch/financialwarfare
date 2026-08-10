import { NextRequest, NextResponse } from "next/server";
import { ASSETS } from "@/lib/assets";

async function fetchFinnhubQuote(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return { symbol, price: 0, change24h: 0, volume24h: 0 };

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { cache: "no-store" }
    );
    if (!response.ok) return { symbol, price: 0, change24h: 0, volume24h: 0 };

    const data = await response.json();
    return {
      symbol,
      price: data.c || 0,
      change24h: data.dp || 0,
      volume24h: data.v || 0,
    };
  } catch (error) {
    console.error(`Finnhub fetch error for ${symbol}:`, error);
    return { symbol, price: 0, change24h: 0, volume24h: 0 };
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshots: Record<string, any> = {};
    const assets = Object.values(ASSETS).slice(0, 15);

    for (const asset of assets) {
      const quote = await fetchFinnhubQuote(asset.symbol);
      snapshots[asset.slug] = quote;
    }

    return NextResponse.json({
      success: true,
      snapshots,
      count: Object.keys(snapshots).length,
      timestamp: new Date().toISOString(),
      source: "finnhub",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
