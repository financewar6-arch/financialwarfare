import { NextRequest, NextResponse } from "next/server";
import { getAssetConfig } from "@/lib/assets";

export async function GET(
  request: NextRequest,
  { params }: { params: { asset: string } }
) {
  const assetSlug = params.asset as string;

  try {
    const asset = getAssetConfig(assetSlug);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const staticEditorials: Record<string, any> = {
      bitcoin: () => import("@/content/bitcoin").then((m) => m.bitcoinEditorial),
      palantir: () => import("@/content/palantir").then((m) => m.palantirEditorial),
      shopify: () => import("@/content/shopify").then((m) => m.shopifyEditorial),
    };

    const getEditorial = staticEditorials[assetSlug];
    if (!getEditorial) {
      return NextResponse.json({ error: "No editorial for asset" }, { status: 404 });
    }

    const editorial = await getEditorial();

    return NextResponse.json({
      success: true,
      asset: assetSlug,
      editorial,
      updatedAt: new Date(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch editorial" }, { status: 500 });
  }
}
