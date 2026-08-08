// Economic Calendar Event Filtering
// Filters calendar events to show only relevant to user's stocks/portfolio

import { EconomicEvent, getUpcomingEvents } from "./economic-calendar";

export interface AssetCalendarRelevance {
  event: EconomicEvent;
  relevanceScore: number; // 0-100: how relevant to user's assets
  impactedAssets: string[]; // Which user assets this affects
  reasoning: string;
}

const EVENT_ASSET_MAPPING: Record<string, string[]> = {
  // Macro events that affect all assets
  "Initial Jobless Claims": ["spy", "qqq", "iwm", "bitcoin", "ethereum"],
  "Retail Sales": ["spy", "qqq", "iwm"],
  "PPI (Producer Prices)": ["spy", "qqq", "iwm", "commodity"],
  "CPI (Inflation)": ["spy", "qqq", "iwm", "bitcoin", "ethereum", "gold"],
  "Non-Farm Payroll (NFP)": ["spy", "qqq", "iwm", "bitcoin", "ethereum"],
  "FOMC Decision & Powell Press Conference": ["spy", "qqq", "iwm", "bitcoin", "ethereum", "gold"],
  "ISM Manufacturing PMI": ["spy", "qqq", "iwm"],
  "Durable Goods Orders": ["spy", "qqq", "iwm"],
  "GDP (Advance)": ["spy", "qqq", "iwm", "bitcoin", "ethereum"],
};

export function filterCalendarForAssets(
  userAssets: string[], // bitcoin, nvda, spy, gold, etc.
  daysAhead: number = 30
): AssetCalendarRelevance[] {
  const allEvents = getUpcomingEvents(daysAhead);
  const relevant: AssetCalendarRelevance[] = [];

  for (const event of allEvents) {
    const affectedAssets = EVENT_ASSET_MAPPING[event.event] || [];

    // Check if any of user's assets are affected
    const userAssetMatches = userAssets.filter((asset) =>
      affectedAssets.some((affected) => affected.includes(asset.toLowerCase()))
    );

    if (userAssetMatches.length > 0) {
      // Calculate relevance based on impact level and number of matches
      const impactScore = event.impact === "high" ? 30 : event.impact === "medium" ? 20 : 10;
      const matchScore = userAssetMatches.length * 10; // Boost for each matching asset
      const relevanceScore = Math.min(100, impactScore + matchScore);

      relevant.push({
        event,
        relevanceScore,
        impactedAssets: userAssetMatches,
        reasoning: generateReasoningText(event, userAssetMatches),
      });
    }
  }

  // Sort by relevance score (highest first)
  return relevant.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function generateReasoningText(event: EconomicEvent, impactedAssets: string[]): string {
  const assetList = impactedAssets.join(", ").toUpperCase();
  const impactText =
    event.impact === "high"
      ? "Could cause significant moves"
      : event.impact === "medium"
        ? "May affect prices"
        : "Could influence sentiment";

  return `${impactText} in ${assetList}`;
}

export interface PortfolioAssets {
  stocks: string[]; // nvda, msft, aapl, etc.
  crypto: string[]; // bitcoin, ethereum, etc.
  commodities: string[]; // gold, oil, etc.
  indices: string[]; // spy, qqq, iwm, etc.
}

export function getCalendarRelevanceForPortfolio(
  portfolio: PortfolioAssets,
  daysAhead: number = 30
): AssetCalendarRelevance[] {
  const allAssets = [
    ...portfolio.stocks,
    ...portfolio.crypto,
    ...portfolio.commodities,
    ...portfolio.indices,
  ];

  return filterCalendarForAssets(allAssets, daysAhead);
}

// Get most important events for user's assets
export function getTopEventsForAssets(
  userAssets: string[],
  limit: number = 5,
  daysAhead: number = 30
): AssetCalendarRelevance[] {
  return filterCalendarForAssets(userAssets, daysAhead).slice(0, limit);
}
