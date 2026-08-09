/**
 * Pipeline Coordinator
 * Orchestrates the entire news→script→video→social pipeline
 *
 * Workflow:
 * 1. Fetch top stories (16-hour lookback)
 * 2. Generate platform-specific scripts
 * 3. Create content package
 * 4. User reviews and approves
 * 5. User creates videos
 * 6. Publish to all platforms
 * 7. Collect analytics
 */

import { selectTopStories, deduplicateStories, generateStoryBriefing } from "@/lib/pipeline/story-selector";
import { generateAllPlatformScripts } from "@/lib/pipeline/platform-script-generator";
import { createContentPackage, approvePackage, publishPackage } from "@/lib/models/content-package";
import { MultiPlatformPublisher } from "@/lib/publishers/multi-publisher";
import type { ProcessedNewsArticle } from "@/lib/models/news-article";
import type { ContentPackage } from "@/lib/models/content-package";

export interface PipelineConfig {
  lookbackHours?: number;
  topStoriesCount?: number;
  minimumScoreThreshold?: number;
  platforms?: string[];
}

export interface PipelineResult {
  status: "success" | "partial" | "error";
  phase: "story_selection" | "script_generation" | "package_creation" | "approval" | "publishing" | "analytics";
  packageId?: string;
  storiesSelected?: number;
  scriptsGenerated?: number;
  platformsPublished?: string[];
  error?: string;
  timestamp: number;
}

/**
 * Execute complete pipeline from stories to publishing
 */
export async function executePipeline(
  articles: ProcessedNewsArticle[],
  config: PipelineConfig = {}
): Promise<PipelineResult> {
  const startTime = Date.now();
  const {
    lookbackHours = 16,
    topStoriesCount = 5,
    minimumScoreThreshold = 40,
    platforms = ["youtube", "tiktok", "instagram", "linkedin", "twitter"],
  } = config;

  try {
    // Phase 1: Story Selection
    console.log("📰 Phase 1: Selecting top stories...");
    const storyResult = selectTopStories(articles, {
      lookbackHours,
      topCount: topStoriesCount,
      minimumScore: minimumScoreThreshold,
      ensureDiversity: true,
    });

    if (storyResult.selectedStories.length === 0) {
      return {
        status: "error",
        phase: "story_selection",
        error: "No stories met the quality threshold",
        timestamp: startTime,
      };
    }

    const selectedStories = deduplicateStories(storyResult.selectedStories);
    console.log(`✓ Selected ${selectedStories.length} stories`);

    // Phase 2: Script Generation
    console.log("📝 Phase 2: Generating platform scripts...");
    const scriptsList = selectedStories.flatMap((story) => {
      const assetMap: Record<string, { name: string; symbol: string; type: string }> = {
        BTC: { name: "Bitcoin", symbol: "BTC", type: "Cryptocurrency" },
        ETH: { name: "Ethereum", symbol: "ETH", type: "Cryptocurrency" },
        AAPL: { name: "Apple", symbol: "AAPL", type: "Stock" },
        MSFT: { name: "Microsoft", symbol: "MSFT", type: "Stock" },
        NVDA: { name: "NVIDIA", symbol: "NVDA", type: "Stock" },
        SPY: { name: "S&P 500", symbol: "SPY", type: "Index" },
        GOLD: { name: "Gold", symbol: "GOLD", type: "Commodity" },
      };

      const primaryAsset = story.article.mentionedAssets?.[0] || "SPY";
      const asset = assetMap[primaryAsset] || assetMap.SPY;

      try {
        return generateAllPlatformScripts({
          asset,
          story: story.article,
          impact: "market developments",
        });
      } catch (error) {
        console.error(`Error generating scripts for story ${story.article.id}:`, error);
        return [];
      }
    });

    console.log(`✓ Generated ${scriptsList.length} scripts`);

    // Phase 3: Package Creation
    console.log("📦 Phase 3: Creating content package...");
    const pkg = createContentPackage(
      selectedStories.map((s) => s.article),
      scriptsList,
      lookbackHours
    );
    console.log(`✓ Created package ${pkg.id}`);

    return {
      status: "success",
      phase: "package_creation",
      packageId: pkg.id,
      storiesSelected: selectedStories.length,
      scriptsGenerated: scriptsList.length,
      platformsPublished: [],
      timestamp: startTime,
    };
  } catch (error) {
    console.error("Pipeline error:", error);
    return {
      status: "error",
      phase: "script_generation",
      error: String(error),
      timestamp: startTime,
    };
  }
}

/**
 * Publish prepared content to all platforms
 */
export async function publishToAllPlatforms(
  videoUrl: string,
  title: string,
  description: string,
  hashtags: string[],
  selectedPlatforms?: string[]
): Promise<PipelineResult> {
  const startTime = Date.now();

  try {
    const publisher = new MultiPlatformPublisher();
    const platforms = selectedPlatforms || ["youtube", "tiktok", "instagram", "linkedin", "twitter"];

    console.log(`🚀 Publishing to ${platforms.length} platforms...`);

    const result = await publisher.publishToMultiplePlatforms({
      videoUrl,
      title,
      description,
      hashtags,
      platforms: platforms as any,
    });

    const successful = Object.values(result.results).filter((r) => r.success).length;

    return {
      status: result.success ? "success" : "partial",
      phase: "publishing",
      platformsPublished: Object.keys(result.results).filter((p) => result.results[p].success),
      error: result.summary.failed > 0 ? `Failed on ${result.summary.failed} platforms` : undefined,
      timestamp: startTime,
    };
  } catch (error) {
    return {
      status: "error",
      phase: "publishing",
      error: String(error),
      timestamp: startTime,
    };
  }
}

/**
 * Get pipeline status summary
 */
export function getPipelineSummary(): {
  steps: string[];
  estimatedTime: string;
  nextDeadline: string;
} {
  return {
    steps: [
      "1. Stories selected (automated 6 AM ET)",
      "2. Scripts generated (automated 6 AM ET)",
      "3. Review scripts (you: 10-15 min)",
      "4. Make videos in CapCut (you: 45-90 min)",
      "5. Publish to all platforms (you: 1 click)",
    ],
    estimatedTime: "1-1.5 hours total manual work per day",
    nextDeadline: "Tomorrow 6 AM ET (or run manually anytime)",
  };
}
