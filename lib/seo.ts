// SEO utilities for article page metadata generation

export interface ArticleMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  canonicalUrl: string;
  lastModified: string;
}

export function generateArticleMetadata(params: {
  symbol: string;
  name: string;
  direction: "up" | "down";
  priceChange: number;
  headline: string;
  baseUrl: string;
}): ArticleMetadata {
  const { symbol, name, direction, priceChange, headline, baseUrl } = params;

  const directionText = direction === "up" ? "up" : "down";
  const changeText = `${direction === "up" ? "+" : ""}${priceChange.toFixed(2)}%`;

  const title = `Why is ${symbol} ${directionText} today? ${changeText} - Financial Warfare`;
  const description = `${name} (${symbol}) is ${directionText} ${changeText} today. ${headline}`;
  const keywords = [symbol, name, direction, "market analysis", "financial news", "stock price"];

  const path = `/stocks/${symbol.toLowerCase()}/why-is-${symbol.toLowerCase()}-${direction}`;
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    keywords,
    ogTitle: `Why is ${symbol} ${directionText}?`,
    ogDescription: description,
    ogImage: `${baseUrl}/api/og?symbol=${symbol}&direction=${direction}&change=${priceChange}`,
    ogUrl: url,
    canonicalUrl: url,
    lastModified: new Date().toISOString(),
  };
}

export function generateDiscoveryPageMetadata(baseUrl: string): ArticleMetadata {
  return {
    title: "Market Discovery - Real-time Market Analysis | Financial Warfare",
    description:
      "Explore in-depth analysis of today's biggest market moves. Discover which assets are moving and why with data-driven financial intelligence.",
    keywords: ["market news", "financial analysis", "trending stocks", "crypto news", "market moves"],
    ogTitle: "Market Discovery",
    ogDescription: "Explore today's biggest market moves with data-driven analysis",
    ogImage: `${baseUrl}/og-default.jpg`,
    ogUrl: `${baseUrl}/discovery`,
    canonicalUrl: `${baseUrl}/discovery`,
    lastModified: new Date().toISOString(),
  };
}
