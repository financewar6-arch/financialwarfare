import type { ProcessedNewsArticle } from "@/lib/models/news-article";

export interface StorySelectionOptions {
  topCount: number;
  lookbackHours: number;
  minimumScore: number;
  ensureDiversity?: boolean;
}

export interface SelectedStory {
  article: ProcessedNewsArticle;
  score: number;
  reason: string;
}

export interface SelectionResult {
  selectedStories: SelectedStory[];
  totalArticlesProcessed: number;
  averageScore: number;
  diversityScore: number;
}

export function selectTopStories(
  articles: ProcessedNewsArticle[],
  options: StorySelectionOptions
): SelectionResult {
  const now = Date.now();
  const lookbackMs = options.lookbackHours * 60 * 60 * 1000;

  let candidates = articles
    .filter((a) => {
      const age = now - a.publishedAt;
      return age <= lookbackMs && a.qualityScore >= options.minimumScore;
    })
    .map((article) => {
      const ageHours = (now - article.publishedAt) / (60 * 60 * 1000);
      const recencyScore = Math.max(0, 100 - ageHours * 5);
      const impactScore = article.impactedAssets?.length ? 20 : 0;
      const qualityBonus = article.qualityScore - 50;
      const compositeScore = recencyScore * 0.5 + impactScore + qualityBonus * 0.3;

      return {
        article,
        score: compositeScore,
        reason: `Quality: ${article.qualityScore}, Recency: ${Math.round(recencyScore)}, Assets: ${
          article.mentionedAssets?.length || 0
        }`,
      };
    });

  candidates = candidates.sort((a, b) => b.score - a.score);

  if (options.ensureDiversity) {
    candidates = ensureDiversity(candidates, options.topCount);
  }

  const selected = candidates.slice(0, options.topCount);
  const avgScore = selected.length > 0 ? selected.reduce((sum, s) => sum + s.score, 0) / selected.length : 0;

  return {
    selectedStories: selected,
    totalArticlesProcessed: articles.length,
    averageScore: avgScore,
    diversityScore: calculateDiversityScore(selected),
  };
}

function ensureDiversity(stories: SelectedStory[], topCount: number): SelectedStory[] {
  const selected: SelectedStory[] = [];
  const seenAssets = new Set<string>();

  for (const story of stories) {
    if (selected.length >= topCount) break;
    const assets = story.article.mentionedAssets || [];
    const hasNewAsset = assets.some((a) => !seenAssets.has(a));

    if (hasNewAsset || selected.length < topCount / 2) {
      selected.push(story);
      assets.forEach((a) => seenAssets.add(a));
    }
  }

  for (const story of stories) {
    if (selected.length >= topCount) break;
    if (!selected.includes(story)) {
      selected.push(story);
    }
  }

  return selected;
}

function calculateDiversityScore(stories: SelectedStory[]): number {
  if (stories.length === 0) return 0;
  const assetCounts = new Map<string, number>();
  stories.forEach((s) => {
    s.article.mentionedAssets?.forEach((asset) => {
      assetCounts.set(asset, (assetCounts.get(asset) || 0) + 1);
    });
  });

  const uniqueAssets = assetCounts.size;
  const maxScore = stories.length;
  return (uniqueAssets / maxScore) * 100;
}

export function deduplicateStories(stories: SelectedStory[]): SelectedStory[] {
  if (stories.length <= 1) return stories;

  const clusters: SelectedStory[][] = [];

  for (const story of stories) {
    let addedToCluster = false;
    for (const cluster of clusters) {
      if (isSimilar(story.article, cluster[0].article)) {
        cluster.push(story);
        addedToCluster = true;
        break;
      }
    }
    if (!addedToCluster) {
      clusters.push([story]);
    }
  }

  return clusters.map((cluster) => cluster.sort((a, b) => b.score - a.score)[0]);
}

function isSimilar(a: ProcessedNewsArticle, b: ProcessedNewsArticle): boolean {
  const assetsA = new Set(a.mentionedAssets || []);
  const assetsB = new Set(b.mentionedAssets || []);
  const intersection = [...assetsA].filter((x) => assetsB.has(x));

  if (intersection.length === 0) return false;
  const timeDiff = Math.abs(a.publishedAt - b.publishedAt);
  return timeDiff < 2 * 60 * 60 * 1000;
}
