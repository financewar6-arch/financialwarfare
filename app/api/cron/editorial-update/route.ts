// Daily Editorial Content Generator
// Updates war room analysis with fresh market intelligence

import { NextRequest, NextResponse } from "next/server";
import { ASSETS } from "@/lib/assets";
import { generateEditorialContent } from "@/lib/generators/editorial-generator";
import { saveEditorialContent } from "@/lib/editorial-loader";

export async function GET(request: NextRequest) {
  // Security: verify cron secret
  const cronSecret = request.headers.get("Authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (cronSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates: Array<{ asset: string; success: boolean; error?: string }> = [];

    // Generate editorial content for all assets
    const assetEntries = Object.entries(ASSETS);

    for (const [key, asset] of assetEntries) {
      try {
        // Mock market data - in production, fetch real price data
        const priceChange = Math.random() * 4 - 2; // Random -2% to +2% for demo

        const generated = await generateEditorialContent({
          assetName: asset.name,
          assetSymbol: asset.symbol,
          priceChange,
          category: asset.category || "Unknown",
          recentContext: `${asset.name} is trading with ${priceChange > 0 ? "strength" : "weakness"} today.`,
        });

        // Save to disk
        await saveEditorialContent(asset.slug, generated);

        updates.push({
          asset: asset.slug,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to generate editorial for ${key}:`, error);
        updates.push({
          asset: key,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successful = updates.filter((u) => u.success).length;

    return NextResponse.json({
      success: true,
      totalAssets: assetEntries.length,
      updatedAssets: successful,
      updates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Editorial update cron error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
