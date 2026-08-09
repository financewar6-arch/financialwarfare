import type { LuxuryDataProvider, LuxuryMarketMetrics } from "@/lib/providers/luxury/types";
import type { LuxuryAsset, LuxuryCategory } from "@/lib/models/luxury-asset";
import { mockLuxuryProvider } from "@/lib/providers/luxury/mock-provider";

// Currently using mock provider - this is where you'd inject real providers later
const currentProvider: LuxuryDataProvider = mockLuxuryProvider;

export const luxuryDataService = {
  // Get a single asset by ID
  async getAsset(assetId: string): Promise<LuxuryAsset | null> {
    try {
      return await currentProvider.getAsset(assetId);
    } catch (error) {
      console.error(`Error fetching asset ${assetId}:`, error);
      return null;
    }
  },

  // Get assets by category
  async getAssetsByCategory(category: LuxuryCategory): Promise<LuxuryAsset[]> {
    try {
      return await currentProvider.getAssetsByCategory(category);
    } catch (error) {
      console.error(`Error fetching assets for category ${category}:`, error);
      return [];
    }
  },

  // Search for assets
  async searchAssets(query: string): Promise<LuxuryAsset[]> {
    try {
      if (!query || query.length < 2) return [];
      return await currentProvider.searchAssets(query);
    } catch (error) {
      console.error("Error searching assets:", error);
      return [];
    }
  },

  // Get all assets
  async getAllAssets(): Promise<LuxuryAsset[]> {
    try {
      return await currentProvider.getAllAssets();
    } catch (error) {
      console.error("Error fetching all assets:", error);
      return [];
    }
  },

  // Get market metrics for category
  async getMarketMetrics(category?: LuxuryCategory): Promise<LuxuryMarketMetrics> {
    try {
      return await currentProvider.getMarketMetrics(category);
    } catch (error) {
      console.error("Error fetching market metrics:", error);
      return {
        topMovers: [],
        mostWatched: [],
        recentAuctionResults: [],
      };
    }
  },

  // Get price history for an asset
  async getPriceHistory(assetId: string, days?: number) {
    try {
      return await currentProvider.getPriceHistory(assetId, days);
    } catch (error) {
      console.error(`Error fetching price history for ${assetId}:`, error);
      return [];
    }
  },

  // Get auction results for an asset
  async getAuctionResults(assetId: string) {
    try {
      return await currentProvider.getAuctionResults(assetId);
    } catch (error) {
      console.error(`Error fetching auction results for ${assetId}:`, error);
      return [];
    }
  },

  // Admin: Create new asset
  async createAsset(asset: any): Promise<LuxuryAsset | null> {
    try {
      return await currentProvider.createAsset(asset);
    } catch (error) {
      console.error("Error creating asset:", error);
      return null;
    }
  },

  // Admin: Update asset
  async updateAsset(assetId: string, updates: Partial<LuxuryAsset>): Promise<LuxuryAsset | null> {
    try {
      return await currentProvider.updateAsset(assetId, updates);
    } catch (error) {
      console.error(`Error updating asset ${assetId}:`, error);
      return null;
    }
  },

  // Admin: Delete asset
  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      return await currentProvider.deleteAsset(assetId);
    } catch (error) {
      console.error(`Error deleting asset ${assetId}:`, error);
      return false;
    }
  },

  // Get provider status
  getProviderStatus() {
    return {
      name: currentProvider.name,
      connected: currentProvider.isConnected,
      type: currentProvider.type,
    };
  },
};
