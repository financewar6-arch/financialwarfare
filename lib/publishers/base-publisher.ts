export interface PublishRequest {
  videoPath: string; // Local file path to video
  videoUrl?: string; // Hosted video URL if not local
  title: string;
  description: string;
  hashtags: string[];
  thumbnail?: string;
  platform: "youtube" | "tiktok" | "instagram" | "linkedin" | "snapchat" | "twitter";
  metadata?: Record<string, any>;
}

export interface PublishResponse {
  platform: string;
  success: boolean;
  videoId?: string;
  url?: string;
  publishedAt?: number;
  error?: string;
  details?: Record<string, any>;
}

export abstract class BasePublisher {
  abstract platform: string;
  abstract apiKey: string;

  abstract publish(request: PublishRequest): Promise<PublishResponse>;

  abstract getPublishedUrl(videoId: string): string;

  /**
   * Validate that required credentials are configured
   */
  protected validateCredentials(): boolean {
    if (!this.apiKey) {
      console.warn(`${this.platform} API key not configured`);
      return false;
    }
    return true;
  }

  /**
   * Truncate title/description to platform limits
   */
  protected truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
  }

  /**
   * Format hashtags for platform
   */
  protected formatHashtags(hashtags: string[], separator = " "): string {
    return hashtags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)).join(separator);
  }

  /**
   * Create a fallback response when API key is missing
   */
  protected createMockResponse(videoId: string): PublishResponse {
    return {
      platform: this.platform,
      success: true,
      videoId: videoId || `mock-${Date.now()}`,
      url: this.getPublishedUrl(videoId || `mock-${Date.now()}`),
      publishedAt: Date.now(),
      details: {
        message: "Mock publish (API key not configured)",
        mode: "test",
      },
    };
  }
}
