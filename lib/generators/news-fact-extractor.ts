// News Fact Extraction Pipeline
// Extracts verified facts from articles without copying/paraphrasing
// Uses Claude Opus to identify factual claims with confidence levels

import { Anthropic } from "@anthropic-ai/sdk";
import { ProcessedNewsArticle, ExtractedFact, FactConfidence } from "@/lib/models/news-article";

const client = new Anthropic();

interface FactExtractionResult {
  facts: ExtractedFact[];
  qualityScore: number;
  mentionedAssets: string[];
  shouldCreateEvent: boolean;
  failureReason?: string;
}

export async function extractFactsFromArticle(
  article: {
    title: string;
    description: string;
    url: string;
  },
  knownAssets: string[] // bitcoin, nvda, gold, etc.
): Promise<FactExtractionResult> {
  try {
    const prompt = `You are a financial intelligence analyst. Extract ONLY verified factual claims from this news article. DO NOT paraphrase or copy text. Do NOT include speculation or analysis.

CRITICAL RULES:
1. Extract discrete factual claims ONLY (events that happened, data points, announcements)
2. Each claim must state a FACT, not interpretation
3. Do NOT copy sentences from the article - restate facts in your own words
4. Assign confidence level based on how explicitly stated the fact is:
   - CONFIRMED: Explicitly stated as fact with numbers/dates
   - REPORTED: Stated as someone's report or statement
   - ALLEGED: Claimed but not independently verified
   - EXPECTED: Forecast or guidance
   - SPECULATIVE: Possibility mentioned
5. Identify which specific asset mentions in the article (only from this list: ${knownAssets.join(", ")})
6. Score article quality (0-100): Is this genuinely important market news that warrants War Room coverage?

Article Title: ${article.title}
Article Description: ${article.description}

Respond in this JSON format:
{
  "facts": [
    {
      "claim": "Factual claim here",
      "confidence": "CONFIRMED|REPORTED|ALLEGED|EXPECTED|SPECULATIVE",
      "sources": ["Which part of article supports this"]
    }
  ],
  "qualityScore": 75,
  "mentionedAssets": ["bitcoin", "eth"],
  "shouldCreateEvent": true,
  "analysis": "Why this is or isn't worth a War Room event"
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-1-20250805",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON in response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      facts: result.facts || [],
      qualityScore: result.qualityScore || 0,
      mentionedAssets: result.mentionedAssets || [],
      shouldCreateEvent: result.shouldCreateEvent === true && result.qualityScore >= 50,
    };
  } catch (error) {
    console.error("Fact extraction error:", error);
    return {
      facts: [],
      qualityScore: 0,
      mentionedAssets: [],
      shouldCreateEvent: false,
      failureReason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function extractAssetsFromTitle(
  title: string,
  knownAssets: string[]
): Promise<string[]> {
  // Quick regex match for common tickers and asset names
  const assets: Set<string> = new Set();

  for (const asset of knownAssets) {
    const patterns = [
      new RegExp(`\\b${asset}\\b`, "i"),
      new RegExp(`\\b${asset.toUpperCase()}\\b`),
      // Common aliases
      ...(asset === "bitcoin" ? [/\bBTC\b/i, /\bBitcoin\b/i] : []),
      ...(asset === "ethereum" ? [/\bETH\b/i, /\bEthereum\b/i] : []),
      ...(asset === "gold" ? [/\bGLD\b/i, /\bGold\b/i] : []),
    ];

    if (patterns.some((p) => p.test(title))) {
      assets.add(asset);
    }
  }

  return Array.from(assets);
}

// Generate a hash from article URL for deduplication
export function generateArticleHash(url: string): string {
  // Simple hash for deduplication - in production use crypto.createHash
  return url
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a; // Convert to 32-bit integer
    }, 0)
    .toString(16);
}

// Generate cluster hash - groups multi-source stories about same event
export async function generateClusterHash(
  facts: ExtractedFact[],
  assets: string[]
): Promise<string> {
  if (facts.length === 0) return "";

  // Cluster hash is based on the most important facts + assets
  const keyFacts = facts
    .filter((f) => f.confidence === "CONFIRMED" || f.confidence === "REPORTED")
    .slice(0, 3)
    .map((f) => f.claim)
    .join("|");

  const sortedAssets = assets.sort().join("|");
  const combined = `${keyFacts}:${sortedAssets}`;

  // Simple hash
  return combined
    .split("")
    .reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
    .toString(16);
}
