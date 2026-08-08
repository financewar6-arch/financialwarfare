// News-Driven War Room Intelligence Generator
// Creates original War Room analysis from news facts + market data
// NOT a rewrite of the news article

import { Anthropic } from "@anthropic-ai/sdk";
import { MarketEvent } from "@/lib/models/market-event";
import { ProcessedNewsArticle } from "@/lib/models/news-article";

const client = new Anthropic();

interface WarRoomIntelligence {
  whyItMoved: string;
  whyItMatters: string;
  risk: string;
  whatToWatch: string;
}

export async function generateNewsWarRoomIntelligence(
  event: MarketEvent,
  articles: ProcessedNewsArticle[]
): Promise<WarRoomIntelligence> {
  if (articles.length === 0) {
    return {
      whyItMoved: "Market moved based on news",
      whyItMatters: "Price action reflects market participants reacting to news",
      risk: "Further moves possible as market digests information",
      whatToWatch: "Volume and price confirmation of the move",
    };
  }

  try {
    // Synthesize facts from all articles in cluster
    const allFacts = articles
      .flatMap((a) =>
        a.facts
          .filter((f) => f.confidence === "CONFIRMED" || f.confidence === "REPORTED")
          .map((f) => `• ${f.claim} (${a.sourceId})`)
      )
      .slice(0, 5); // Top 5 facts

    const prompt = `You are a market analyst. Create ORIGINAL War Room intelligence for traders based on verified facts. Do NOT rewrite the news articles. Focus on:

ASSET: ${event.assetName}
PRICE CHANGE: ${event.priceChange}%
DIRECTION: ${event.priceChange > 0 ? "UP" : "DOWN"}

VERIFIED FACTS FROM NEWS:
${allFacts.join("\n")}

Create ORIGINAL analysis that:
1. WHY IT MOVED: Explain the market mechanism (not a summary of facts)
2. WHY IT MATTERS: What's the trading/investment implication? (not general interest)
3. RISK: What could invalidate this move or hurt traders who went in this direction?
4. WHAT TO WATCH: Specific levels, events, or data points to monitor next

Each section should be 1-2 sentences maximum. Use specific numbers where relevant. DO NOT copy from news.

Respond in JSON:
{
  "whyItMoved": "...",
  "whyItMatters": "...",
  "risk": "...",
  "whatToWatch": "..."
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-1-20250805",
      max_tokens: 1000,
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
      whyItMoved: result.whyItMoved || "",
      whyItMatters: result.whyItMatters || "",
      risk: result.risk || "",
      whatToWatch: result.whatToWatch || "",
    };
  } catch (error) {
    console.error("War Room intelligence generation error:", error);
    // Fallback to basic analysis
    return {
      whyItMoved: generateBasicWhy(event, articles),
      whyItMatters: `${event.assetName} moves typically affect correlated assets and trading strategies.`,
      risk: `Risk reversal if market sentiment shifts or key support/resistance breaks.`,
      whatToWatch: `Monitor volume confirmation and price action at extremes.`,
    };
  }
}

function generateBasicWhy(event: MarketEvent, articles: ProcessedNewsArticle[]): string {
  if (articles.length === 0) {
    return `${event.assetName} ${event.priceChange > 0 ? "rose" : "fell"} ${Math.abs(event.priceChange)}% intraday.`;
  }

  const sources = [...new Set(articles.map((a) => a.sourceId))].join(", ");
  const keyFactCount = articles[0]?.facts.filter((f) => f.confidence === "CONFIRMED").length || 0;

  return (
    `${event.assetName} ${event.priceChange > 0 ? "rose" : "fell"} ${Math.abs(event.priceChange)}% ` +
    `following ${keyFactCount} confirmed market catalysts reported by ${sources}.`
  );
}

// Generate original YouTube script from news-driven event
export function generateNewsYouTubeShort(event: MarketEvent): string {
  const direction = event.priceChange > 0 ? "🔴 BULLISH" : "🟢 BEARISH";
  const magnitude = Math.abs(event.priceChange).toFixed(1);

  return (
    `${direction} ${event.assetName.toUpperCase()}\n\n` +
    `[HOOK - 3 seconds]\n` +
    `"${event.assetName} just moved ${magnitude}% and here's why traders are paying attention..."\n\n` +
    `[WHAT HAPPENED - 8 seconds]\n` +
    `${event.headline}\n\n` +
    `[WHY - 6 seconds]\n` +
    `${event.whyItMoved}\n\n` +
    `[WHY IT MATTERS - 8 seconds]\n` +
    `${event.whyItMatters}\n\n` +
    `[WHAT TO WATCH - 4 seconds]\n` +
    `Key levels: ${event.whatToWatch}\n\n` +
    `[CTA - 1 second]\n` +
    `"See the full analysis in War Room. Link in bio."`
  );
}

// Generate original social media post from news-driven event
export function generateNewsSocialPost(event: MarketEvent): string {
  const emoji = event.priceChange > 0 ? "📈" : "📉";
  const trend = event.priceChange > 0 ? "higher" : "lower";

  return (
    `${emoji} ${event.assetName.toUpperCase()} trading ${trend} on confirmed developments\n\n` +
    `${event.headline}\n\n` +
    `Why it matters: ${event.whyItMatters.substring(0, 80)}...\n\n` +
    `Watch: ${event.whatToWatch.substring(0, 60)}\n\n` +
    `#${event.assetSlug} #${event.assetType === "crypto" ? "Crypto" : "Markets"} #Trading`
  );
}
