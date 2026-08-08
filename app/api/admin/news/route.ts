// Admin News Intelligence Dashboard
// View processed articles, clusters, and intelligence status

import { NextRequest, NextResponse } from "next/server";
import {
  getNewsArticlesByStatus,
  getNewsArticlesByAsset,
  getRecent,
  getNewsClusterByHash,
} from "@/lib/news-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "recent";
  const asset = searchParams.get("asset");
  const status = searchParams.get("status") as any;
  const hours = parseInt(searchParams.get("hours") || "24", 10);

  try {
    let data;

    if (action === "recent") {
      data = await getRecent(hours * 60);
    } else if (action === "asset" && asset) {
      data = await getNewsArticlesByAsset(asset);
    } else if (action === "status" && status) {
      data = await getNewsArticlesByStatus(status);
    } else {
      data = await getRecent(60);
    }

    // Summarize intelligence extracted
    const summary = {
      totalArticles: data.length,
      byStatus: {
        ingested: data.filter((a: any) => a.status === "ingested").length,
        fact_extracted: data.filter((a: any) => a.status === "fact_extracted").length,
        market_matched: data.filter((a: any) => a.status === "market_matched").length,
        clustered: data.filter((a: any) => a.status === "clustered").length,
        event_created: data.filter((a: any) => a.status === "event_created").length,
        failed: data.filter((a: any) => a.status === "failed").length,
      },
      qualityBreakdown: {
        highQuality: data.filter((a: any) => a.qualityScore >= 70).length,
        mediumQuality: data.filter((a: any) => a.qualityScore >= 50 && a.qualityScore < 70)
          .length,
        lowQuality: data.filter((a: any) => a.qualityScore < 50).length,
      },
      assets: [...new Set(data.flatMap((a: any) => a.mentionedAssets))],
      sources: [...new Set(data.map((a: any) => a.sourceId))],
    };

    // Return summary + detailed articles
    return NextResponse.json({
      summary,
      articles: data.map((a: any) => ({
        id: a.id,
        title: a.title,
        source: a.sourceId,
        publishedAt: new Date(a.publishedAt).toISOString(),
        status: a.status,
        qualityScore: a.qualityScore,
        mentionedAssets: a.mentionedAssets,
        factCount: a.facts?.length || 0,
        eventId: a.eventId,
        clusterHash: a.clusterHash,
        isClusterLead: a.isClusterLead,
      })),
    });
  } catch (error) {
    console.error("Admin news query error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
