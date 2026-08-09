import { luxuryDataService } from "@/lib/services/luxury-data-service";
import type { LuxuryCategory } from "@/lib/models/luxury-asset";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");
    const category = searchParams.get("category") as LuxuryCategory | null;
    const search = searchParams.get("search");
    const assetId = searchParams.get("id");

    // Get single asset by ID
    if (assetId) {
      const asset = await luxuryDataService.getAsset(assetId);
      if (!asset) {
        return NextResponse.json({ error: "Asset not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, asset });
    }

    // Search assets
    if (search) {
      const results = await luxuryDataService.searchAssets(search);
      return NextResponse.json({ success: true, results, total: results.length });
    }

    // Get assets by category
    if (category) {
      const assets = await luxuryDataService.getAssetsByCategory(category);
      return NextResponse.json({ success: true, assets, total: assets.length });
    }

    // Get market metrics
    if (action === "market-metrics") {
      const metrics = await luxuryDataService.getMarketMetrics(category || undefined);
      return NextResponse.json({ success: true, metrics });
    }

    // Get all assets (for admin)
    if (action === "all") {
      const assets = await luxuryDataService.getAllAssets();
      return NextResponse.json({ success: true, assets, total: assets.length });
    }

    // Default: Get all featured assets for homepage
    const assets = await luxuryDataService.getAllAssets();
    const featured = assets.filter((a) => a.featured).slice(0, 6);

    return NextResponse.json({
      success: true,
      featured,
      total: assets.length,
      totalFeatured: featured.length,
    });
  } catch (error) {
    console.error("Luxury API error:", error);
    return NextResponse.json({ error: "Failed to fetch luxury assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, asset, assetId, updates } = body;

    if (action === "create") {
      const newAsset = await luxuryDataService.createAsset(asset);
      if (!newAsset) {
        return NextResponse.json({ error: "Failed to create asset" }, { status: 400 });
      }
      return NextResponse.json({ success: true, asset: newAsset });
    }

    if (action === "update") {
      const updatedAsset = await luxuryDataService.updateAsset(assetId, updates);
      if (!updatedAsset) {
        return NextResponse.json({ error: "Failed to update asset" }, { status: 400 });
      }
      return NextResponse.json({ success: true, asset: updatedAsset });
    }

    if (action === "delete") {
      const deleted = await luxuryDataService.deleteAsset(assetId);
      return NextResponse.json({ success: deleted });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Luxury API error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
