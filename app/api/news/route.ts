import { fetchFinanceNews, fetchCryptoNews, fetchMarketNews } from "@/lib/providers/newsapi";

const demoArticles = [
  {
    title: "Tech stocks rally on AI optimism",
    description: "Major tech companies see gains as AI investment continues",
    url: "#",
    source: { name: "Financial Times" },
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Bitcoin stabilizes above $45,000",
    description: "Cryptocurrency markets show strength amid economic uncertainty",
    url: "#",
    source: { name: "CoinDesk" },
    publishedAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "market";

    let articles;
    switch (category) {
      case "crypto":
        articles = await fetchCryptoNews(15);
        break;
      case "market":
        articles = await fetchMarketNews(15);
        break;
      default:
        articles = await fetchFinanceNews(category, 15);
    }

    return Response.json({ articles });
  } catch (error) {
    console.error("News API error:", error);
    return Response.json({ articles: demoArticles });
  }
}
