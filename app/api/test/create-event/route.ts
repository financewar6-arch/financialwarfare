import { NextRequest, NextResponse } from "next/server";
import { createMarketEvent } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const assetSlug = body.assetSlug || "nvidia";

    const assetMap: Record<string, { name: string; symbol: string; headline: string; why: string; matters: string; change: number }> = {
      nvidia: {
        name: "NVIDIA",
        symbol: "NVDA",
        headline: "NVIDIA surges 5.8% on AI breakthrough announcement",
        why: "Company announced significant advancements in AI chip architecture and new enterprise partnerships for data center solutions",
        matters: "This development could accelerate adoption of NVIDIA's latest-generation chips across enterprise and cloud computing sectors",
        change: 5.8,
      },
      apple: {
        name: "Apple",
        symbol: "AAPL",
        headline: "Apple rises 3.2% after strong iPhone sales report",
        why: "New quarterly earnings exceed analyst expectations with strong iPhone demand from emerging markets",
        matters: "Strong sales indicate robust consumer demand and potential upside to revenue guidance",
        change: 3.2,
      },
      bitcoin: {
        name: "Bitcoin",
        symbol: "BTC",
        headline: "Bitcoin surges 4.5% on institutional adoption news",
        why: "Major financial institutions announce expanded cryptocurrency trading platforms",
        matters: "Increased institutional participation could drive mainstream adoption and market stability",
        change: 4.5,
      },
      gold: {
        name: "Gold",
        symbol: "GC=F",
        headline: "Gold rallies 2.1% on Fed pause expectations",
        why: "Market pricing in potential interest rate pause due to economic slowdown signals",
        matters: "Safe-haven demand increases amid economic uncertainty and geopolitical tensions",
        change: 2.1,
      },
    };

    const asset = assetMap[assetSlug] || assetMap.nvidia;
    const eventId = uuidv4();

    const testEvent = createMarketEvent({
      id: eventId,
      assetSlug: assetSlug,
      assetName: asset.name,
      assetSymbol: asset.symbol,
      assetType: assetSlug === "bitcoin" || assetSlug === "gold" ? "crypto" : "stock",
      eventType: "price_spike",
      headline: asset.headline,
      summary: asset.headline,
      whyItMoved: asset.why,
      whyItMatters: asset.matters,
      importanceScore: 85,
      confidenceScore: 90,
      priceChange: asset.change,
      volumeRatio: 3.2,
      detectedAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600 * 1000,
    });

    return NextResponse.json({
      success: true,
      eventId: testEvent.id,
      message: `Test market event created for ${asset.name}`,
      event: testEvent,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
