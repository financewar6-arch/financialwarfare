// News Intelligence Pipeline Cron Job
// Fetches news articles, extracts facts, creates original intelligence, generates MarketEvents

import { NextRequest, NextResponse } from "next/server";
import { fetchFinanceNews, fetchCryptoNews } from "@/lib/providers/newsapi";
import { runNewsIntelligencePipeline } from "@/lib/generators/news-intelligence-pipeline";

// Mock market data - in production, fetch from real market data API
async function getMarketData() {
  return {
    bitcoin: {
      price: 45000,
      priceChange: 2.5,
      volume: 1200000,
    },
    ethereum: {
      price: 2800,
      priceChange: 1.8,
      volume: 950000,
    },
    gold: {
      price: 2050,
      priceChange: 0.5,
      volume: 800000,
    },
    nvda: {
      price: 950,
      priceChange: -1.2,
      volume: 5000000,
    },
    spy: {
      price: 580,
      priceChange: 0.3,
      volume: 75000000,
    },
  };
}

export async function GET(request: NextRequest) {
  // Security: verify cron secret
  const cronSecret = request.headers.get("Authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (cronSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch news from multiple sources
    const [financeNews, cryptoNews] = await Promise.all([
      fetchFinanceNews("market OR economy OR earnings", 10),
      fetchCryptoNews(5),
    ]);

    const allNews = [...financeNews, ...cryptoNews];

    if (allNews.length === 0) {
      return NextResponse.json({
        success: true,
        articlesProcessed: 0,
        eventsGenerated: 0,
        message: "No new articles to process",
      });
    }

    // Get market data for cross-checking
    const marketData = await getMarketData();

    // Run intelligence pipeline
    const events = await runNewsIntelligencePipeline(allNews, marketData);

    return NextResponse.json({
      success: true,
      articlesProcessed: allNews.length,
      eventsGenerated: events.length,
      events: events.map((e) => ({
        id: e.id,
        headline: e.headline,
        assetSlug: e.assetSlug,
        importanceScore: e.importanceScore,
      })),
    });
  } catch (error) {
    console.error("News intelligence pipeline error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
