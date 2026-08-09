import type { LuxuryDataProvider, LuxuryMarketMetrics } from "./types";
import type { LuxuryAsset, LuxuryCategory, AuctionResult } from "@/lib/models/luxury-asset";
import { createLuxuryAsset } from "@/lib/models/luxury-asset";

// In-memory mock data store
const mockAssets = new Map<string, LuxuryAsset>();

// Initialize mock data on first load
function initializeMockData() {
  if (mockAssets.size > 0) return; // Already initialized

  const mockWatches: LuxuryAsset[] = [
    createLuxuryAsset({
      category: "watches",
      name: "Rolex Daytona 116500LN",
      brand: "Rolex",
      model: "Daytona",
      reference: "116500LN",
      year: 2020,
      description: "Iconic steel sports chronograph with Oystersteel case and white dial",
      currentMarketValue: 18500,
      currency: "USD",
      heroImage: "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=800&h=600&fit=crop",
      specifications: {
        Material: "Oystersteel",
        Diameter: "40mm",
        Movement: "Automatic Chronograph",
        Waterproof: "100m",
      },
    }),
    createLuxuryAsset({
      category: "watches",
      name: "Patek Philippe Nautilus 5711",
      brand: "Patek Philippe",
      model: "Nautilus",
      reference: "5711",
      year: 2019,
      description: "Legendary integrated bracelet sports watch with grande sonnerie movement",
      currentMarketValue: 52000,
      currency: "USD",
      heroImage: "https://images.unsplash.com/photo-1579836343287-ecda40d9effa?w=800&h=600&fit=crop",
      specifications: {
        Material: "Stainless Steel",
        Diameter: "40mm",
        Movement: "Automatic",
        WaterResistant: "120m",
      },
    }),
    createLuxuryAsset({
      category: "watches",
      name: "Omega Seamaster Aqua Terra",
      brand: "Omega",
      model: "Seamaster Aqua Terra",
      year: 2021,
      currentMarketValue: 6800,
      currency: "USD",
      heroImage: "https://images.unsplash.com/photo-1506925925042-35f72bed53b0?w=800&h=600&fit=crop",
    }),
  ];

  const mockCars: LuxuryAsset[] = [
    createLuxuryAsset({
      category: "cars",
      name: "Ferrari F40",
      brand: "Ferrari",
      model: "F40",
      year: 1990,
      description: "Iconic 1990s supercar with legendary twin-turbocharged engine",
      currentMarketValue: 1800000,
      currency: "USD",
      heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
      specifications: {
        Engine: "3.0L Twin-Turbocharged V8",
        HorsePower: "478hp",
        TopSpeed: "201 mph",
        ProductionYears: "1987-1992",
      },
    }),
    createLuxuryAsset({
      category: "cars",
      name: "Porsche 911 GT3",
      brand: "Porsche",
      model: "911 GT3",
      year: 2023,
      currentMarketValue: 185000,
      currency: "USD",
      heroImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    }),
  ];

  const mockDiamonds: LuxuryAsset[] = [
    createLuxuryAsset({
      category: "diamonds",
      name: "2.0ct Round Diamond (D Color, VVS1)",
      brand: "Natural Diamond",
      currentMarketValue: 18000,
      currency: "USD",
      specifications: {
        Carat: "2.0",
        Color: "D",
        Clarity: "VVS1",
        Cut: "Excellent",
        Shape: "Round Brilliant",
      },
    }),
  ];

  [...mockWatches, ...mockCars, ...mockDiamonds].forEach((asset) => {
    mockAssets.set(asset.id, asset);
  });
}

export const mockLuxuryProvider: LuxuryDataProvider = {
  name: "Mock Luxury Data Provider",
  type: "mock",
  isConnected: true,

  async getAsset(assetId: string): Promise<LuxuryAsset | null> {
    initializeMockData();
    return mockAssets.get(assetId) || null;
  },

  async getAssetsByCategory(category: LuxuryCategory): Promise<LuxuryAsset[]> {
    initializeMockData();
    return Array.from(mockAssets.values()).filter((asset) => asset.category === category);
  },

  async searchAssets(query: string): Promise<LuxuryAsset[]> {
    initializeMockData();
    const q = query.toLowerCase();
    return Array.from(mockAssets.values()).filter(
      (asset) =>
        asset.name.toLowerCase().includes(q) ||
        asset.brand?.toLowerCase().includes(q) ||
        asset.model?.toLowerCase().includes(q)
    );
  },

  async getAllAssets(): Promise<LuxuryAsset[]> {
    initializeMockData();
    return Array.from(mockAssets.values());
  },

  async getMarketMetrics(category?: LuxuryCategory): Promise<LuxuryMarketMetrics> {
    initializeMockData();
    const assets = category
      ? Array.from(mockAssets.values()).filter((a) => a.category === category)
      : Array.from(mockAssets.values());

    return {
      topMovers: assets.slice(0, 5),
      mostWatched: assets.slice(0, 3),
      recentAuctionResults: [],
      marketTrend: "rising",
    };
  },

  async getPriceHistory(assetId: string, days: number = 365): Promise<any> {
    // Generate mock historical data
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const history = [];

    for (let i = 0; i < days; i++) {
      const variance = (Math.random() - 0.5) * 0.02; // ±1% daily variance
      history.push({
        timestamp: now - (days - i) * dayMs,
        price: 100 * (1 + variance), // Normalized to 100
      });
    }

    return history;
  },

  async getAuctionResults(assetId: string): Promise<AuctionResult[]> {
    // Mock auction results
    return [
      {
        id: "auction-1",
        date: Date.now() - 7 * 24 * 60 * 60 * 1000,
        auctionHouse: "Christie's",
        soldPrice: 150000,
        estimatedPrice: 140000,
        currency: "USD",
        resultPercent: 7.14,
        saleType: "auction",
      },
    ];
  },

  async createAsset(asset: any): Promise<LuxuryAsset> {
    initializeMockData();
    const newAsset = createLuxuryAsset(asset);
    mockAssets.set(newAsset.id, newAsset);
    return newAsset;
  },

  async updateAsset(assetId: string, updates: Partial<LuxuryAsset>): Promise<LuxuryAsset> {
    initializeMockData();
    const asset = mockAssets.get(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);

    const updated = { ...asset, ...updates, updatedAt: Date.now() };
    mockAssets.set(assetId, updated);
    return updated;
  },

  async deleteAsset(assetId: string): Promise<boolean> {
    initializeMockData();
    return mockAssets.delete(assetId);
  },
};
