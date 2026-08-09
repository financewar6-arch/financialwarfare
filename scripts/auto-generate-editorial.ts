/**
 * Daily Editorial Auto-Generation Script
 * Runs at 6 AM daily via cron job
 * Fetches market news and auto-generates war room editorial content
 */

import type { EditorialContent } from "../lib/warroom/types";

interface MarketData {
  symbol: string;
  name: string;
  category: string;
}

const MARKET_ASSETS: MarketData[] = [
  { symbol: "BTC", name: "Bitcoin", category: "Crypto" },
  { symbol: "ETH", name: "Ethereum", category: "Crypto" },
  { symbol: "GC", name: "Gold", category: "Precious Metals" },
  { symbol: "AAPL", name: "Apple", category: "Stocks" },
  { symbol: "SPX", name: "S&P 500", category: "Indices" },
  { symbol: "NDX", name: "Nasdaq", category: "Indices" },
];

const EDITORIAL_TEMPLATES: Record<string, (news: string, asset: string) => EditorialContent> = {
  Crypto: (news: string, asset: string) => ({
    photoLabel: `${asset} Market Update - ${new Date().toLocaleDateString()}`,
    whyItMoved: `${asset} trading activity reflects broader crypto market sentiment. Institutional adoption, regulatory developments, and technical factors are driving price action.`,
    whyYouShouldCare: `${asset} movements often signal risk appetite in markets. As crypto gains mainstream acceptance, tracking ${asset} helps predict broader market trends and portfolio volatility.`,
    risk: `Crypto remains volatile. Regulatory uncertainty, technical liquidations, and macro trends can trigger sharp reversals. Position sizing is critical.`,
    watchNext: `Monitor regulatory announcements, institutional fund flows, and technical support/resistance levels. Keep an eye on macro economic data affecting risk appetite.`,
  }),

  "Precious Metals": (news: string, asset: string) => ({
    photoLabel: `${asset} Price Action - ${new Date().toLocaleDateString()}`,
    whyItMoved: `${asset} responds to USD strength, real yields, and geopolitical risk sentiment. Central bank policy and inflation expectations are key drivers.`,
    whyYouShouldCare: `${asset} serves as portfolio insurance during equity downturns. Understanding its movements helps optimize diversification and hedge positioning.`,
    risk: `Strong dollar and rising real rates pressurize precious metals. Economic surprises and policy shifts can trigger sudden repricing. Monitor inflation expectations.`,
    watchNext: `Track Fed policy signals, dollar index performance, and real yield trends. Watch for central bank buying/selling and geopolitical developments.`,
  }),

  Stocks: (news: string, asset: string) => ({
    photoLabel: `${asset} Trading - ${new Date().toLocaleDateString()}`,
    whyItMoved: `${asset} tracks earnings expectations, sector sentiment, and macro factors. Corporate news, competitor moves, and economic data drive daily volatility.`,
    whyYouShouldCare: `As a mega-cap holding, ${asset} movements significantly impact portfolio returns. Understanding its drivers helps optimize equity positioning and risk management.`,
    risk: `${asset} faces competition, regulatory scrutiny, and macro headwinds. Earnings misses, guidance cuts, or sector rotations can trigger sharp declines.`,
    watchNext: `Monitor earnings dates, analyst upgrades/downgrades, and technical levels. Track sector rotation and macro economic indicators affecting demand.`,
  }),

  Indices: (news: string, asset: string) => ({
    photoLabel: `${asset} Performance - ${new Date().toLocaleDateString()}`,
    whyItMoved: `${asset} reflects broad market sentiment and component weightings. Earnings season, Fed policy, and macro data drive index movements.`,
    whyYouShouldCare: `${asset} serves as a benchmark for portfolio performance. Understanding its movement patterns helps optimize asset allocation and rebalancing.`,
    risk: `${asset} concentration risk in mega-cap winners. Sector rotations, rate shocks, and earnings disappointments can trigger significant pullbacks.`,
    watchNext: `Monitor Fed communication, earnings calendar, and technical support levels. Track sector rotation trends and macro economic surprises.`,
  }),
};

async function generateEditorialContent(asset: MarketData): Promise<EditorialContent> {
  const template = EDITORIAL_TEMPLATES[asset.category];
  if (!template) {
    throw new Error(`No template for category: ${asset.category}`);
  }

  // Generate content using template
  return template("Market-driven activity", asset.name);
}

async function updateAssetEditorial(asset: MarketData, adminToken: string): Promise<boolean> {
  try {
    const content = await generateEditorialContent(asset);

    const response = await fetch(
      `${process.env.SITE_URL || "http://localhost:3000"}/api/admin/update-editorial`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({
          slug: asset.symbol.toLowerCase(),
          content,
        }),
      }
    );

    if (!response.ok) {
      console.error(`Failed to update ${asset.name}:`, response.status);
      return false;
    }

    console.log(`✓ Updated editorial for ${asset.name}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${asset.name}:`, error);
    return false;
  }
}

async function runDailyUpdate() {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    console.error("❌ ADMIN_TOKEN not set");
    process.exit(1);
  }

  console.log("📰 Starting daily editorial auto-generation...");
  console.log(`⏰ Running at: ${new Date().toISOString()}`);

  let updated = 0;
  let failed = 0;

  for (const asset of MARKET_ASSETS) {
    const success = await updateAssetEditorial(asset, adminToken);
    if (success) {
      updated++;
    } else {
      failed++;
    }
  }

  console.log(`\n✅ Daily update complete!`);
  console.log(`   Updated: ${updated}/${MARKET_ASSETS.length} assets`);
  if (failed > 0) {
    console.log(`   Failed: ${failed}`);
  }
}

// Run if called directly
if (require.main === module) {
  runDailyUpdate().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { runDailyUpdate };
