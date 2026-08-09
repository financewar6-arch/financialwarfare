export type LuxuryCategory = "watches" | "cars" | "diamonds" | "handbags" | "art" | "collectibles" | "sneakers" | "jewelry" | "wine" | "other";

export interface LuxuryAsset {
  id: string;
  slug: string; // URL-friendly identifier
  category: LuxuryCategory;

  // Asset Details
  name: string; // e.g., "Rolex Daytona 116500LN"
  brand?: string; // e.g., "Rolex"
  model?: string; // e.g., "Daytona"
  reference?: string; // e.g., "116500LN" - for watches
  year?: number; // Year of manufacture/model
  description?: string; // Long-form description

  // Market Data
  currentMarketValue?: number; // Current estimated market value in USD
  currency: string; // ISO 4217 code (USD, EUR, GBP, etc.)

  // Price History
  twelveMonthChange?: number; // Percentage change over 12 months
  priceHistory?: PricePoint[]; // Historical price data

  // Market Status
  marketTrend?: "rising" | "stable" | "falling"; // ↑ ↔ ↓
  marketActivity?: "high" | "medium" | "low"; // Trading/transaction volume

  // Filtering/Categorization
  subcategory?: string; // e.g., "Stainless Steel", "Sports Car"
  material?: string; // e.g., "Stainless Steel", "Yellow Gold"
  specifications?: Record<string, string>; // Dynamic specs (carat, color, clarity for diamonds)

  // Media
  images?: string[]; // Array of image URLs
  heroImage?: string; // Featured hero image

  // Data Provenance
  source?: string; // Data provider name (e.g., "Chrono24", "Hemmels")
  sourceUrl?: string; // URL to source data
  provider: "manual" | "chrono24" | "hagerty" | "rapaport" | "other"; // Data provider type
  lastDataUpdate?: number; // Timestamp of last data refresh
  dataLicense?: string; // License type if applicable

  // Recent Transactions
  recentSales?: AuctionResult[]; // Recent auction/sale results
  averagePrice?: number; // Average transaction price

  // Metadata
  featured: boolean; // Featured on homepage?
  active: boolean; // Actively tracked?
  status: "active" | "inactive" | "discontinued";
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;

  // Analytics
  viewCount: number;
  searchVolume?: number; // Monthly search volume if available

  // Timestamps
  createdAt: number;
  updatedAt: number;
}

export interface PricePoint {
  timestamp: number; // Date in ms
  price: number; // Price in specified currency
  source?: string; // Data source for this point
}

export interface AuctionResult {
  id: string;
  date: number; // Timestamp
  auctionHouse?: string; // e.g., "Sotheby's", "Chrono24"
  marketplace?: string; // e.g., "eBay", "Grailed"
  soldPrice: number; // Actual sale price
  estimatedPrice?: number; // Pre-sale estimate
  currency: string;
  resultPercent?: number; // (soldPrice - estimatedPrice) / estimatedPrice * 100
  saleType: "auction" | "dealer" | "private" | "marketplace";
  sourceUrl?: string; // Link to auction result
}

export interface LuxuryAssetInput {
  category: LuxuryCategory;
  name: string;
  brand?: string;
  model?: string;
  reference?: string;
  year?: number;
  description?: string;
  currentMarketValue?: number;
  currency?: string;
  images?: string[];
  heroImage?: string;
  provider?: "manual" | "chrono24" | "hagerty" | "rapaport" | "other";
  sourceUrl?: string;
  specifications?: Record<string, string>;
}

export function createLuxuryAsset(input: LuxuryAssetInput): LuxuryAsset {
  const now = Date.now();
  const slug = generateSlug(input.name);

  return {
    id: `luxury-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    slug,
    category: input.category,
    name: input.name,
    brand: input.brand,
    model: input.model,
    reference: input.reference,
    year: input.year,
    description: input.description,
    currentMarketValue: input.currentMarketValue,
    currency: input.currency || "USD",
    images: input.images || [],
    heroImage: input.heroImage,
    provider: input.provider || "manual",
    sourceUrl: input.sourceUrl,
    specifications: input.specifications || {},
    featured: false,
    active: true,
    status: "active",
    seoTitle: `${input.name} Market Value & Price | Financial Warfare`,
    seoDescription: `Track the market value, price history, and auction results for ${input.name}. Real-time luxury asset intelligence.`,
    ogImage: input.heroImage,
    viewCount: 0,
    recentSales: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function updateLuxuryAsset(
  asset: LuxuryAsset,
  updates: Partial<LuxuryAsset>
): LuxuryAsset {
  return {
    ...asset,
    ...updates,
    updatedAt: Date.now(),
  };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

// Category display names
export const LUXURY_CATEGORIES: Record<LuxuryCategory, string> = {
  watches: "Watches",
  cars: "Luxury Cars",
  diamonds: "Diamonds",
  handbags: "Handbags",
  art: "Art",
  collectibles: "Collectibles",
  sneakers: "Sneakers",
  jewelry: "Jewelry",
  wine: "Wine",
  other: "Other Assets",
};
