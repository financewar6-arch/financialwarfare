// Test News Intelligence Pipeline
// Manual testing endpoint for development

import { NextRequest, NextResponse } from "next/server";
import {
  extractFactsFromArticle,
  generateArticleHash,
  generateClusterHash,
} from "@/lib/generators/news-fact-extractor";
import { ingestArticle } from "@/lib/generators/news-intelligence-pipeline";
import { ExtractedFact } from "@/lib/models/news-article";

const KNOWN_ASSETS = ["bitcoin", "ethereum", "gold", "nvda", "spy"];

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.test === "fact_extraction") {
    // Test fact extraction from sample article
    const testArticle = {
      title: "Bitcoin Surges 5% as Institutional Buyers Enter Market",
      description:
        "Major cryptocurrency Bitcoin gained 5% today as institutional investors increased their exposure. Market watchers suggest the move follows positive sentiment around regulatory clarity. Trading volume increased 25% from the 7-day average.",
      url: "https://example.com/bitcoin-surge",
    };

    const result = await extractFactsFromArticle(testArticle, KNOWN_ASSETS);

    return NextResponse.json({
      test: "fact_extraction",
      input: testArticle,
      output: result,
      success: result.facts.length > 0,
    });
  }

  if (body.test === "article_ingestion") {
    // Test full article ingestion
    const testArticle = {
      title: "Gold hits 3-month high on inflation concerns",
      description:
        "Gold prices reached a 3-month high today as investors sought safe-haven assets amid persistent inflation concerns. Central bank policy uncertainty also supported prices. The yellow metal gained 1.2% on the day.",
      url: "https://example.com/gold-high",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      source: { name: "Financial Times" },
    };

    const ingested = await ingestArticle(testArticle);

    return NextResponse.json({
      test: "article_ingestion",
      success: !!ingested,
      article: ingested && {
        id: ingested.id,
        status: ingested.status,
        qualityScore: ingested.qualityScore,
        factCount: ingested.facts.length,
        mentionedAssets: ingested.mentionedAssets,
      },
    });
  }

  if (body.test === "deduplication") {
    // Test article hash deduplication
    const urls = [
      "https://reuters.com/article/bitcoin-surge",
      "https://bloomberg.com/article/bitcoin-surge",
      "https://cnbc.com/article/bitcoin-surge",
      "https://reuters.com/article/different-story",
    ];

    const hashes = urls.map((url) => generateArticleHash(url));

    return NextResponse.json({
      test: "deduplication",
      urls: urls.map((url, i) => ({
        url,
        hash: hashes[i],
      })),
      duplicateDetected: hashes[0] === hashes[1] && hashes[1] !== hashes[3],
    });
  }

  if (body.test === "cluster_hash") {
    // Test cluster hash generation
    const facts: ExtractedFact[] = [
      {
        claim: "Bitcoin jumped 5% on institutional buying",
        confidence: "CONFIRMED",
        sources: ["Paragraph 1"],
        relatedAssets: ["bitcoin"],
      },
      {
        claim: "Volume increased 25% above average",
        confidence: "CONFIRMED",
        sources: ["Paragraph 2"],
        relatedAssets: ["bitcoin"],
      },
    ];

    const hash = await generateClusterHash(facts, ["bitcoin"]);

    return NextResponse.json({
      test: "cluster_hash",
      factCount: facts.length,
      assets: ["bitcoin"],
      clusterHash: hash,
      note: "Same hash across different sources = same story",
    });
  }

  return NextResponse.json(
    {
      error: "Unknown test",
      available: [
        "fact_extraction",
        "article_ingestion",
        "deduplication",
        "cluster_hash",
      ],
    },
    { status: 400 }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const test = searchParams.get("test");

  return NextResponse.json({
    message: "Test news pipeline",
    availableTests: [
      "fact_extraction",
      "article_ingestion",
      "deduplication",
      "cluster_hash",
    ],
    usage: `POST /api/admin/test-news-pipeline with JSON body: { "test": "${test || "fact_extraction"}" }`,
  });
}
