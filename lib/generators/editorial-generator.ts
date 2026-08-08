// Generates fresh editorial content for war rooms daily
// Creates original market analysis from price data + news context

import { Anthropic } from "@anthropic-ai/sdk";
import { EditorialContent } from "@/content/types";

const client = new Anthropic();

interface EditorialGenerationContext {
  assetName: string;
  assetSymbol: string;
  priceChange: number;
  category: string; // "Stocks", "Crypto", "Commodities", "Macro"
  recentContext?: string; // Optional news/market context
}

export async function generateEditorialContent(
  context: EditorialGenerationContext
): Promise<EditorialContent> {
  const prompt = `You are an expert market analyst writing War Room intelligence for traders.

Asset: ${context.assetName} (${context.assetSymbol})
Category: ${context.category}
24H Change: ${context.priceChange > 0 ? "+" : ""}${context.priceChange.toFixed(2)}%
${context.recentContext ? `Recent Context: ${context.recentContext}` : ""}

Generate ORIGINAL war room analysis focused on trading mechanics and market implications. Do NOT write marketing copy or general interest content. Each section should be tactical and actionable.

Respond with valid JSON only (no markdown, no extra text):
{
  "photoLabel": "Brief description of visual asset (1-2 words or short phrase)",
  "whyItMoved": "Explain the market mechanism driving this move (1-2 sentences, specific factors)",
  "whyYouShouldCare": "Trading/investment implication for active participants (1-2 sentences, actionable)",
  "risk": "What could reverse this move or hurt traders (1-2 sentences, specific risks)",
  "watchNext": "Specific events, levels, or metrics to monitor (1-2 sentences, concrete items)"
}`;

  try {
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

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      photoLabel: parsed.photoLabel || "Market snapshot",
      whyItMoved: parsed.whyItMoved || "Market reacting to multiple factors",
      whyYouShouldCare:
        parsed.whyYouShouldCare || "Price movement reflects changing market dynamics",
      risk: parsed.risk || "Risk reversal possible with sentiment shift",
      watchNext:
        parsed.watchNext || "Monitor price action and volume confirmation",
    };
  } catch (error) {
    console.error("Editorial content generation error:", error);
    throw error;
  }
}
