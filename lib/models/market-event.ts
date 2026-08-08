// Canonical Market Event Model
// Represents a meaningful market occurrence (not ephemeral like FrontLineEvent)
// Everything else consumes this event

export type EventType =
  | "price_spike"
  | "volume_surge"
  | "news_event"
  | "earnings"
  | "macro_event"
  | "regulatory"
  | "sector_move"
  | "correlation_move";

export type AssetType = "crypto" | "stock" | "commodity" | "metal" | "index";

export type EventStatus =
  | "detected"      // Initial detection
  | "processing"    // Enrichment underway
  | "validated"     // Facts checked
  | "ready"         // Approved for content generation
  | "published"     // Content generated
  | "archived";     // Old event (>24 hours)

export interface NewsArticleRef {
  title: string;
  url: string;
  source: string;
  publishedAt: number;
}

export interface MarketEvent {
  // Identity
  id: string; // UUID

  // Asset reference
  assetSlug: string; // bitcoin, nvda, etc.
  assetName: string; // BITCOIN, NVIDIA
  assetSymbol: string; // BTC-USD, NVDA
  assetType: AssetType;

  // Event classification
  eventType: EventType;

  // Content (AI-enriched, but data-driven)
  headline: string; // "NVDA surges 5.8% on AI announcement"
  summary: string; // Paragraph explaining the event
  whyItMoved: string; // Cause (from news + data)
  whyItMatters: string; // Why traders should care
  risk: string; // What could go wrong
  whatToWatch: string; // Next key level/event

  // Scoring
  importanceScore: number; // 0-100
  confidenceScore: number; // 0-100 (how sure we are)

  // Market data (hard facts only)
  priceChange: number; // %
  priceChangedAt: number; // timestamp of change
  volumeRatio: number | null; // current / 7-day avg
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;

  // Relationships
  relatedAssets: string[]; // slugs of correlated assets
  relatedNews: NewsArticleRef[]; // supporting articles
  sourceEvents: string[]; // IDs of macro/earnings events that triggered this

  // Lifecycle
  status: EventStatus;

  // Content publication tracking
  seoPageExists: boolean;
  seoPagePath: string | null;
  youtubeScriptGenerated: boolean;
  socialPostGenerated: boolean;
  emailIncluded: boolean;

  // Timestamps
  detectedAt: number;
  enrichedAt: number | null;
  publishedAt: number | null;
  archivedAt: number | null;
  updatedAt: number;
  expiresAt: number; // Event becomes stale (24h default)

  // Optional metadata
  tags?: string[]; // "earnings", "macro", "technicals"
  parentEventId?: string; // If this is a follow-up to another event
}

// Helper types for database operations
export interface CreateMarketEventInput {
  assetSlug: string;
  assetName: string;
  assetSymbol: string;
  assetType: AssetType;
  eventType: EventType;
  headline: string;
  priceChange: number;
  volumeRatio?: number | null;
  relatedAssets?: string[];
  relatedNews?: NewsArticleRef[];
}

export interface UpdateMarketEventInput {
  headline?: string;
  summary?: string;
  whyItMoved?: string;
  whyItMatters?: string;
  risk?: string;
  whatToWatch?: string;
  importanceScore?: number;
  confidenceScore?: number;
  status?: EventStatus;
  seoPagePath?: string | null;
  youtubeScriptGenerated?: boolean;
  socialPostGenerated?: boolean;
  emailIncluded?: boolean;
  relatedNews?: NewsArticleRef[];
  expiresAt?: number;
  publishedAt?: number | null;
}

// Deduplication key: identifies the same logical event
export function getEventGroupKey(event: Partial<MarketEvent>): string {
  const hour = Math.floor(event.detectedAt! / (3600 * 1000));
  return `${event.assetSlug}:${event.eventType}:${hour}`;
}

// Determine if event is stale (old enough to archive)
export function isEventStale(event: MarketEvent): boolean {
  return Date.now() > event.expiresAt;
}

// Calculate default expiration (24 hours from now)
export function getDefaultExpiration(): number {
  return Date.now() + 24 * 3600 * 1000;
}
