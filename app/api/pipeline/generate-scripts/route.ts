import { NextRequest, NextResponse } from "next/server";
import { generateAllPlatformScripts, formatScriptForReview } from "@/lib/pipeline/platform-script-generator";
import type { ProcessedNewsArticle } from "@/lib/models/news-article";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stories } = body;

    if (!Array.isArray(stories) || stories.length === 0) {
      return NextResponse.json(
        { error: "Stories array required and must not be empty" },
        { status: 400 }
      );
    }

    // Generate scripts for each story
    const generatedScripts = stories.map((story: ProcessedNewsArticle) => {
      // Determine asset info from mentioned assets
      const primaryAsset = story.mentionedAssets?.[0] || "MARKET";
      const assetMap: Record<string, { name: string; symbol: string; type: string }> = {
        BTC: { name: "Bitcoin", symbol: "BTC", type: "Cryptocurrency" },
        ETH: { name: "Ethereum", symbol: "ETH", type: "Cryptocurrency" },
        AAPL: { name: "Apple", symbol: "AAPL", type: "Stock" },
        MSFT: { name: "Microsoft", symbol: "MSFT", type: "Stock" },
        NVDA: { name: "NVIDIA", symbol: "NVDA", type: "Stock" },
        TSLA: { name: "Tesla", symbol: "TSLA", type: "Stock" },
        SPY: { name: "S&P 500 ETF", symbol: "SPY", type: "Index" },
        QQQ: { name: "Nasdaq ETF", symbol: "QQQ", type: "Index" },
        GOLD: { name: "Gold", symbol: "GOLD", type: "Commodity" },
        MARKET: { name: "Market", symbol: "MARKET", type: "Indices" },
      };

      const asset = assetMap[primaryAsset] || assetMap.MARKET;
      const impact = story.impactedAssets?.[0]?.direction === "up" ? "positive market developments" : "market headwinds";
      const priceChange = story.impactedAssets?.[0]?.direction === "up" ? 2.5 : -1.8;

      try {
        const scripts = generateAllPlatformScripts({
          asset,
          story,
          priceChange,
          direction: story.impactedAssets?.[0]?.direction || "up",
          impact,
        });

        return {
          storyId: story.id,
          storyTitle: story.title,
          asset: asset.name,
          scripts: scripts.map((s) => ({
            platform: s.platform,
            title: s.title,
            script: s.script,
            duration: s.duration,
            hashtags: s.hashtags,
            hook: s.hook,
            cta: s.cta,
          })),
          status: "ready_for_review",
        };
      } catch (error) {
        console.error(`Error generating scripts for story ${story.id}:`, error);
        return {
          storyId: story.id,
          storyTitle: story.title,
          error: "Failed to generate scripts",
          status: "error",
        };
      }
    });

    // Count successful generations
    const successful = generatedScripts.filter((g) => !g.error);
    const failed = generatedScripts.filter((g) => g.error);

    return NextResponse.json({
      success: true,
      totalStories: stories.length,
      successful: successful.length,
      failed: failed.length,
      scripts: generatedScripts,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error in /api/pipeline/generate-scripts:", error);
    return NextResponse.json(
      { error: "Failed to generate scripts", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // GET endpoint to test script generation with default stories
  try {
    const mockStory: ProcessedNewsArticle = {
      id: "test-1",
      articleHash: "test-hash",
      sourceId: "test",
      title: "Bitcoin Surges Past $65,000 as ETF Inflows Accelerate",
      description: "Institutional investors continue to pile into Bitcoin ETFs, driving the cryptocurrency above $65,000 for the first time in weeks.",
      url: "https://example.com",
      imageUrl: null,
      publishedAt: Date.now(),
      facts: [],
      qualityScore: 85,
      mentionedAssets: ["BTC"],
      impactedAssets: [{ slug: "bitcoin", direction: "up", confidence: 0.9 }],
      status: "ingested",
      processedAt: Date.now(),
    };

    const scripts = generateAllPlatformScripts({
      asset: { name: "Bitcoin", symbol: "BTC", type: "Cryptocurrency" },
      story: mockStory,
      priceChange: 3.2,
      direction: "up",
      impact: "institutional ETF inflows",
    });

    return NextResponse.json({
      success: true,
      testStory: mockStory.title,
      scripts: scripts.map((s) => ({
        platform: s.platform,
        title: s.title,
        script: s.script,
        duration: s.duration,
        hashtags: s.hashtags,
        hook: s.hook,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
