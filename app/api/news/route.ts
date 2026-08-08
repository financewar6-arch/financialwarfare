import { fetchFinanceNews, fetchCryptoNews, fetchMarketNews } from "@/lib/providers/newsapi";

export async function GET(request: Request) {
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
}
