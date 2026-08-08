// News Intelligence Pipeline
// Transforms raw news articles into original market intelligence
// NO copying/paraphrasing — facts + market data = original analysis

import { ProcessedNewsArticle, NewsCluster } from "@/lib/models/news-article";
import {
  extractFactsFromArticle,
  extractAssetsFromTitle,
  generateArticleHash,
  generateClusterHash,
} from "./news-fact-extractor";
import {
  createNewsArticle,
  updateNewsArticle,
  getNewsArticlesByAsset,
  getNewsClusterByHash,
  createNewsCluster,
  updateNewsCluster,
} from "@/lib/news-db";
import { createMarketEvent, getMarketEvent } from "@/lib/db";
import { MarketEvent, CreateMarketEventInput } from "@/lib/models/market-event";

interface NewsSource {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
}

const KNOWN_ASSETS = ["bitcoin", "ethereum", "gold", "nvda", "spy", "qqq", "iwm"];

// Step 1: Ingest article and extract facts
export async function ingestArticle(
  articleSource: NewsSource
): Promise<ProcessedNewsArticle | null> {
  const articleHash = generateArticleHash(articleSource.url);

  // Extract facts from article
  const extraction = await extractFactsFromArticle(
    {
      title: articleSource.title,
      description: articleSource.description,
      url: articleSource.url,
    },
    KNOWN_ASSETS
  );

  if (extraction.failureReason) {
    console.warn(`Failed to extract from ${articleSource.url}:`, extraction.failureReason);
  }

  // Create/update article record
  const article = await createNewsArticle({
    articleHash,
    sourceId: articleSource.source.name,
    title: articleSource.title,
    description: articleSource.description,
    url: articleSource.url,
    imageUrl: articleSource.urlToImage,
    publishedAt: new Date(articleSource.publishedAt).getTime(),
    facts: extraction.facts,
    qualityScore: extraction.qualityScore,
    mentionedAssets: extraction.mentionedAssets || [],
    status: extraction.shouldCreateEvent ? "fact_extracted" : "ingested",
    processedAt: Date.now(),
    failureReason: extraction.failureReason,
    confidenceIssues: extraction.facts
      .filter((f) => f.confidence === "SPECULATIVE" || f.confidence === "ALLEGED")
      .map((f) => f.claim),
  });

  return article;
}

// Step 2: Cross-check facts with market data
export async function enrichWithMarketData(
  article: ProcessedNewsArticle,
  marketData: Record<string, { price: number; priceChange: number; volume: number }>
) {
  const impactedAssets: ProcessedNewsArticle["impactedAssets"] = [];

  for (const asset of article.mentionedAssets) {
    if (marketData[asset]) {
      const data = marketData[asset];
      impactedAssets.push({
        slug: asset,
        direction:
          data.priceChange > 2
            ? "up"
            : data.priceChange < -2
              ? "down"
              : "mixed",
        confidence: Math.abs(data.priceChange) * 5, // Simple confidence from price move
      });
    }
  }

  const updated = await updateNewsArticle(article.id, {
    impactedAssets,
    status: "market_matched",
  });

  return updated;
}

// Step 3: Cluster multi-source stories
export async function clusterArticles(
  articles: ProcessedNewsArticle[]
): Promise<NewsCluster[]> {
  const clusters: NewsCluster[] = [];
  const processed = new Set<string>();

  for (const article of articles) {
    if (processed.has(article.id)) continue;

    const clusterHash = await generateClusterHash(article.facts, article.mentionedAssets);

    // Check if cluster already exists
    let cluster = await getNewsClusterByHash(clusterHash);

    if (!cluster) {
      // Create new cluster
      cluster = (await createNewsCluster({
        clusterHash,
        articles: [article],
        leadArticle: article,
        unifiedFact: article.facts[0]?.claim || article.title,
        impactAssets: article.mentionedAssets,
        clusterSize: 1,
        marketContext: {
          priceAction: {},
          correlations: {},
        },
        createdAt: Date.now(),
        eventGenerated: false,
      })) as NewsCluster;
    } else {
      // Add to existing cluster
      cluster.articles.push(article);
      cluster.clusterSize = cluster.articles.length;

      // Update lead article if this one has higher quality
      if (article.qualityScore > cluster.leadArticle.qualityScore) {
        cluster.leadArticle = article;
      }

      cluster = (await updateNewsCluster(cluster.id, cluster)) as NewsCluster;
    }

    // Mark articles as clustered
    if (cluster) {
      await updateNewsArticle(article.id, {
        clusterHash,
        clusterSize: cluster.clusterSize,
        isClusterLead: article.id === cluster.leadArticle.id,
        status: "clustered",
      });
    }

    processed.add(article.id);
    if (cluster) {
      clusters.push(cluster);
    }
  }

  return clusters;
}

