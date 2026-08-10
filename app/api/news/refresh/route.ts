import { NextRequest, NextResponse } from "next/server";

async function fetchNewsAPI(query: string, page: number = 1) {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return { articles: [] };

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&page=${page}&apiKey=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status}`);
      return { articles: [] };
    }

    const data = await response.json();
    return {
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
    };
  } catch (error) {
    console.error("NewsAPI fetch error:", error);
    return { articles: [] };
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const queries = [
      "stock market",
      "cryptocurrency",
      "bitcoin ethereum",
      "tech stocks",
      "Federal Reserve",
      "commodities gold oil",
      "economy inflation",
      "earnings",
    ];

    const allArticles = [];

    for (const query of queries) {
      const news = await fetchNewsAPI(query);
      allArticles.push(...news.articles.slice(0, 5));
    }

    // Deduplicate by URL
    const uniqueArticles = Array.from(
      new Map(allArticles.map((a) => [a.url, a])).values()
    );

    return NextResponse.json({
      success: true,
      articles: uniqueArticles.length,
      totalCached: uniqueArticles.length,
      timestamp: new Date().toISOString(),
      source: "newsapi",
      freshness: "live",
    });
  } catch (error) {
    console.error("News refresh error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
