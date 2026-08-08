// Simple UUID v4 generator (no external dependency)

export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate event ID from asset slug and timestamp
export function generateEventId(assetSlug: string, timestamp: number): string {
  const hash = Math.random().toString(36).substring(2, 9);
  return `event_${assetSlug}_${timestamp}_${hash}`;
}

// Generate content asset ID
export function generateContentAssetId(type: string, eventId: string): string {
  const hash = Math.random().toString(36).substring(2, 9);
  return `asset_${type}_${hash}`;
}