// Step 4: Create MarketEvent from news cluster
export async function createEventFromCluster(
  cluster: NewsCluster,
  marketData: Record<string, { price: number; priceChange: number; volume: number }>
): Promise<MarketEvent | null> {
  const leadArticle = cluster.leadArticle;

  // Skip if already generated
  if (cluster.eventGenerated) {
    return getMarketEvent(cluster.articles[0]?.eventId || "");
  }

  // Only create event if quality is high enough
  if (leadArticle.qualityScore < 50) {
    console.log(
      `Skipping event creation: quality score ${leadArticle.qualityScore} < 50`
    );
    return null;
  }

  // Determine primary asset (first impacted asset with largest price move)
  const primaryAsset =
    cluster.impactAssets[0] ||
    (leadArticle.impactedAssets && leadArticle.impactedAssets[0]?.slug) ||
    "market";

  const assetData = marketData[primaryAsset];
  if (!assetData) {
    console.log(`No market data for ${primaryAsset}`);
    return null;
  }

  // Create original analysis from facts, not from article text
  const headline = generateOriginalHeadline(leadArticle, assetData);
  const analysis = generateOriginalAnalysis(cluster);

  const relatedAssets = cluster.impactAssets.filter((asset) => typeof asset === "string" && asset !== primaryAsset) as string[];

  const eventInput: CreateMarketEventInput = {
    assetSlug: primaryAsset,
    assetName: primaryAsset.toUpperCase(),
    assetSymbol: `${primaryAsset.toUpperCase()}-USD`,
    assetType: primaryAsset === "bitcoin" || primaryAsset === "ethereum" ? "crypto" : "stock",
    eventType: "news_event",
    headline,
    priceChange: assetData.priceChange,
    relatedAssets,
    relatedNews: cluster.articles.map((a) => ({
      title: a.title,
      url: a.url,
      source: a.sourceId,
      publishedAt: a.publishedAt,
    })),
  };

  const event = await createMarketEvent(eventInput);

  // Update cluster
  await updateNewsCluster(cluster.id, {
    eventGenerated: true,
  });

  // Mark articles as having generated event
  for (const article of cluster.articles) {
    await updateNewsArticle(article.id, {
      eventId: event.id,
      status: "event_created",
    });
  }

  return event;
}

// Generate original headline (NOT a rewrite of article title)
function generateOriginalHeadline(
  article: ProcessedNewsArticle,
  marketData: { price: number; priceChange: number; volume: number }
): string {
  const direction = marketData.priceChange > 0 ? "rises" : "falls";
  const magnitude = Math.abs(marketData.priceChange).toFixed(1);

  // Extract key fact from verified claims
  const keyFact = article.facts.find(
    (f) => f.confidence === "CONFIRMED" || f.confidence === "REPORTED"
  );

  if (keyFact) {
    return `${article.mentionedAssets[0]?.toUpperCase() || "Market"} ${direction} ${magnitude}% following ${keyFact.claim.substring(0, 40)}...`;
  }

  return `${article.mentionedAssets[0]?.toUpperCase() || "Market"} ${direction} ${magnitude}%`;
}

// Generate original analysis from facts + market context
function generateOriginalAnalysis(cluster: NewsCluster): string {
  const lead = cluster.leadArticle;

  // Build analysis from extracted facts, not article text
  const confirmedFacts = lead.facts
    .filter((f) => f.confidence === "CONFIRMED" || f.confidence === "REPORTED")
    .slice(0, 2);

  const factsSummary = confirmedFacts.map((f) => `• ${f.claim}`).join("\n");

  return (
    `This move is driven by:\n${factsSummary}\n\n` +
    `Sources: ${cluster.articles.map((a) => a.sourceId).join(", ")}\n` +
    `Quality: ${lead.qualityScore}/100 confidence`
  );
}

// Main pipeline orchestration
export async function runNewsIntelligencePipeline(
  articles: NewsSource[],
  marketData: Record<string, { price: number; priceChange: number; volume: number }>
) {
  console.log(`Processing ${articles.length} articles...`);

  const processedArticles: ProcessedNewsArticle[] = [];

  // Step 1: Ingest and extract facts
  for (const article of articles) {
    const processed = await ingestArticle(article);
    if (processed && processed.qualityScore >= 50) {
      processedArticles.push(processed);
    }
  }

  console.log(`Extracted facts from ${processedArticles.length} high-quality articles`);

  // Step 2: Enrich with market data
  for (const article of processedArticles) {
    await enrichWithMarketData(article, marketData);
  }

  // Step 3: Cluster multi-source stories
  const clusters = await clusterArticles(processedArticles);
  console.log(`Clustered into ${clusters.length} unique stories`);

  // Step 4: Generate MarketEvents
  const events: MarketEvent[] = [];
  for (const cluster of clusters) {
    const event = await createEventFromCluster(cluster, marketData);
    if (event) {
      events.push(event);
    }
  }

  console.log(`Generated ${events.length} MarketEvents from news intelligence`);
  return events;
}
