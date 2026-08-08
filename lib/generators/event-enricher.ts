// Event enrichment pipeline
// Adds AI-generated content and news to MarketEvents

import { MarketEvent } from "@/lib/models/market-event";
import { updateMarketEvent } from "@/lib/db";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Enrich a detected event with AI-generated explanations
 * Moves event from "detected" → "processing" → "validated"
 */
export async function enrichEventWithAI(event: MarketEvent): Promise<MarketEvent> {
  if (!ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not set, using fallback enrichment");
    return enrichEventFallback(event);
  }

  try {
    const prompt = `
You are a financial market analyst. Provide concise, data-driven explanations for a market move.

Asset: ${event.assetName} (${event.assetSymbol})
Move: ${event.priceChange > 0 ? "UP" : "DOWN"} ${Math.abs(event.priceChange).toFixed(2)}%
Volume: ${event.volumeRatio ? (event.volumeRatio * 100).toFixed(0) : "N/A"}% of normal
Related moves: ${event.relatedAssets.join(", ") || "None detected"}

Generate three short paragraphs (2-3 sentences each):

1. WHY_IT_MOVED: The likely cause of this price movement. Use ONLY observable facts (price action, volume, news context if available). No predictions.

2. WHY_IT_MATTERS: Why traders should care about this move. What does it signal about the asset or broader market?

3. WATCH_NEXT: What key levels, events, or indicators should be monitored. What could cause reversal or continuation?

Keep each to 1-2 sentences. Be specific, not generic.
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", response.status);
      return enrichEventFallback(event);
    }

    const data = (await response.json()) as any;
    const content = data.content[0]?.text || "";

    // Parse response into sections
    const sections = content.split(/\d\.\s+(WHY_IT_MOVED|WHY_IT_MATTERS|WATCH_NEXT):/i);

    return updateMarketEvent(event.id, {
      whyItMoved: sections[2]?.trim().split("\n")[0] || generateDefaultExplanation(event),
      whyItMatters: sections[4]?.trim().split("\n")[0] || "Monitor for further developments.",
      whatToWatch: sections[6]?.trim().split("\n")[0] || "Track support/resistance levels.",
      status: "validated",
      confidenceScore: 85,
    });
  } catch (error) {
    console.error("Event enrichment failed:", error);
    return enrichEventFallback(event);
  }
}

/**
 * Fallback enrichment when AI is unavailable
 * Uses data-driven heuristics only
 */
function enrichEventFallback(event: MarketEvent): MarketEvent {
  return updateMarketEvent(event.id, {
    whyItMoved: generateDefaultExplanation(event),
    whyItMatters: generateDefaultRelevance(event),
    whatToWatch: generateDefaultNextSteps(event),
    status: "validated",
    confidenceScore: 60, // Lower confidence for fallback
  });
}

function generateDefaultExplanation(event: MarketEvent): string {
  const direction = event.priceChange > 0 ? "up" : "down";
  const magnitude = Math.abs(event.priceChange).toFixed(1);

  if (event.volumeRatio && event.volumeRatio > 1.5) {
    return `${event.assetSymbol} moved ${direction} ${magnitude}% with above-average volume, suggesting strong conviction behind the move.`;
  }

  if (Math.abs(event.priceChange) > 5) {
    return `${event.assetSymbol} experienced a significant ${magnitude}% move. Monitor for news or macroeconomic catalysts.`;
  }

  return `${event.assetSymbol} is ${direction} ${magnitude}% today. Track volume and price action for momentum confirmation.`;
}

function generateDefaultRelevance(event: MarketEvent): string {
  const absChange = Math.abs(event.priceChange);

  if (absChange > 10) {
    return "This move is significant and warrants monitoring for potential trend reversal or continuation.";
  }

  if (absChange > 5) {
    return "Notable movement. Watch for follow-through and support/resistance levels.";
  }

  return "Track this asset for patterns and potential breakout signals.";
}

function generateDefaultNextSteps(event: MarketEvent): string {
  if (event.relatedAssets.length > 0) {
    return `Watch ${event.relatedAssets.join(", ")} for correlation signals and sector leadership.`;
  }

  return "Monitor key support and resistance levels for potential reversal or breakout.";
}

/**
 * Validate event has minimum required data
 * Returns true if event can be published
 */
export function validateEvent(event: MarketEvent): boolean {
  // Must have basic data
  if (!event.headline || !event.assetSymbol) return false;

  // Must have enrichment
  if (!event.whyItMoved || !event.whyItMatters) return false;

  // Must have confidence
  if (event.confidenceScore < 50) return false;

  return true;
}
