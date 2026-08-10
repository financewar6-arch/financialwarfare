import { NextRequest, NextResponse } from "next/server";
import { generateDynamicEditorial } from "@/lib/pipeline/editorial-generator";
import { ASSETS } from "@/lib/assets";

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
    return null;
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const assets = Object.values(ASSETS).slice(0, 20);
    const updated = [];
    const failed = [];

    for (const asset of assets) {
      try {
        const snapshot = await fetchFinnhubQuote(asset.symbol);
        if (!snapshot) {
          failed.push(asset.slug);
          continue;
        }

        const editorial = await generateDynamicEditorial(asset.slug, snapshot);
        updated.push({
          asset: asset.slug,
          name: asset.name,
          editorial,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error(`Editorial generation failed for ${asset.slug}:`, error);
        failed.push(asset.slug);
      }
    }

    return NextResponse.json({
      success: true,
      updated: updated.length,
      failed: failed.length,
      total: assets.length,
      timestamp: new Date().toISOString(),
      source: "dynamic-generation",
      freshness: "live",
      details: updated.slice(0, 3).map((u) => ({
        asset: u.asset,
        whyItMoved: u.editorial.whyItMoved.substring(0, 100),
      })),
    });
  } catch (error) {
    console.error("Editorial refresh error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
