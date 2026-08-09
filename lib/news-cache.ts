interface CachedNews {
  articles: any[];
  cachedAt: number;
  expiresAt: number;
}

// In-memory cache for news (stores in server memory)
let newsCache: CachedNews = {
  articles: [],
  cachedAt: 0,
  expiresAt: 0,
};

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours (refresh twice daily)

export async function fetchAndCacheNews(category: string = "market") {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    console.warn("NEWSAPI_KEY not set, using fallback news");
    return getDefaultNews();
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${category}&sortBy=publishedAt&language=en&pageSize=8&apiKey=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(`NewsAPI error: ${response.status}`);
      return getDefaultNews();
    }

    const data = await response.json();
    const articles = data.articles || [];

    // Update cache
    newsCache = {
      articles: articles.slice(0, 8), // Keep top 8
      cachedAt: Date.now(),
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    console.log(`✓ News cache updated: ${articles.length} articles fetched`);
    return newsCache.articles;
  } catch (error) {
    console.error("News fetch failed:", error);
    return getDefaultNews();
  }
}

export function getCachedNews() {
  // If cache exists and not expired, return it
  if (newsCache.articles.length > 0 && Date.now() < newsCache.expiresAt) {
    return newsCache.articles;
  }

  // If cache expired but we have articles, return them anyway (better than nothing)
  if (newsCache.articles.length > 0) {
    console.warn("News cache expired, but serving cached articles");
    return newsCache.articles;
  }

  // Fallback to default news
  return getDefaultNews();
}

export function getDefaultNews() {
  return [
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
    {
      title: "Oil Prices Drop on Supply Concerns Easing",
      description: "Crude oil futures decline as OPEC signals potential production adjustments and demand outlook improves.",
      url: "https://example.com/news5",
      urlToImage: "https://via.placeholder.com/800x450?text=Oil+Prices",
      source: { name: "Bloomberg" },
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Earnings Season Kicks Off with Strong Results",
      description: "Major corporations report better-than-expected quarterly earnings, boosting investor confidence and market sentiment.",
      url: "https://example.com/news6",
      urlToImage: "https://via.placeholder.com/800x450?text=Earnings",
      source: { name: "Financial Times" },
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Treasury Yields Stabilize Amid Economic Data",
      description: "Bond market stabilizes after recent volatility as investors digest mixed signals on economic growth and inflation.",
      url: "https://example.com/news7",
      urlToImage: "https://via.placeholder.com/800x450?text=Treasury+Yields",
      source: { name: "Wall Street Journal" },
      publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Tech Sector Leads S&P 500 Higher This Week",
      description: "AI-related stocks and major tech giants outperform market as investors position for growth opportunities.",
      url: "https://example.com/news8",
      urlToImage: "https://via.placeholder.com/800x450?text=Tech+Sector",
      source: { name: "Investor's Business Daily" },
      publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getCacheStatus() {
  return {
    articlesCount: newsCache.articles.length,
    cachedAt: new Date(newsCache.cachedAt).toISOString(),
    expiresAt: new Date(newsCache.expiresAt).toISOString(),
    isExpired: Date.now() > newsCache.expiresAt,
    timeUntilRefresh: Math.max(0, newsCache.expiresAt - Date.now()),
  };
}
