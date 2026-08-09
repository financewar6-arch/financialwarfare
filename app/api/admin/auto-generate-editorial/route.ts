import { NextRequest, NextResponse } from "next/server";
import { updateEditorial } from "@/lib/editorial-cache";
import type { EditorialContent } from "@/lib/warroom/types";

interface Asset {
  slug: string;
  name: string;
  category: string;
}

const ASSETS: Asset[] = [
  { slug: "bitcoin", name: "Bitcoin", category: "Crypto" },
  { slug: "ethereum", name: "Ethereum", category: "Crypto" },
  { slug: "gold", name: "Gold", category: "Precious Metals" },
  { slug: "apple", name: "Apple", category: "Stocks" },
  { slug: "sp500", name: "S&P 500", category: "Indices" },
  { slug: "nasdaq", name: "Nasdaq", category: "Indices" },
];

function generateEditorial(asset: Asset): EditorialContent {
  const templates: Record<string, EditorialContent> = {
    "Crypto": {
      photoLabel: `${asset.name} Market Update`,
      whyItMoved: `${asset.name} trading reflects crypto market sentiment. Institutional adoption and regulatory developments continue to drive price action.`,
      whyYouShouldCare: `${asset.name} movements signal risk appetite in markets. As crypto gains mainstream acceptance, tracking ${asset.name} helps predict portfolio volatility.`,
      risk: `Crypto remains volatile. Regulatory uncertainty and technical liquidations can trigger sharp reversals. Position sizing is critical.`,
      watchNext: `Monitor regulatory announcements, institutional fund flows, and technical support/resistance levels. Track macro economic data.`,
    },
    "Precious Metals": {
      photoLabel: `${asset.name} Price Update`,
      whyItMoved: `${asset.name} responds to USD strength, real yields, and geopolitical risk. Central bank policy and inflation expectations are key drivers.`,
      whyYouShouldCare: `${asset.name} serves as portfolio insurance during equity downturns. Understanding its movements optimizes diversification and hedge positioning.`,
      risk: `Strong dollar and rising real rates pressure precious metals. Economic surprises and policy shifts trigger sudden repricing.`,
      watchNext: `Track Fed policy signals, dollar index performance, and real yield trends. Monitor geopolitical developments.`,
    },
    "Stocks": {
      photoLabel: `${asset.name} Trading Update`,
      whyItMoved: `${asset.name} tracks earnings expectations and sector sentiment. Corporate news and macro factors drive daily volatility.`,
      whyYouShouldCare: `As a major holding, ${asset.name} significantly impacts portfolio returns. Understanding drivers optimizes equity positioning.`,
      risk: `${asset.name} faces competition and regulatory scrutiny. Earnings misses or sector rotations trigger sharp declines.`,
      watchNext: `Monitor earnings dates, analyst moves, and technical levels. Track sector rotation and macro indicators.`,
    },
    "Indices": {
      photoLabel: `${asset.name} Performance Update`,
      whyItMoved: `${asset.name} reflects broad market sentiment and earnings. Fed policy and macro data drive index movements.`,
      whyYouShouldCare: `${asset.name} serves as a performance benchmark. Understanding movements optimizes asset allocation and rebalancing.`,
      risk: `${asset.name} concentration in mega-caps. Sector rotations and earnings disappointments trigger pullbacks.`,
      watchNext: `Monitor Fed communication, earnings calendar, and technical support. Track sector rotation trends and macro surprises.`,
    },
  };

  return templates[asset.category] || templates["Stocks"];
}

export async function POST(request: NextRequest) {
  // Security: Check admin token
  const adminToken = request.headers.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN || "default-change-me";

  if (adminToken !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    console.log("📰 Starting daily editorial auto-generation...");

    let updated = 0;
    const results = [];

    for (const asset of ASSETS) {
      try {
        const editorial = generateEditorial(asset);
        updateEditorial(asset.slug, editorial);
        updated++;
        results.push({ asset: asset.name, status: "✓" });
        console.log(`✓ Generated editorial for ${asset.name}`);
      } catch (error) {
        console.error(`✗ Failed for ${asset.name}:`, error);
        results.push({ asset: asset.name, status: "✗" });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Editorial content auto-generated for ${updated}/${ASSETS.length} assets`,
      updated,
      total: ASSETS.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Fatal error in auto-generation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to auto-generate editorial",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allow GET for manual testing via curl
  return POST(request);
}
