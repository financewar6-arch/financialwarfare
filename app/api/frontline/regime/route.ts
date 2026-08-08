import { getMarketRegime } from "@/lib/frontline";

export async function GET() {
  try {
    const regime = await getMarketRegime();
    return Response.json({ regime });
  } catch (error) {
    console.error("Regime detection API error:", error);
    return Response.json(
      { regime: { vixLevel: 20, treasuryYield: 3.5, regime: "neutral", timestamp: Date.now(), reasoning: "Error fetching data" }, error: "Regime unavailable" },
      { status: 502 }
    );
  }
}
