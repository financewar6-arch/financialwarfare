import { NextRequest, NextResponse } from "next/server";
import { fetchLatest10K, fetch10KText } from "@/lib/providers/secedgar";
import { generateDeepDiveSummary, getDeepDiveSummary } from "@/lib/deepdive";

export async function GET(request: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const tickerUpper = ticker.toUpperCase();

  try {
    // Fetch the latest 10-K filing metadata
    const filing = await fetchLatest10K(tickerUpper);
    if (!filing) {
      return NextResponse.json(
        { error: "No 10-K filing found for this ticker" },
        { status: 404 }
      );
    }

    // Check if we already have a cached summary
    const cached = getDeepDiveSummary(tickerUpper, filing.filing_date);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch the full 10-K text
    const filingText = await fetch10KText(filing);
    if (!filingText) {
      return NextResponse.json(
        { error: "Could not fetch filing text" },
        { status: 500 }
      );
    }

    // Generate summary using Claude
    const summary = await generateDeepDiveSummary(tickerUpper, filing.filing_date, filingText);
    if (!summary) {
      return NextResponse.json(
        { error: "Could not generate summary" },
        { status: 500 }
      );
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Deep Dive API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
