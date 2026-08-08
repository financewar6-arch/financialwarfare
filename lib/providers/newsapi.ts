const API_KEY = process.env.NEWSAPI_KEY;
const BASE_URL = "https://newsapi.org/v2";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
}

export async function fetchFinanceNews(query: string, limit = 10): Promise<NewsArticle[]> {
  if (!API_KEY) {
    console.warn("NEWSAPI_KEY not set");
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("NewsAPI fetch failed:", error);
    return [];
  }
}

export async function fetchCryptoNews(limit = 10): Promise<NewsArticle[]> {
  return fetchFinanceNews("cryptocurrency OR bitcoin OR ethereum", limit);
}

export async function fetchMarketNews(limit = 10): Promise<NewsArticle[]> {
  return fetchFinanceNews("stock market OR economy OR federal reserve", limit);
}
