// News Article Model with Fact Extraction
// News is INPUT, not CONTENT — we extract verified facts and generate original intelligence

export type FactConfidence = "CONFIRMED" | "REPORTED" | "ALLEGED" | "EXPECTED" | "SPECULATIVE";

export interface ExtractedFact {
  claim: string; // The factual claim (not copied from article)
  confidence: FactConfidence;
  sources: string[]; // Which sentences in the article support this
  relatedAssets: string[]; // Bitcoin, NVDA, etc.
}

export interface SourceConfidence {
  sourceId: string; // news source name
  reliabilityScore: number; // 0-100 based on source reputation
  independentVerification: boolean; // confirmed by other sources
}

export interface ProcessedNewsArticle {
  // Identity
  id: string; // UUID
  articleHash: string; // SHA-256 hash of article URL for deduplication
  sourceId: string; // Reuters, Bloomberg, CNBC, etc.

  // Original article data
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: number; // timestamp

  // Fact extraction
  facts: ExtractedFact[];
  qualityScore: number; // 0-100: does this article warrant a MarketEvent?

  // Cross-reference with market data
  mentionedAssets: string[]; // Bitcoin, NVDA, SPY, etc. (extracted)
  impactedAssets?: {
    slug: string;
    direction: "up" | "down" | "mixed";
    confidence: number; // 0-100
  }[];

  // Deduplication & clustering
  clusterHash?: string; // Groups multi-source stories (same event across Reuters/Bloomberg/CNBC)
  clusterSize?: number; // How many articles in this cluster
  isClusterLead?: boolean; // Is this the main article for the cluster

  // Processing lifecycle
  status: "ingested" | "fact_extracted" | "market_matched" | "clustered" | "event_created" | "failed";
  processedAt: number;
  eventId?: string; // Link to generated MarketEvent

  // Error tracking
  failureReason?: string;
  confidenceIssues?: string[]; // Things that couldn't be verified
}

export interface NewsCluster {
  id: string;
  clusterHash: string;
  articles: ProcessedNewsArticle[]; // Multiple sources covering same event
  unifiedFact: string; // What actually happened (synthesized from cluster)
  leadArticle: ProcessedNewsArticle; // Best quality article
  impactAssets: string[]; // Assets affected
  clusterSize?: number; // Number of articles in cluster
  marketContext: {
    priceAction: Record<string, { change: number; volume: number }>;
    correlations: Record<string, number>;
  };
  createdAt: number;
  eventGenerated?: boolean; // Has MarketEvent been created
}
