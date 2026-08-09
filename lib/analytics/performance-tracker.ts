export interface PerformanceMetrics {
  videoId: string;
  platform: string;
  title: string;
  asset: string;
  publishedAt: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number; // (likes + comments + shares) / views
  completionRate?: number; // % watched to end
  avgWatchTime?: number; // seconds
  clickThroughRate?: number; // % who clicked link
}

export interface ContentPerformance {
  videoId: string;
  platforms: {
    [platform: string]: PerformanceMetrics;
  };
  overallEngagement: number;
  topPerformer: string; // platform with highest engagement
  publishedAt: number;
  lastUpdated: number;
}

export interface PerformanceAnalysis {
  topPerformingAssets: Array<{ asset: string; avgEngagement: number; count: number }>;
  topPerformingPlatforms: Array<{ platform: string; avgEngagement: number; count: number }>;
  engagementTrends: Array<{ date: string; avgEngagement: number }>;
  recommendedAssets: string[]; // Assets to prioritize
  recommendedPlatforms: string[]; // Platforms to prioritize
}

/**
 * Aggregate performance metrics across platforms
 */
export function calculateAggregateMetrics(content: ContentPerformance): PerformanceMetrics {
  const metrics = Object.values(content.platforms);

  const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
  const totalLikes = metrics.reduce((sum, m) => sum + m.likes, 0);
  const totalComments = metrics.reduce((sum, m) => sum + m.comments, 0);
  const totalShares = metrics.reduce((sum, m) => sum + m.shares, 0);

  const engagement = totalViews > 0 ? (totalLikes + totalComments + totalShares) / totalViews : 0;

  return {
    videoId: content.videoId,
    platform: "all_platforms",
    title: metrics[0]?.title || "",
    asset: metrics[0]?.asset || "",
    publishedAt: content.publishedAt,
    views: totalViews,
    likes: totalLikes,
    comments: totalComments,
    shares: totalShares,
    engagement,
  };
}

/**
 * Find best performing platform for a content piece
 */
export function getTopPerformer(content: ContentPerformance): string {
  const platforms = Object.entries(content.platforms);
  if (platforms.length === 0) return "";

  return platforms.reduce((best, [platform, metrics]) => {
    const bestMetrics = content.platforms[best];
    return metrics.engagement > bestMetrics.engagement ? platform : best;
  })[0];
}

/**
 * Analyze performance trends to recommend strategy
 */
export function analyzePerformance(
  contentList: ContentPerformance[]
): PerformanceAnalysis {
  // Asset performance
  const assetMap = new Map<
    string,
    { totalEngagement: number; count: number }
  >();
  const platformMap = new Map<
    string,
    { totalEngagement: number; count: number }
  >();

  for (const content of contentList) {
    const aggregate = calculateAggregateMetrics(content);
    const asset = aggregate.asset;
    const engagement = aggregate.engagement;

    // Track by asset
    if (!assetMap.has(asset)) {
      assetMap.set(asset, { totalEngagement: 0, count: 0 });
    }
    const assetData = assetMap.get(asset)!;
    assetData.totalEngagement += engagement;
    assetData.count += 1;

    // Track by platform
    for (const [platform, metrics] of Object.entries(content.platforms)) {
      if (!platformMap.has(platform)) {
        platformMap.set(platform, { totalEngagement: 0, count: 0 });
      }
      const platData = platformMap.get(platform)!;
      platData.totalEngagement += metrics.engagement;
      platData.count += 1;
    }
  }

  // Convert to arrays and sort
  const topAssets = Array.from(assetMap.entries())
    .map(([asset, data]) => ({
      asset,
      avgEngagement: data.totalEngagement / data.count,
      count: data.count,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 5);

  const topPlatforms = Array.from(platformMap.entries())
    .map(([platform, data]) => ({
      platform,
      avgEngagement: data.totalEngagement / data.count,
      count: data.count,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement);

  // Recommend top performers
  const recommendedAssets = topAssets.slice(0, 3).map((a) => a.asset);
  const recommendedPlatforms = topPlatforms.slice(0, 3).map((p) => p.platform);

  return {
    topPerformingAssets: topAssets,
    topPerformingPlatforms: topPlatforms,
    engagementTrends: [], // Would calculate from time series data
    recommendedAssets,
    recommendedPlatforms,
  };
}

/**
 * Calculate engagement rate for platform
 */
export function calculateEngagementRate(metrics: PerformanceMetrics): number {
  if (metrics.views === 0) return 0;
  return (metrics.likes + metrics.comments + metrics.shares) / metrics.views;
}

/**
 * Score content performance on 0-100 scale
 */
export function scorePerformance(metrics: PerformanceMetrics): number {
  const engagement = calculateEngagementRate(metrics);

  // Benchmarks (typical engagement rates)
  // YouTube Shorts: 2-5%
  // TikTok: 5-15%
  // Instagram Reels: 3-8%
  // LinkedIn: 1-3%
  // Twitter: 2-5%

  const benchmarks: Record<string, number> = {
    youtube: 0.035,
    tiktok: 0.1,
    instagram: 0.055,
    linkedin: 0.02,
    twitter: 0.035,
    snapchat: 0.05,
  };

  const benchmark = benchmarks[metrics.platform] || 0.04;
  const score = Math.min((engagement / benchmark) * 100, 100);

  return Math.round(score);
}
