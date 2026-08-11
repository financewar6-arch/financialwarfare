import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ArticlePayload {
  headline: string;
  source: string;
  body: string;
  market_impact: string;
  tactical: string;
  key_numbers?: string[];
  original_url: string;
  published_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify Bearer token
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const expectedToken = process.env.WEBSITE_API_TOKEN;

    if (!token || !expectedToken || token !== expectedToken) {
      console.error(`[${new Date().toISOString()}] Unauthorized article POST attempt`);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const payload: ArticlePayload = await request.json();

    // Validate required fields
    const requiredFields = ["headline", "source", "body", "market_impact", "tactical", "original_url"];
    for (const field of requiredFields) {
      if (!payload[field as keyof ArticlePayload]) {
        console.error(`[${new Date().toISOString()}] Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create article
    const article = await prisma.dailyDispatchArticle.create({
      data: {
        headline: payload.headline,
        source: payload.source.toUpperCase(),
        body: payload.body,
        marketImpact: payload.market_impact,
        tactical: payload.tactical,
        keyNumbers: payload.key_numbers || [],
        originalUrl: payload.original_url,
        publishedAt: payload.published_at ? new Date(payload.published_at) : new Date(),
      },
    });

    console.log(`[${new Date().toISOString()}] ✅ Article posted: "${article.headline}" from ${article.source}`);

    return NextResponse.json(
      {
        success: true,
        url: `/daily-dispatch?date=${article.publishedAt.toISOString().split("T")[0]}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error posting article:`, error);
    return NextResponse.json(
      { error: "Failed to post article" },
      { status: 500 }
    );
  }
}

// Test endpoint (for development only)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  const action = request.nextUrl.searchParams.get("action");

  if (action === "test") {
    // POST a test article
    const testArticle: ArticlePayload = {
      headline: "Market Alert: Tech Stocks Rally on AI Earnings Beat",
      source: "FINNHUB",
      body: "Major technology companies surged in afternoon trading following stronger-than-expected earnings reports. The rally was led by AI-focused firms reporting record revenue and margin expansion. Market analysts point to institutional accumulation as a key driver. Investors should monitor Fed communication for any signals that could impact valuation multiples. The sector's momentum appears sustainable given underlying growth fundamentals.",
      market_impact: "Positive for growth stocks | Risk to bond markets if rate expectations shift",
      tactical: "LONG: Quality tech with earnings visibility | AVOID: Highly leveraged growth plays | WATCH: Sector rotation signals",
      key_numbers: ["$2.3T market cap added", "15% YTD gain", "+250bps beta"],
      original_url: "https://example.com/article",
      published_at: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/api/articles", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.WEBSITE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testArticle),
      });

      const data = await response.json();
      return NextResponse.json({
        message: "Test article posted",
        response: data,
      });
    } catch (error) {
      return NextResponse.json({
        error: "Failed to post test article",
        details: String(error),
      });
    }
  }

  return NextResponse.json({
    message: "Article API ready",
    instructions: "POST to this endpoint with Bearer token in Authorization header",
    testUrl: "?action=test",
  });
}
