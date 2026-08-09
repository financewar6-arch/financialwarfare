// JSON-based persistent storage layer
// Compatible API with SQLite version
// Uses .data directory for persistence

import fs from "fs";
import path from "path";
import { MarketEvent, UpdateMarketEventInput } from "./models/market-event";
import { ContentQueue, VideoMetadata } from "./models/video-content";

const DATA_DIR = path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "market-events.json");
const CONTENT_FILE = path.join(DATA_DIR, "content-assets.json");
const CONTENT_QUEUE_FILE = path.join(DATA_DIR, "content-queue.json");
const VIDEO_METADATA_FILE = path.join(DATA_DIR, "video-metadata.json");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load events from file
function loadEvents(): Map<string, MarketEvent> {
  ensureDataDir();
  if (!fs.existsSync(EVENTS_FILE)) {
    return new Map();
  }
  try {
    const data = JSON.parse(fs.readFileSync(EVENTS_FILE, "utf-8"));
    return new Map(Object.entries(data));
  } catch {
    return new Map();
  }
}

// Save events to file
function saveEvents(events: Map<string, MarketEvent>) {
  ensureDataDir();
  const data = Object.fromEntries(events);
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2));
}

// Load content assets from file
function loadContentAssets(): Map<string, any> {
  ensureDataDir();
  if (!fs.existsSync(CONTENT_FILE)) {
    return new Map();
  }
  try {
    const data = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf-8"));
    return new Map(Object.entries(data));
  } catch {
    return new Map();
  }
}

// Save content assets to file
function saveContentAssets(assets: Map<string, any>) {
  ensureDataDir();
  const data = Object.fromEntries(assets);
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
}

// ============ MARKET EVENT OPERATIONS ============

export function createMarketEvent(input: any): MarketEvent {
  const events = loadEvents();

  // Check for recent event (deduplication)
  const recent = findRecentEvent(input.assetSlug, input.eventType);
  if (recent && Date.now() - recent.detectedAt < 4 * 3600 * 1000) {
    // Update existing event
    return updateMarketEvent(recent.id, {
      importanceScore: Math.max(recent.importanceScore, input.importanceScore || 50),
      headline: input.headline,
      priceChange: input.priceChange,
      volumeRatio: input.volumeRatio,
      updatedAt: Date.now(),
      expiresAt: input.expiresAt,
    });
  }

  const event: MarketEvent = {
    id: input.id,
    assetSlug: input.assetSlug,
    assetName: input.assetName,
    assetSymbol: input.assetSymbol,
    assetType: input.assetType,
    eventType: input.eventType,
    headline: input.headline,
    summary: "",
    whyItMoved: "",
    whyItMatters: "",
    risk: "",
    whatToWatch: "",
    importanceScore: input.importanceScore || 50,
    confidenceScore: input.confidenceScore || 75,
    priceChange: input.priceChange,
    priceChangedAt: Date.now(),
    volumeRatio: input.volumeRatio || null,
    relatedAssets: input.relatedAssets || [],
    relatedNews: input.relatedNews || [],
    sourceEvents: [],
    status: "detected",
    seoPageExists: false,
    seoPagePath: null,
    youtubeScriptGenerated: false,
    socialPostGenerated: false,
    emailIncluded: false,
    detectedAt: input.detectedAt,
    enrichedAt: null,
    publishedAt: null,
    archivedAt: null,
    updatedAt: input.detectedAt,
    expiresAt: input.expiresAt,
  };

  events.set(event.id, event);
  saveEvents(events);

  return event;
}

export function updateMarketEvent(id: string, updates: UpdateMarketEventInput): MarketEvent {
  const events = loadEvents();
  const event = events.get(id);

  if (!event) {
    throw new Error(`Market event ${id} not found`);
  }

  const updatedEvent: MarketEvent = {
    ...event,
    ...updates,
    updatedAt: Date.now(),
  };

  events.set(id, updatedEvent);
  saveEvents(events);

  return updatedEvent;
}

export function getMarketEvent(id: string): MarketEvent | null {
  const events = loadEvents();
  return events.get(id) || null;
}

export function findRecentEvent(assetSlug: string, eventType: string): MarketEvent | null {
  const events = loadEvents();
  const matches = Array.from(events.values())
    .filter((e) => e.assetSlug === assetSlug && e.eventType === eventType && e.expiresAt > Date.now())
    .sort((a, b) => b.detectedAt - a.detectedAt);

  return matches[0] || null;
}

