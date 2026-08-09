import type { LuxuryAsset, LuxuryCategory, AuctionResult } from "@/lib/models/luxury-asset";

export interface LuxuryMarketMetrics {
  topMovers: LuxuryAsset[]; // Top 5-10 assets by price change
  mostWatched: LuxuryAsset[]; // Most viewed/searched assets
  recentAuctionResults: AuctionResult[]; // Latest auction sales
  averagePrice?: number; // Category average price
  marketTrend?: "rising" | "stable" | "falling";
}

export interface LuxuryDataProvider {
  name: string; // Provider name
  type: "manual" | "api" | "mock"; // Type of provider
  isConnected: boolean; // Whether provider is currently working

  // Asset Operations
  getAsset(assetId: string): Promise<LuxuryAsset | null>;
  getAssetsByCategory(category: LuxuryCategory): Promise<LuxuryAsset[]>;
  searchAssets(query: string): Promise<LuxuryAsset[]>;
  getAllAssets(): Promise<LuxuryAsset[]>;

  // Market Data
  getMarketMetrics(category?: LuxuryCategory): Promise<LuxuryMarketMetrics>;
  getPriceHistory(assetId: string, days?: number): Promise<any>;
  getAuctionResults(assetId: string): Promise<AuctionResult[]>;

  // Admin Operations
  createAsset(asset: any): Promise<LuxuryAsset>;
  updateAsset(assetId: string, updates: Partial<LuxuryAsset>): Promise<LuxuryAsset>;
  deleteAsset(assetId: string): Promise<boolean>;
}

export interface ProviderStatus {
  name: string;
  connected: boolean;
  lastSync?: number;
  error?: string;
}
