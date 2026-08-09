import type { ProcessedNewsArticle } from "./news-article";
import type { PlatformScript } from "@/lib/pipeline/platform-script-generator";

export interface ContentPackage {
  id: string;
  createdAt: number;
  status: "draft" | "scripts_generated" | "scripts_approved" | "videos_ready" | "published" | "archived";

  // Story information
  stories: ProcessedNewsArticle[];
  storyCount: number;
  lookbackHours: number;

  // Generated content
  scripts: PlatformScript[];
  theme: string; // "crypto focus", "market rally", "earnings season", etc.
  briefing: string; // Human-readable summary

  // Review workflow
  reviewedBy?: string;
  reviewedAt?: number;
  approvalNotes?: string;
  rejectionReason?: string;

  // Publishing
  videoIds?: Record<string, string>; // { "youtube": "vid123", "tiktok": "vid456" }
  publishedAt?: number;
  scheduledFor?: number; // Future publish time

  // Metadata
  assetsMentioned: string[];
  totalScriptWords: number;
  estimatedVideoCount: number; // One per story typically

  updatedAt: number;
  expiresAt: number;
}

/**
 * Create a new content package from stories
 */
export function createContentPackage(
  stories: ProcessedNewsArticle[],
  scripts: PlatformScript[],
  lookbackHours: number
): ContentPackage {
  const now = Date.now();
  const assetsMentioned = Array.from(
    new Set(stories.flatMap((s) => s.mentionedAssets || []))
  );

  const totalScriptWords = scripts.reduce((acc, s) => acc + s.script.split(/\s+/).length, 0);

  return {
    id: `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    status: "scripts_generated",
    stories,
    storyCount: stories.length,
    lookbackHours,
    scripts,
    theme: generateTheme(assetsMentioned),
    briefing: generateBriefing(stories),
    assetsMentioned,
    totalScriptWords,
    estimatedVideoCount: scripts.length,
    updatedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7-day expiration
  };
}

/**
 * Determine content theme based on mentioned assets
 */
function generateTheme(assets: string[]): string {
  const hasCrypto = assets.some((a) => ["BTC", "ETH", "bitcoin", "ethereum"].includes(a));
  const hasTech = assets.some((a) => ["NVDA", "AAPL", "MSFT", "TSLA"].includes(a));
  const hasGold = assets.some((a) => ["GOLD", "gold"].includes(a));
  const hasIndices = assets.some((a) => ["SPY", "QQQ", "sp500", "nasdaq"].includes(a));

  if (hasCrypto && assets.length === 1) return "Crypto Focus";
  if (hasTech && hasCrypto) return "Tech & Crypto Mixed";
  if (hasTech) return "Tech Sector Alert";
  if (hasGold) return "Safe Haven Flows";
  if (hasIndices) return "Broad Market Move";
  return "Mixed Markets";
}

/**
 * Generate human-readable briefing
 */
function generateBriefing(stories: ProcessedNewsArticle[]): string {
  const topStories = stories.slice(0, 3);
  const summary = topStories
    .map((s, idx) => `${idx + 1}. ${s.title}`)
    .join("\n");

  return `Daily Content Package\n\nTop Stories:\n${summary}\n\nReady for script review and approval.`;
}

/**
 * Update package status
 */
export function updatePackageStatus(
  pkg: ContentPackage,
  status: ContentPackage["status"],
  metadata?: Partial<ContentPackage>
): ContentPackage {
  return {
    ...pkg,
    status,
    ...metadata,
    updatedAt: Date.now(),
  };
}

/**
 * Approve package for video generation
 */
export function approvePackage(
  pkg: ContentPackage,
  reviewedBy: string,
  notes?: string
): ContentPackage {
  return {
    ...pkg,
    status: "scripts_approved",
    reviewedBy,
    reviewedAt: Date.now(),
    approvalNotes: notes,
    updatedAt: Date.now(),
  };
}

/**
 * Reject package with reason
 */
export function rejectPackage(
  pkg: ContentPackage,
  reason: string,
  reviewedBy?: string
): ContentPackage {
  return {
    ...pkg,
    status: "draft",
    rejectionReason: reason,
    reviewedBy,
    reviewedAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Mark videos as ready for publishing
 */
export function markVideosReady(
  pkg: ContentPackage,
  videoIds: Record<string, string>
): ContentPackage {
  return {
    ...pkg,
    status: "videos_ready",
    videoIds,
    updatedAt: Date.now(),
  };
}

/**
 * Mark package as published
 */
export function publishPackage(pkg: ContentPackage): ContentPackage {
  return {
    ...pkg,
    status: "published",
    publishedAt: Date.now(),
    updatedAt: Date.now(),
  };
}
