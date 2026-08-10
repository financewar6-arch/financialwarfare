import type { EditorialContent } from "@/content/types";
import { ASSETS } from "@/lib/assets";

interface MarketSnapshot {
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  change30d: number;
  volume24h: number;
  marketCap?: number;
  timestamp: Date;
}

/**
 * Generates dynamic editorial content based on real market data.
 * This runs daily via a scheduled job to update war room narratives.
 */
export async function generateDynamicEditorial(
  assetSlug: string,
  snapshot: MarketSnapshot
): Promise<EditorialContent> {
  const asset = Object.values(ASSETS).find((a) => a.slug === assetSlug);
  if (!asset) {
    throw new Error(`Asset not found: ${assetSlug}`);
  }

  const isUp = snapshot.change24h >= 0;
  const volatility = Math.abs(snapshot.change24h);
  const trending = Math.abs(snapshot.change7d) > Math.abs(snapshot.change24h) * 2;

  // Generate context-aware "why it moved"
  const whyItMoved = generateWhyItMoved(asset.name, snapshot, isUp, volatility, trending);
  
  // Generate risk assessment
  const risk = generateRiskAssessment(asset.name, volatility);
  
  // Generate forward-looking guidance
  const watchNext = generateWatchNext(asset.symbol, snapshot.marketCap);
  
  // Care factor based on market cap and volatility
  const whyYouShouldCare = generateWhyYouShouldCare(asset.name, snapshot.marketCap, volatility);

  return {
    photoLabel: `${asset.name} market snapshot`,
    whyItMoved,
    whyYouShouldCare,
    risk,
    watchNext,
  };
}

function generateWhyItMoved(
  assetName: string,
  snapshot: MarketSnapshot,
  isUp: boolean,
  volatility: number,
  trending: boolean
): string {
  const direction = isUp ? "rallied" : "declined";
  const magnitude = volatility > 5 ? "significantly" : volatility > 2 ? "modestly" : "slightly";

  const baseStmt = `${assetName} ${direction} ${magnitude} (${isUp ? "+" : ""}${snapshot.change24h.toFixed(2)}% / 24H).`;

  if (trending) {
    return `${baseStmt} Strong 7-day momentum (${snapshot.change7d > 0 ? "+" : ""}${snapshot.change7d.toFixed(2)}%) suggests institutional repositioning. Sentiment: ${isUp ? "BULLISH" : "BEARISH"} technical setup.`;
  }

  if (volatility > 5) {
    return `${baseStmt} High volatility driven by: (1) Risk repricing, (2) Sector rotation, (3) Earnings cycle. Watch correlations with sector peers for mean reversion.`;
  }

  return `${baseStmt} Normal trading range. Consolidation phase before next directional move. Monitor volume for breakout signals.`;
}

function generateRiskAssessment(assetName: string, volatility: number): string {
  if (volatility > 8) {
    return `Elevated risk environment. ${assetName} showing outsized moves. Position sizing critical. Stop losses recommended. Correlation risk with equities/rates rising. Black swan event probability elevated.`;
  }

  if (volatility > 4) {
    return `Moderate volatility. ${assetName} sensitive to macro shifts. Watch Fed policy, earnings guidance, and sector flows. Hedging recommended for concentrated positions.`;
  }

  return `Low volatility phase. ${assetName} pricing in stability. Risk: complacency. Prepare for potential vol expansion. Technical support/resistance levels critical.`;
}

function generateWatchNext(symbol: string, marketCap?: number): string {
  const capTier = marketCap ? (marketCap > 1e12 ? "mega-cap" : marketCap > 100e9 ? "large-cap" : "mid-cap") : "uncategorized";

  return `Key metrics to monitor: (1) Volume analysis for confirmation, (2) ${capTier} peer performance vs. ${symbol}, (3) Sector rotation flows. Next catalyst: earnings/macroeconomic data. Technical: watch key moving average crosses (20/50/200 EMAs). Macro context: Fed policy, rate expectations, risk sentiment.`;
}

function generateWhyYouShouldCare(assetName: string, marketCap?: number, volatility?: number): string {
  const impact = marketCap && marketCap > 500e9 ? "systemically important" : "emerging trend";

  return `${assetName} is ${impact} in its sector. Movements here signal broader market sentiment. ${volatility && volatility > 3 ? "High volatility creates opportunity window for tactical positioning." : "Stable pricing allows for strategic accumulation."} Track this as proxy for sector health and investor risk appetite.`;
}

/**
 * Example: Run daily via scheduled job
 * This updates editorial content in a cache/database
 */
export async function updateAllEditorials(marketSnapshots: Record<string, MarketSnapshot>) {
  const updates: Record<string, EditorialContent> = {};

  for (const [slug, snapshot] of Object.entries(marketSnapshots)) {
    try {
      updates[slug] = await generateDynamicEditorial(slug, snapshot);
    } catch (error) {
      console.error(`Failed to generate editorial for ${slug}:`, error);
    }
  }

  return updates;
}
