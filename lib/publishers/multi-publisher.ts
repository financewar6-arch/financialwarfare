import { YouTubePublisher } from "./youtube-publisher";
import { TikTokPublisher } from "./tiktok-publisher";
import { InstagramPublisher } from "./instagram-publisher";
import { LinkedInPublisher } from "./linkedin-publisher";
import { TwitterPublisher } from "./twitter-publisher";
import { SnapchatPublisher } from "./snapchat-publisher";
import type { PublishRequest, PublishResponse } from "./base-publisher";

export interface MultiPlatformPublishRequest {
  videoPath: string;
  videoUrl?: string;
  title: string;
  description: string;
  hashtags: string[];
  thumbnail?: string;
  platforms: ("youtube" | "tiktok" | "instagram" | "linkedin" | "twitter" | "snapchat")[];
  metadata?: Record<string, any>;
}

export interface MultiPlatformPublishResult {
  success: boolean;
  timestamp: number;
  results: {
    [platform: string]: PublishResponse;
  };
  summary: {
    totalPlatforms: number;
    successful: number;
    failed: number;
  };
}

/**
 * Orchestrate publishing to multiple platforms
 */
export class MultiPlatformPublisher {
  private publishers = {
    youtube: new YouTubePublisher(),
    tiktok: new TikTokPublisher(),
    instagram: new InstagramPublisher(),
    linkedin: new LinkedInPublisher(),
    twitter: new TwitterPublisher(),
    snapchat: new SnapchatPublisher(),
  };

  /**
   * Publish to multiple platforms in parallel
   */
  async publishToMultiplePlatforms(
    request: MultiPlatformPublishRequest
  ): Promise<MultiPlatformPublishResult> {
    const startTime = Date.now();
    const results: { [platform: string]: PublishResponse } = {};

    // Create publish requests for each platform
    const publishPromises = request.platforms.map(async (platform) => {
      const publisher = this.publishers[platform];
      if (!publisher) {
        return {
          platform,
          response: {
            platform,
            success: false,
            error: `Unknown platform: ${platform}`,
          },
        };
      }

      try {
        const response = await publisher.publish({
          videoPath: request.videoPath,
          videoUrl: request.videoUrl,
          title: request.title,
          description: request.description,
          hashtags: request.hashtags,
          thumbnail: request.thumbnail,
          platform: platform as any,
          metadata: request.metadata,
        });

        return { platform, response };
      } catch (error) {
        return {
          platform,
          response: {
            platform,
            success: false,
            error: `Exception: ${String(error)}`,
          },
        };
      }
    });

    // Wait for all publishes
    const publishResults = await Promise.all(publishPromises);

    // Aggregate results
    publishResults.forEach(({ platform, response }) => {
      results[platform] = response;
    });

    // Calculate summary
    const successful = Object.values(results).filter((r) => r.success).length;
    const failed = Object.values(results).filter((r) => !r.success).length;

    return {
      success: failed === 0,
      timestamp: startTime,
      results,
      summary: {
        totalPlatforms: request.platforms.length,
        successful,
        failed,
      },
    };
  }

  /**
   * Publish to all platforms
   */
  async publishToAllPlatforms(
    request: MultiPlatformPublishRequest
  ): Promise<MultiPlatformPublishResult> {
    return this.publishToMultiplePlatforms({
      ...request,
      platforms: ["youtube", "tiktok", "instagram", "linkedin", "twitter", "snapchat"],
    });
  }

  /**
   * Get list of configured platforms
   */
  getConfiguredPlatforms(): string[] {
    return Object.entries(this.publishers)
      .filter(([_, publisher]) => publisher.apiKey)
      .map(([platform, _]) => platform);
  }

  /**
   * Get list of all available platforms
   */
  getAllPlatforms(): string[] {
    return Object.keys(this.publishers);
  }
}
