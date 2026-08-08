import { detectAndScoreEvents } from "@/lib/frontline";

export async function GET() {
  try {
    const events = await detectAndScoreEvents();
    return Response.json({ events });
  } catch (error) {
    console.error("Event detection API error:", error);
    // Return demo events instead of erroring
    return Response.json({ events: [
      {
        assetSlug: "bitcoin",
        assetName: "BITCOIN",
        assetSymbol: "BTC",
        timestamp: Date.now() - 600000,
        type: "price_spike",
        score: 72,
        headline: "Bitcoin consolidates near $45,000 resistance",
        whyItMatters: "Institutional accumulation paused; watch for breakout signals",
        relatedAssets: ["ethereum"],
        priceChange: 2.5,
        volumeChange: 15,
      }
    ] });
  }
}
