import { NextRequest, NextResponse } from "next/server";
import { analyzePerformance, scorePerformance, calculateAggregateMetrics } from "@/lib/analytics/performance-tracker";
import type { ContentPerformance, PerformanceMetrics } from "@/lib/analytics/performance-tracker";

// Mock content performance database
const MOCK_PERFORMANCE: ContentPerformance[] = [
  {
    videoId: "v1-bitcoin-surge",
    platforms: {
      youtube: {
        videoId: "yt-123",
        platform: "youtube",
        title: "Bitcoin Surges Past $65,000",
        asset: "BTC",
        publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        views: 15400,
        likes: 842,
        comments: 156,
        shares: 342,
        engagement: 0.081,
      },
      tiktok: {
        videoId: "tt-456",
        platform: "tiktok",
        title: "Bitcoin Surges Past $65,000",
        asset: "BTC",
        publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        views: 284000,
        likes: 28400,
        comments: 3200,
        shares: 8900,
        engagement: 0.113,
      },
      instagram: {
        videoId: "ig-789",
        platform: "instagram",
        title: "Bitcoin Surges Past $65,000",
        asset: "BTC",
        publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        views: 42000,
        likes: 3780,
        comments: 445,
        shares: 892,
        engagement: 0.105,
      },
    },
    publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastUpdated: Date.now(),
    overallEngagement: 0.1,
    topPerformer: "tiktok",
  },
  {
    videoId: "v2-tech-earnings",
    platforms: {
      youtube: {
        videoId: "yt-111",
        platform: "youtube",
        title: "Tech Giants Report Strong Q3",
        asset: "AAPL",
        publishedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        views: 18200,
        likes: 1024,
        comments: 189,
        shares: 456,
        engagement: 0.089,
      },
      tiktok: {
        videoId: "tt-222",
        platform: "tiktok",
        title: "Tech Giants Report Strong Q3",
        asset: "AAPL",
        publishedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        views: 192000,
        likes: 15360,
        comments: 2100,
        shares: 5760,
        engagement: 0.12,
      },
      linkedin: {
        videoId: "li-333",
        platform: "linkedin",
        title: "Tech Giants Report Strong Q3",
        asset: "AAPL",
        publishedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        views: 8400,
        likes: 756,
        comments: 94,
        shares: 210,
        engagement: 0.114,
      },
    },
    publishedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    lastUpdated: Date.now(),
    overallEngagement: 0.108,
    topPerformer: "tiktok",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action") || "summary";
    const videoId = searchParams.get("videoId");
    const asset = searchParams.get("asset");

    if (action === "summary") {
      // Return summary of all content performance
      const analysis = analyzePerformance(MOCK_PERFORMANCE);
      const avgEngagement =
        MOCK_PERFORMANCE.reduce(
          (sum, c) => sum + calculateAggregateMetrics(c).engagement,
          0
        ) / MOCK_PERFORMANCE.length;

      return NextResponse.json({
        success: true,
        summary: {
          totalVideos: MOCK_PERFORMANCE.length,
          averageEngagement: (avgEngagement * 100).toFixed(2) + "%",
          totalViews: MOCK_PERFORMANCE.reduce(
            (sum, c) => sum + calculateAggregateMetrics(c).views,
            0
          ),
          totalEngagements: MOCK_PERFORMANCE.reduce(
            (sum, c) =>
              sum + (calculateAggregateMetrics(c).likes + calculateAggregateMetrics(c).comments + calculateAggregateMetrics(c).shares),
            0
          ),
        },
        analysis,
        topVideos: MOCK_PERFORMANCE.slice(0, 5).map((c) => {
          const agg = calculateAggregateMetrics(c);
          return {
            videoId: c.videoId,
            title: agg.title,
            asset: agg.asset,
            views: agg.views,
            engagement: (agg.engagement * 100).toFixed(2) + "%",
            score: scorePerformance(agg),
          };
        }),
      });
    }

    if (action === "video" && videoId) {
      // Return detailed metrics for specific video
      const content = MOCK_PERFORMANCE.find((c) => c.videoId === videoId);
      if (!content) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }

      const aggregate = calculateAggregateMetrics(content);
      const platformBreakdown = Object.entries(content.platforms).map(
        ([platform, metrics]) => ({
          platform,
          views: metrics.views,
          likes: metrics.likes,
          comments: metrics.comments,
          shares: metrics.shares,
          engagement: (metrics.engagement * 100).toFixed(2) + "%",
          score: scorePerformance(metrics),
        })
      );

      return NextResponse.json({
        success: true,
        video: {
          videoId: content.videoId,
          title: aggregate.title,
          asset: aggregate.asset,
          publishedAt: content.publishedAt,
          aggregateMetrics: {
            views: aggregate.views,
            likes: aggregate.likes,
            comments: aggregate.comments,
            shares: aggregate.shares,
            engagement: (aggregate.engagement * 100).toFixed(2) + "%",
            overallScore: scorePerformance(aggregate),
          },
          platformBreakdown,
        },
      });
    }

    if (action === "asset" && asset) {
      // Return metrics for all videos with specific asset
      const assetVideos = MOCK_PERFORMANCE.filter((c) => {
        const agg = calculateAggregateMetrics(c);
        return agg.asset === asset;
      });

      const avgEngagement =
        assetVideos.reduce((sum, c) => sum + calculateAggregateMetrics(c).engagement, 0) /
        (assetVideos.length || 1);

      return NextResponse.json({
        success: true,
        asset,
        videoCount: assetVideos.length,
        averageEngagement: (avgEngagement * 100).toFixed(2) + "%",
        videos: assetVideos.map((c) => {
          const agg = calculateAggregateMetrics(c);
          return {
            videoId: c.videoId,
            title: agg.title,
            views: agg.views,
            engagement: (agg.engagement * 100).toFixed(2) + "%",
          };
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Use ?action=summary|video|asset with optional ?videoId=X or ?asset=Y",
    });
  } catch (error) {
    console.error("Error in /api/pipeline/analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, platform, metrics } = body;

    if (!videoId || !platform) {
      return NextResponse.json(
        { error: "videoId and platform required" },
        { status: 400 }
      );
    }

    // In production: Update database with new metrics from platform APIs
    // For demo: Simulate update

    console.log(`Updated metrics for ${videoId} on ${platform}:`, metrics);

    return NextResponse.json({
      success: true,
      message: "Metrics updated",
      videoId,
      platform,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update metrics", details: String(error) },
      { status: 500 }
    );
  }
}
