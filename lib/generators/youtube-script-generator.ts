// YouTube Shorts Script Generator
// Converts MarketEvent to 30-60 second shorts script
// Data-driven, no hallucinations. Facts from MarketEvent only.

import { MarketEvent } from "../models/market-event";
import { VideoScript } from "../models/video-content";
import { v4 as uuidv4 } from "uuid";

interface ScriptContext {
  event: MarketEvent;
  includeVolume?: boolean;
  template?: "market_moves" | "price_action" | "breaking_news";
}

export async function generateYoutubeScript(context: ScriptContext): Promise<VideoScript> {
  const { event, template = "market_moves" } = context;

  // Hook: Grab attention with the move
  const hook = generateHook(event);

  // What: Event headline
  const what = generateWhat(event);

  // Why: Catalyst from market event data
  const why = event.whyItMoved || "Market reaction to company developments";

  // Significance: Why traders care
  const significance = event.whyItMatters || "This signals a shift in investor sentiment";

  // Watch Next: Technical levels or upcoming events
  const watchNext = generateWatchNext(event);

  // CTA: Drive to War Room
  const cta = `For the full breakdown, check the ${event.assetName} War Room`;

  // Assemble full script (60-90 words, ~45 seconds spoken)
  const fullScript = assembleScript({
    hook,
    what,
    why,
    significance,
    watchNext,
    cta,
  });

  // Estimate duration (average 150 words/min = 2.5 words/sec)
  const wordCount = fullScript.split(" ").length;
  const durationSeconds = Math.ceil((wordCount / 150) * 60);

  // Check for red flags
  const { hasUnsubstantiatedClaims, hasPricePredictions, flaggedIssues } = validateScriptContent(
    event,
    fullScript
  );

  return {
    id: uuidv4(),
    marketEventId: event.id,
    hook,
    what,
    why,
    significance,
    watchNext,
    cta,
    fullScript,
    durationSeconds,
    hasUnsubstantiatedClaims,
    hasPricePredictions,
    flaggedIssues,
    generatedAt: Date.now(),
    validatedAt: null,
  };
}

function generateHook(event: MarketEvent): string {
  const direction = event.priceChange >= 0 ? "up" : "down";
  const emoji = event.priceChange >= 0 ? "📈" : "📉";

  // Hook format: "Asset just moved X%. Here's what's driving it."
  return `${emoji} ${event.assetName} just ${direction} ${Math.abs(event.priceChange).toFixed(1)}%. Here's what's driving the move.`;
}

function generateWhat(event: MarketEvent): string {
  // Use headline + add volume context if available
  let what = event.headline;

  if (event.volumeRatio && event.volumeRatio > 1.5) {
    what += ` And volume is running at ${Math.round(event.volumeRatio)}x normal.`;
  }

  return what;
}

function generateWatchNext(event: MarketEvent): string {
  // Use whatToWatch field if available, otherwise generate from price data
  if (event.whatToWatch) {
    return event.whatToWatch;
  }

  // Generate from technical levels
  const levels = generateTechnicalLevels(event);
  if (levels) {
    return `The next thing we're watching is ${levels}.`;
  }

  return "Keep an eye on volume and momentum shifts.";
}

function generateTechnicalLevels(event: MarketEvent): string | null {
  const { highPrice, lowPrice, priceChange } = event;

  if (!highPrice || !lowPrice) return null;

  const direction = priceChange >= 0 ? "break above" : "break below";
  const level = priceChange >= 0 ? highPrice : lowPrice;

  return `a ${direction} $${level.toFixed(2)}`;
}

function assembleScript(parts: {
  hook: string;
  what: string;
  why: string;
  significance: string;
  watchNext: string;
  cta: string;
}): string {
  return `${parts.hook}

${parts.what}

The catalyst is ${parts.why}.

${parts.significance}

${parts.watchNext}

${parts.cta}`;
}

function validateScriptContent(
  event: MarketEvent,
  script: string
): { hasUnsubstantiatedClaims: boolean; hasPricePredictions: boolean; flaggedIssues: string[] } {
  const flaggedIssues: string[] = [];
  let hasUnsubstantiatedClaims = false;
  let hasPricePredictions = false;

  // Check for prediction language
  const predictionPatterns = [
    /will (rise|fall|jump|drop|surge|crater)/i,
    /expected to/i,
    /forecast/i,
    /target.*price/i,
    /going to.*\$/i,
  ];

  for (const pattern of predictionPatterns) {
    if (pattern.test(script)) {
      hasPricePredictions = true;
      flaggedIssues.push("Contains price predictions (avoid 'will rise', 'target price', etc.)");
      break;
    }
  }

  // Check for vague claims without sources
  if (
    (script.includes("they say") || script.includes("sources say") || script.includes("some analysts")) &&
    !event.relatedNews.length
  ) {
    hasUnsubstantiatedClaims = true;
    flaggedIssues.push("Vague sourcing ('they say') without news references");
  }

  // Check if script is too long (>90 seconds estimated)
  const wordCount = script.split(" ").length;
  if (wordCount > 240) {
    flaggedIssues.push("Script may be too long (240+ words = 90+ seconds)");
  }

  // Check if script is too short (<20 seconds estimated)
  if (wordCount < 80) {
    flaggedIssues.push("Script may be too short (80- words = <30 seconds)");
  }

  return { hasUnsubstantiatedClaims, hasPricePredictions, flaggedIssues };
}

// Example usage:
/*
const marketEvent: MarketEvent = {
  id: "evt_123",
  assetSlug: "nvidia",
  assetName: "NVIDIA",
  assetSymbol: "NVDA",
  assetType: "stock",
  eventType: "news_event",
  headline: "NVIDIA announces AI breakthrough in chip design",
  summary: "...",
  whyItMoved: "Market reacting to AI chip announcement",
  whyItMatters: "NVDA dominates AI infrastructure market",
  risk: "Custom silicon threat from competitors",
  whatToWatch: "breakout above $120 resistance",
  importanceScore: 85,
  confidenceScore: 90,
  priceChange: 5.8,
  priceChangedAt: Date.now(),
  volumeRatio: 3.2,
  highPrice: 119.50,
  lowPrice: 112.00,
  relatedAssets: [],
  relatedNews: [],
  sourceEvents: [],
  status: "ready",
  seoPageExists: false,
  seoPagePath: null,
  youtubeScriptGenerated: false,
  socialPostGenerated: false,
  emailIncluded: false,
  detectedAt: Date.now(),
  enrichedAt: Date.now(),
  publishedAt: null,
  archivedAt: null,
  updatedAt: Date.now(),
  expiresAt: Date.now() + 24 * 3600 * 1000,
};

const script = await generateYoutubeScript({ event: marketEvent });
console.log(script.fullScript);
*/