export function getRecentEvents(minScore: number = 40, limit: number = 50): MarketEvent[] {
  const events = loadEvents();
  return Array.from(events.values())
    .filter((e) => e.status === "ready" || e.status === "published")
    .filter((e) => e.importanceScore >= minScore && e.expiresAt > Date.now())
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, limit);
}

export function getPublishedEvents(limit: number = 100): MarketEvent[] {
  const events = loadEvents();
  return Array.from(events.values())
    .filter((e) => e.status === "published" && e.expiresAt > Date.now())
    .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
    .slice(0, limit);
}

export function getEventsByStatus(status: string, limit: number = 100): MarketEvent[] {
  const events = loadEvents();
  return Array.from(events.values())
    .filter((e) => e.status === status)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

export function archiveStaleEvents(): number {
  const events = loadEvents();
  let archived = 0;

  events.forEach((event) => {
    if (event.status !== "archived" && event.expiresAt <= Date.now()) {
      event.status = "archived";
      event.archivedAt = Date.now();
      archived++;
    }
  });

  saveEvents(events);
  return archived;
}

export function getAllMarketEvents(): MarketEvent[] {
  const events = loadEvents();
  return Array.from(events.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

// ============ CONTENT ASSET OPERATIONS ============

export function createContentAsset(input: any): any {
  const assets = loadContentAssets();
  const asset = {
    ...input,
  };
  assets.set(input.id, asset);
  saveContentAssets(assets);
  return asset;
}

export function getContentQueue(limit: number = 50): any[] {
  const contentAssets = loadContentAssets();
  const events = loadEvents();

  return Array.from(contentAssets.values())
    .filter((a) => a.status === "draft" || a.status === "ready")
    .map((a) => ({
      ...a,
      event: events.get(a.marketEventId),
    }))
    .sort((a, b) => b.generatedAt - a.generatedAt)
    .slice(0, limit);
}

export function updateContentAsset(id: string, updates: any): void {
  const assets = loadContentAssets();
  const asset = assets.get(id);
  if (asset) {
    assets.set(id, { ...asset, ...updates });
    saveContentAssets(assets);
  }
}

// ============ CONTENT QUEUE OPERATIONS ============

function loadContentQueue(): Map<string, ContentQueue> {
  ensureDataDir();
  if (!fs.existsSync(CONTENT_QUEUE_FILE)) {
    return new Map();
  }
  try {
    const data = JSON.parse(fs.readFileSync(CONTENT_QUEUE_FILE, "utf-8"));
    return new Map(Object.entries(data));
  } catch {
    return new Map();
  }
}

function saveContentQueue(queue: Map<string, ContentQueue>) {
  ensureDataDir();
  const data = Object.fromEntries(queue);
  fs.writeFileSync(CONTENT_QUEUE_FILE, JSON.stringify(data, null, 2));
}

export function createContentQueueItem(item: ContentQueue): ContentQueue {
  const queue = loadContentQueue();
  queue.set(item.id, item);
  saveContentQueue(queue);
  return item;
}

export function getContentQueueItem(id: string): ContentQueue | null {
  const queue = loadContentQueue();
  return queue.get(id) || null;
}

export function getContentQueueByMarketEvent(marketEventId: string): ContentQueue | null {
  const queue = loadContentQueue();
  const items = Array.from(queue.values()).filter((item) => item.marketEventId === marketEventId);
  return items[0] || null;
}

export function getContentQueueByStatus(status: string, limit: number = 50): ContentQueue[] {
  const queue = loadContentQueue();
  return Array.from(queue.values())
    .filter((item) => item.status === status)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

export function updateContentQueueItem(id: string, updates: Partial<ContentQueue>): ContentQueue {
  const queue = loadContentQueue();
  const item = queue.get(id);

  if (!item) {
    throw new Error(`Content queue item ${id} not found`);
  }

  const updated: ContentQueue = {
    ...item,
    ...updates,
    updatedAt: Date.now(),
  };

  queue.set(id, updated);
  saveContentQueue(queue);
  return updated;
}

export function getAllContentQueue(limit: number = 100): ContentQueue[] {
  const queue = loadContentQueue();
  return Array.from(queue.values())
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

// ============ VIDEO METADATA OPERATIONS ============

function loadVideoMetadata(): Map<string, VideoMetadata> {
  ensureDataDir();
  if (!fs.existsSync(VIDEO_METADATA_FILE)) {
    return new Map();
  }
  try {
    const data = JSON.parse(fs.readFileSync(VIDEO_METADATA_FILE, "utf-8"));
    return new Map(Object.entries(data));
  } catch {
    return new Map();
  }
}

function saveVideoMetadata(metadata: Map<string, VideoMetadata>) {
  ensureDataDir();
  const data = Object.fromEntries(metadata);
  fs.writeFileSync(VIDEO_METADATA_FILE, JSON.stringify(data, null, 2));
}

export function createVideoMetadata(video: VideoMetadata): VideoMetadata {
  const metadata = loadVideoMetadata();
  metadata.set(video.id, video);
  saveVideoMetadata(metadata);
  return video;
}

export function getVideoMetadata(id: string): VideoMetadata | null {
  const metadata = loadVideoMetadata();
  return metadata.get(id) || null;
}

export function getVideosByMarketEvent(marketEventId: string): VideoMetadata[] {
  const metadata = loadVideoMetadata();
  return Array.from(metadata.values()).filter((v) => v.marketEventId === marketEventId);
}

export function savePublishedVideos(videos: Partial<VideoMetadata>[]): void {
  const metadata = loadVideoMetadata();

  videos.forEach((video) => {
    const id = video.id || `vid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const fullVideo: VideoMetadata = {
      id,
      contentQueueId: video.contentQueueId || id,
      marketEventId: video.marketEventId || id,
      scriptId: video.scriptId || id,
      title: video.title || "Published Video",
      description: video.description || "",
      duration: video.duration || 60,
      tags: video.tags || [],
      thumbnail: video.thumbnail || {
        url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        generatedAt: now,
        method: "frame_extract",
      },
      videoUrl: video.videoUrl || "",
      videoSize: video.videoSize || 0,
      format: video.format || "mp4",
      resolution: video.resolution || "1080p",
      fps: video.fps || 30,
      platforms: video.platforms || {
        youtube: {
          published: true,
          url: `https://youtube.com/watch?v=${id}`,
          publishedAt: now,
          engagementMetrics: { views: 0, likes: 0, shares: 0, comments: 0 },
        },
      },
      generatedAt: now,
      expiresAt: now + 30 * 24 * 60 * 60 * 1000,
    };

    metadata.set(id, fullVideo);
  });

  saveVideoMetadata(metadata);
}

export function getLatestVideos(limit: number = 5): VideoMetadata[] {
  const metadata = loadVideoMetadata();
  return Array.from(metadata.values())
    .sort((a, b) => b.generatedAt - a.generatedAt)
    .slice(0, limit);
}

export function updateVideoMetadata(id: string, updates: Partial<VideoMetadata>): VideoMetadata {
  const metadata = loadVideoMetadata();
  const video = metadata.get(id);

  if (!video) {
    throw new Error(`Video metadata ${id} not found`);
  }

  const updated: VideoMetadata = {
    ...video,
    ...updates,
  };

  metadata.set(id, updated);
  saveVideoMetadata(metadata);
  return updated;
}

// ============ ANALYTICS OPERATIONS ============

export function trackAnalytics(type: string, source: string, target: string, metadata?: any): void {
  const analytics = fs.existsSync(ANALYTICS_FILE) ? JSON.parse(fs.readFileSync(ANALYTICS_FILE, "utf-8")) : [];

  analytics.push({
    type,
    source,
    target,
    timestamp: Date.now(),
    metadata: metadata || null,
  });

  ensureDataDir();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
}

export function getAnalytics(days: number = 7): any[] {
  if (!fs.existsSync(ANALYTICS_FILE)) {
    return [];
  }

  const cutoff = Date.now() - days * 86400 * 1000;
  const analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, "utf-8"));

  const grouped = new Map<string, any>();

  analytics
    .filter((e: any) => e.timestamp > cutoff)
    .forEach((e: any) => {
      const key = `${e.source}:${e.target}`;
      if (!grouped.has(key)) {
        grouped.set(key, { source: e.source, target: e.target, events: 0, users: new Set() });
      }
      const g = grouped.get(key)!;
      g.events++;
    });

  return Array.from(grouped.values())
    .sort((a, b) => b.events - a.events)
    .slice(0, 100);
}

// Health check
export function ping(): boolean {
  try {
    ensureDataDir();
    const test = { test: true, timestamp: Date.now() };
    const testFile = path.join(DATA_DIR, ".health");
    fs.writeFileSync(testFile, JSON.stringify(test));
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}

// Close/cleanup (for compatibility)
export function closeDatabase(): void {
  // No-op for JSON-based storage
}
