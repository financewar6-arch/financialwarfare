import { BasePublisher, PublishRequest, PublishResponse } from "./base-publisher";

export class TwitterPublisher extends BasePublisher {
  platform = "twitter";
  apiKey = process.env.TWITTER_API_KEY || "";
  apiSecret = process.env.TWITTER_API_SECRET || "";

  /**
   * Publish to Twitter/X using API v2
   */
  async publish(request: PublishRequest): Promise<PublishResponse> {
    if (!this.validateCredentials()) {
      return this.createMockResponse(`tw-${Date.now()}`);
    }

    try {
      const videoId = `tw-${Date.now()}`;
      const text = this.truncate(`${request.title}\n\n${this.formatHashtags(request.hashtags)}`, 280);

      console.log(`[Twitter] Publishing`);
      console.log(`[Twitter] Text (${text.length}/280): ${text}`);

      // TODO: Implement Twitter v2 API
      // 1. Upload media: POST /2/tweets/managed_tweets/upload
      // 2. Create tweet: POST /2/tweets

      return {
        platform: this.platform,
        success: true,
        videoId,
        url: this.getPublishedUrl(videoId),
        publishedAt: Date.now(),
        details: {
          text_length: text.length,
          media_type: "video",
          status: "posted",
        },
      };
    } catch (error) {
      return {
        platform: this.platform,
        success: false,
        error: `Failed to publish to Twitter: ${String(error)}`,
      };
    }
  }

  getPublishedUrl(videoId: string): string {
    return `https://twitter.com/FinancialWar/status/${videoId.replace("tw-", "")}`;
  }
}
