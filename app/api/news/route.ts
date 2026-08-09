import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") || "business";
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    console.warn("NEWSAPI_KEY is not set, returning mock news data");
    return NextResponse.json({
      articles: [
        {
          title: "Market Rally Continues as Tech Stocks Lead Gains",
          description: "Major tech companies drive market higher amid optimism about AI adoption and earnings growth.",
          url: "https://example.com/news1",
          urlToImage: "https://via.placeholder.com/800x450?text=Tech+Rally",
          source: { name: "Market Watch" },
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Federal Reserve Holds Rate Steady on Inflation Progress",
          description: "The central bank maintains its current interest rate as inflation continues to cool, signaling potential rate cuts ahead.",
          url: "https://example.com/news2",
          urlToImage: "https://via.placeholder.com/800x450?text=Fed+Rates",
          source: { name: "Reuters" },
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Gold Prices Surge on Geopolitical Tensions",
          description: "Safe-haven demand pushes gold prices to new highs as investors seek protection amid global uncertainties.",
          url: "https://example.com/news3",
          urlToImage: "https://via.placeholder.com/800x450?text=Gold+Surge",
          source: { name: "CNBC" },
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Crypto Market Rebounds After Regulatory Clarity",
          description: "Bitcoin and Ethereum gain momentum following clearer regulatory frameworks from major economies.",
          url: "https://example.com/news4",
          urlToImage: "https://via.placeholder.com/800x450?text=Crypto+Rally",
          source: { name: "CoinDesk" },
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
      ],
    });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&language=en&pageSize=4&apiKey=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status}`);
      throw new Error(`NewsAPI returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ articles: data.articles || [] });
  } catch (error) {
    console.error("News fetch failed:", error);
    // Return mock data as fallback
    return NextResponse.json({
      articles: [
        {
          title: "Market Rally Continues as Tech Stocks Lead Gains",
          description: "Major tech companies drive market higher amid optimism about AI adoption and earnings growth.",
          url: "https://example.com/news1",
          urlToImage: "https://via.placeholder.com/800x450?text=Tech+Rally",
          source: { name: "Market Watch" },
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Federal Reserve Holds Rate Steady on Inflation Progress",
          description: "The central bank maintains its current interest rate as inflation continues to cool, signaling potential rate cuts ahead.",
          url: "https://example.com/news2",
          urlToImage: "https://via.placeholder.com/800x450?text=Fed+Rates",
          source: { name: "Reuters" },
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Gold Prices Surge on Geopolitical Tensions",
          description: "Safe-haven demand pushes gold prices to new highs as investors seek protection amid global uncertainties.",
          url: "https://example.com/news3",
          urlToImage: "https://via.placeholder.com/800x450?text=Gold+Surge",
          source: { name: "CNBC" },
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Crypto Market Rebounds After Regulatory Clarity",
          description: "Bitcoin and Ethereum gain momentum following clearer regulatory frameworks from major economies.",
          url: "https://example.com/news4",
          urlToImage: "https://via.placeholder.com/800x450?text=Crypto+Rally",
          source: { name: "CoinDesk" },
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
      ],
    });
  }
}
