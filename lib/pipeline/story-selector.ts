import type { ProcessedNewsArticle } from "@/lib/models/news-article";
import type { MarketEvent } from "@/lib/models/market-event";

interface ScoredStory {
  article: ProcessedNewsArticle;
  score: number;
  reason: string;
}

interface StorySelectionResult {
  selectedStories: ScoredStory[];
  lookbackHours: number;
  totalArticlesProcessed: number;
  timestamp: number;
}

/**
 * Enhanced importance scoring algorithm for story selection
 * Considers: news quality, market impact, asset relevance, recency
 */
function scoreStory(article: ProcessedNewsArticle, currentTime: number): number {
  let score = 0;

  // 1. Quality score (0-25 points)
  score += Math.min(article.qualityScore || 50, 100) * 0.25;

  // 2. Recency boost (0-15 points)
  const ageHours = (currentTime - article.publishedAt) / (1000 * 60 * 60);
  if (ageHours < 1) score += 15; // Published in last hour
  else if (ageHours < 4) score += 12; // Published in last 4 hours
  else if (ageHours < 12) score += 8; // Published in last 12 hours
  else if (ageHours < 24) score += 4; // Published in last 24 hours

  // 3. Asset impact (0-20 points)
  if (article.impactedAssets && article.impactedAssets.length > 0) {
    const maxImpact = Math.max(...article.impactedAssets.map(a => a.confidence));
    score += maxImpact * 0.2; // High-confidence impacts get boosted
  }

  // 4. Multi-source clustering boost (0-20 points)
  if (article.clusterSize && article.clusterSize > 1) {
    score += Math.min(article.clusterSize * 5, 20); // More sources = more important
  }

  // 5. Cluster lead bonus (0-10 points)
  if (article.isClusterLead) {
    score += 10;
  }

  // 6. Deduplication penalty (0-10 point reduction)
  if (article.status === "event_created" && article.eventId) {
    score += 5; // Already triggered an event, slightly boost it
  }

  return Math.min(score, 100);
}

/**
 * Ensures asset diversity in top stories
 */
function diversifyAssets(
  stories: ScoredStory[],
  topCount: number
): ScoredStory[] {
  const result: ScoredStory[] = [];
  const assetCounts: Record<string, number> = {};

  for (const story of stories) {
    const assets = story.article.mentionedAssets || [];

    // Allow up to 2 stories per asset for diversity
    const primaryAsset = assets[0] || "unknown";
    const count = assetCounts[primaryAsset] || 0;

    if (count < 2 || result.length < topCount * 0.5) {
      result.push(story);
      assetCounts[primaryAsset] = count + 1;

      if (result.length >= topCount) break;
    }
  }

  // Fill remaining slots if diversity filter was too strict
  if (result.length < topCount) {
    for (const story of stories) {
      if (!result.includes(story)) {
        result.push(story);
        if (result.length >= topCount) break;
      }
    }
  }

  return result.slice(0, topCount);
}

/**
 * Select top stories for daily content generation
 * @param articles Processed news articles from newsapi
 * @param options Configuration
 * @returns Top N stories ranked by importance
 */
export function selectTopStories(
  articles: ProcessedNewsArticle[],
  options: {
    lookbackHours?: number;
    topCount?: number;
    minimumScore?: number;
    ensureDiversity?: boolean;
  } = {}
): StorySelectionResult {
  const lookbackHours = options.lookbackHours || 16;
  const topCount = options.topCount || 5;
  const minimumScore = options.minimumScore || 40;
  const ensureDiversity = options.ensureDiversity !== false;

  const now = Date.now();
  const cutoffTime = now - lookbackHours * 60 * 60 * 1000;

  // Filter articles by lookback window and minimum quality
  const validArticles = articles.filter((article) => {
    const isRecent = article.publishedAt >= cutoffTime;
    const meetsQuality = (article.qualityScore || 50) >= minimumScore;
    return isRecent && meetsQuality;
  });

  // Score each article
  const scored: ScoredStory[] = validArticles
    .map((article) => ({
      article,
      score: scoreStory(article, now),
      reason: `Quality: ${article.qualityScore}, Sources: ${article.clusterSize || 1}, Assets: ${article.mentionedAssets?.length || 0}`,
    }))
    .filter((s) => s.score >= minimumScore)
    .sort((a, b) => b.score - a.score);

  // Select top stories with optional diversity
  const selected = ensureDiversity
    ? diversifyAssets(scored, topCount)
    : scored.slice(0, topCount);

  return {
    selectedStories: selected,
    lookbackHours,
    totalArticlesProcessed: validArticles.length,
    timestamp: now,
  };
}

/**
 * Deduplicate stories to prevent publishing same story twice in short period
 */
export function deduplicateStories(
  stories: ScoredStory[],
  previousPublishedHoursAgo: number = 24
): ScoredStory[] {
  // In production, would check against database of previously published stories
  // For now, filter by clusterHash to avoid same story from multiple sources

  const seen = new Set<string>();
  const deduplicated: ScoredStory[] = [];

  for (const story of stories) {
    const key = story.article.clusterHash || story.article.articleHash;
    if (!seen.has(key)) {
      deduplicated.push(story);
      seen.add(key);
    }
  }

  return deduplicated;
}

/**
 * Generate story briefing for content generation
 */
export function generateStoryBriefing(stories: ScoredStory[]): string {
  const briefing = stories
    .map((story, idx) => {
      const score = Math.round(story.score);
      const assets = story.article.mentionedAssets?.join(", ") || "general";
      return `${idx + 1}. ${story.article.title}\n   Importance: ${score}/100 | Assets: ${assets}\n   ${story.article.description?.substring(0, 100)}...`;
    })
    .join("\n\n");

  return `Top ${stories.length} stories for content generation:\n\n${briefing}`;
}
