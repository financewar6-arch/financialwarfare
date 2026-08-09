import { NextRequest, NextResponse } from "next/server";
import { selectTopStories, deduplicateStories } from "@/lib/pipeline/story-selector";
import type { ProcessedNewsArticle } from "@/lib/models/news-article";

// Mock news articles - in production, these come from /api/news
const MOCK_ARTICLES: ProcessedNewsArticle[] = [
  {
    id: "news-1",
    articleHash: "hash1",
    sourceId: "reuters",
    title: "Bitcoin Surges Past $65,000 as ETF Inflows Accelerate",
    description: "Institutional investors continue to pile into Bitcoin ETFs, driving the cryptocurrency above $65,000 for the first time in weeks.",
    url: "https://example.com/bitcoin-etf",
    imageUrl: null,
    publishedAt: Date.now() - 2 * 60 * 60 * 1000,
    facts: [],
    qualityScore: 85,
    mentionedAssets: ["BTC", "ETH"],
    impactedAssets: [{ slug: "bitcoin", direction: "up", confidence: 0.9 }],
    status: "ingested",
    processedAt: Date.now(),
  },
  {
    id: "news-2",
    articleHash: "hash2",
    sourceId: "cnbc",
    title: "Fed Signals More Aggressive Rate Cuts Ahead",
    description: "Federal Reserve officials indicate potential rate cuts in upcoming meetings, sparking market rally across equities and commodities.",
    url: "https://example.com/fed-rates",
    imageUrl: null,
    publishedAt: Date.now() - 4 * 60 * 60 * 1000,
    facts: [],
    qualityScore: 80,
    mentionedAssets: ["SPY", "GOLD"],
    impactedAssets: [
      { slug: "sp500", direction: "up", confidence: 0.85 },
      { slug: "gold", direction: "up", confidence: 0.75 },
    ],
    status: "ingested",
    processedAt: Date.now(),
  },
  {
    id: "news-3",
    articleHash: "hash3",
    sourceId: "bloomberg",
    title: "Tech Giants Report Strong Q3 Earnings",
    description: "Apple, Microsoft, and NVIDIA beat earnings expectations, signaling resilient consumer demand and AI spending.",
    url: "https://example.com/tech-earnings",
    imageUrl: null,
    publishedAt: Date.now() - 6 * 60 * 60 * 1000,
    facts: [],
    qualityScore: 88,
    mentionedAssets: ["AAPL", "MSFT", "NVDA"],
    impactedAssets: [
      { slug: "apple", direction: "up", confidence: 0.9 },
      { slug: "nvidia", direction: "up", confidence: 0.92 },
    ],
    status: "ingested",
    processedAt: Date.now(),
  },
  {
    id: "news-4",
    articleHash: "hash4",
    sourceId: "coindesk",
    title: "Ethereum Upgrade Improves Network Efficiency by 40%",
    description: "Latest Ethereum protocol update reduces transaction costs and improves throughput, boosting developer adoption.",
    url: "https://example.com/eth-upgrade",
    imageUrl: null,
    publishedAt: Date.now() - 8 * 60 * 60 * 1000,
    facts: [],
    qualityScore: 75,
    mentionedAssets: ["ETH"],
    impactedAssets: [{ slug: "ethereum", direction: "up", confidence: 0.8 }],
    status: "ingested",
    processedAt: Date.now(),
  },
  {
    id: "news-5",
    articleHash: "hash5",
    sourceId: "marketwatch",
    title: "Oil Prices Jump on OPEC Production Cuts",
    description: "OPEC announces extended production cuts, driving crude oil prices higher and impacting energy sector stocks.",
    url: "https://example.com/opec-oil",
    imageUrl: null,
    publishedAt: Date.now() - 10 * 60 * 60 * 1000,
    facts: [],
    qualityScore: 72,
    mentionedAssets: ["CL", "XLE"],
    impactedAssets: [{ slug: "crude-oil", direction: "up", confidence: 0.88 }],
    status: "ingested",
    processedAt: Date.now(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topCount = parseInt(searchParams.get("topCount") || "5");
    const lookbackHours = parseInt(searchParams.get("lookbackHours") || "16");
    const minimumScore = parseInt(searchParams.get("minimumScore") || "30");

    // In production: fetch from /api/news
    const articles = MOCK_ARTICLES;

    // Select top stories
    const result = selectTopStories(articles, {
      topCount,
      lookbackHours,
      minimumScore,
      ensureDiversity: true,
    });

    // Deduplicate
    const deduplicated = deduplicateStories(result.selectedStories);

    return NextResponse.json({
      success: true,
      stories: deduplicated.map((s) => ({
        id: s.article.id,
        title: s.article.title,
        description: s.article.description,
        url: s.article.url,
        imageUrl: s.article.imageUrl,
        publishedAt: s.article.publishedAt,
        mentionedAssets: s.article.mentionedAssets,
        impactedAssets: s.article.impactedAssets,
        score: Math.round(s.score),
        reason: s.reason,
      })),
      summary: {
        totalSelected: deduplicated.length,
        lookbackHours,
        totalProcessed: result.totalArticlesProcessed,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error in /api/pipeline/stories:", error);
    return NextResponse.json(
      { error: "Failed to get stories", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stories, options } = body;

    if (!Array.isArray(stories)) {
      return NextResponse.json(
        { error: "Stories must be an array" },
        { status: 400 }
      );
    }

    const result = selectTopStories(stories, options);
    const deduplicated = deduplicateStories(result.selectedStories);

    return NextResponse.json({
      success: true,
      selected: deduplicated,
      summary: result,
    });
  } catch (error) {
    console.error("Error in POST /api/pipeline/stories:", error);
    return NextResponse.json(
      { error: "Failed to select stories", details: String(error) },
      { status: 500 }
    );
  }
}
