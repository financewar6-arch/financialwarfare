import { NextRequest, NextResponse } from "next/server";
import { getAssetConfig } from "@/lib/assets";
import type { RangeDays } from "@/lib/providers/types";

const VALID_RANGES: RangeDays[] = ["1", "7", "30"];

export async function GET(request: NextRequest, context: { params: Promise<{ asset: string }> }) {
  const { asset } = await context.params;
  const config = getAssetConfig(asset);
  if (!config) {
    return NextResponse.json({ error: `Unknown asset "${asset}"` }, { status: 404 });
  }

  const rangeParam = request.nextUrl.searchParams.get("range") ?? "1";
  const range = VALID_RANGES.includes(rangeParam as RangeDays) ? (rangeParam as RangeDays) : "1";

  try {
    const data = await config.fetchFeed(range);
    return NextResponse.json(data);
  } catch (err) {
    console.error("warroom feed error", err);
    const message = err instanceof Error ? err.message : "Feed unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
