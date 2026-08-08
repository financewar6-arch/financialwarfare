// Video Content Models for YouTube Shorts / TikTok Pipeline

export type ContentQueueStatus = "DRAFT" | "APPROVED" | "REJECTED" | "GENERATING" | "READY" | "PUBLISHED" | "FAILED";
export type VideoType = "YOUTUBE_SHORT" | "TIKTOK" | "INSTAGRAM_REEL" | "TWITTER_VIDEO";
export type Platform = "youtube" | "tiktok" | "instagram" | "twitter";

export interface VideoScript {
  id: string; // UUID
  marketEventId: string;

  // Content
  hook: string; // Opening line (attention grabber)
  what: string; // What happened
  why: string; // Why it happened (catalyst)
  significance: string; // Why it matters
  watchNext: string; // What to watch next
  cta: string; // Call to action

  // Metadata
  durationSeconds: number; // 30-60
  fullScript: string; // Complete spoken script

  // Validation
  hasUnsubstantiatedClaims: boolean;
  hasPricePredictions: boolean;
  flaggedIssues: string[];

  // Timestamps
  generatedAt: number;
  validatedAt: number | null;
}

export interface ContentQueue {
  id: string; // UUID
  marketEventId: string;
  videoType: VideoType;

  // Script content
  scriptId: string;
  title: string;
  description: string;

  // Metadata
  assetSlug: string;
  assetSymbol: string;
  assetName: string;
  priceChange: number; // %

  // Status lifecycle
  status: ContentQueueStatus;

  // Video generation
  videoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;

  // Approval workflow
  approvalNotes?: string;
  rejectionReason?: string;

  // Distribution
  publishedAt?: number;
  youtubeVideoId?: string;
  youtubeUrl?: string;

  // Timestamps
  createdAt: number;
  reviewedAt?: number;
  generatedAt?: number;
  updatedAt: number;
}

export interface VideoMetadata {
  id: string; // UUID
  contentQueueId: string;
  marketEventId: string;
  scriptId: string;

  // Video info
  title: string;
  description: string;
  duration: number; // seconds

  // Content
  tags: string[];
  thumbnail: {
    url: string;
    generatedAt: number;
    method: "auto" | "manual" | "frame_extract";
  };

  // File storage
  videoUrl: string;
  videoSize: number; // bytes
  format: "mp4" | "webm" | "mov";
  resolution: "1080p" | "720p" | "480p";
  fps: number;

  // Platforms
  platforms: {
    [key in Platform]?: {
      published: boolean;
      url: string;
      publishedAt: number;
      engagementMetrics?: {
        views: number;
        likes: number;
        shares: number;
        comments: number;
      };
    };
  };

  // Timestamps
  generatedAt: number;
  expiresAt?: number; // Delete old videos after N days
}

export interface VideoGenerationRequest {
  scriptId: string;
  marketEventId: string;
  template: "market_moves" | "price_action" | "breaking_news"; // Template style
  assetSymbol: string;
  priceChange: number;
  title: string;
  duration?: number; // Override default 45 seconds
}

export interface VideoGenerationResponse {
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  status: "success" | "failed";
  error?: string;
}

// Validation helpers
export function validateScript(script: VideoScript): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!script.fullScript) issues.push("Script is empty");
  if (script.durationSeconds < 30) issues.push("Script too short (min 30s)");
  if (script.durationSeconds > 60) issues.push("Script too long (max 60s)");
  if (script.hasUnsubstantiatedClaims) issues.push("Contains unsubstantiated claims");
  if (script.hasPricePredictions) issues.push("Contains price predictions");

  return { valid: issues.length === 0, issues };
}
