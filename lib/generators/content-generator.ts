// Content generation pipeline
// Generates YouTube scripts, social posts, and daily briefings from MarketEvents

import { MarketEvent } from "@/lib/models/market-event";
import { createContentAsset, updateMarketEvent } from "@/lib/db";
import { generateId } from "@/lib/utils/id-generator";

/**
 * Generate YouTube Short script from a MarketEvent
 * Returns a ContentAsset with type "youtube_short"
 */
export async function generateYouTubeShort(event: MarketEvent): Promise<any> {
  if (!event.whyItMoved || !event.whyItMatters) {
    throw new Error("Event must be enriched before generating YouTube script");
  }

  const script = `
HOOK (0-2s):
"${event.assetSymbol} just ${event.priceChange > 0 ? "jumped" : "dropped"} ${Math.abs(event.priceChange).toFixed(1)}%. Here's why."

WHAT HAPPENED (3-7s):
"${event.assetSymbol} moved ${event.priceChange > 0 ? "up" : "down"} ${Math.abs(event.priceChange).toFixed(2)}% today."
${event.volumeRatio ? `"Volume is running at ${(event.volumeRatio * 100).toFixed(0)}% of normal."` : ""}

WHY (8-15s):
"${event.whyItMoved}"

WHY IT MATTERS (16-20s):
"${event.whyItMatters}"

WHAT TO WATCH (21-25s):
"${event.whatToWatch}"

CTA (26-30s):
"For the full breakdown, check the ${event.assetSymbol} War Room. Link in bio."
`.trim();

  const asset = createContentAsset({
    id: generateId(),
    marketEventId: event.id,
    type: "youtube_short",
    platform: "youtube",
    title: `${event.assetSymbol} ${event.priceChange > 0 ? "📈" : "📉"} | ${event.headline}`,
    body: script,
    script,
    status: "draft",
    generatedAt: Date.now(),
    metadata: {
      youtubeLength: 30, // seconds
      youtubeHook: `"${event.assetSymbol} just ${event.priceChange > 0 ? "jumped" : "dropped"} ${Math.abs(event.priceChange).toFixed(1)}%"`,
    },
  });

  // Update event to mark script as generated
  updateMarketEvent(event.id, {
    youtubeScriptGenerated: true,
  });

  return asset;
}

/**
 * Generate social media post from a MarketEvent
 * Returns a ContentAsset with type "social_post"
 */
export async function generateSocialPost(event: MarketEvent): Promise<any> {
  const direction = event.priceChange > 0 ? "📈" : "📉";
  const absChange = Math.abs(event.priceChange).toFixed(2);

  const post = `
${event.assetSymbol} ${direction} ${absChange}%

${event.whyItMoved}

${event.volumeRatio ? `Volume: ${(event.volumeRatio * 100).toFixed(0)}% of avg` : ""}

📊 Full breakdown: Financial Warfare

#Markets #Trading #${event.assetSymbol}
  `.trim();

  // Twitter has 280 char limit, warn if too long
  if (post.length > 280) {
    console.warn(`Social post for ${event.assetSymbol} exceeds Twitter limit (${post.length} chars)`);
  }

  const asset = createContentAsset({
    id: generateId(),
    marketEventId: event.id,
    type: "social_post",
    platform: "twitter",
    title: `${event.assetSymbol} move`,
    body: post,
    status: "draft",
    generatedAt: Date.now(),
  });

  // Update event to mark social as generated
  updateMarketEvent(event.id, {
    socialPostGenerated: true,
  });

  return asset;
}

/**
 * Generate daily market briefing from top events
 * Creates an email-format briefing
 */
export function generateDailyBriefing(topEvents: MarketEvent[]): any {
  const eventsList = topEvents
    .slice(0, 10)
    .map(
      (event, idx) =>
        `
${idx + 1}. ${event.assetSymbol} — ${event.priceChange > 0 ? "UP" : "DOWN"} ${Math.abs(event.priceChange).toFixed(2)}%
   ${event.headline}
   → /war-room/${event.assetSlug}
    `.trim()
    )
    .join("\n\n");

  const briefing = `
TODAY'S MARKET BRIEF
${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}

TOP MOVES:
${eventsList}

---

Get the full intelligence: Financial Warfare
Updated every minute with live market data.
  `.trim();

  return createContentAsset({
    id: generateId(),
    marketEventId: topEvents[0]?.id || "",
    type: "email_brief",
    platform: "email",
    title: `Daily Market Brief - ${new Date().toDateString()}`,
    body: briefing,
    status: "ready", // Briefings are auto-ready, just need approval
    generatedAt: Date.now(),
  });
}

/**
 * Generate all content for an event
 * Creates YouTube, social, and updates to briefing
 */
export async function generateAllContent(event: MarketEvent): Promise<void> {
  // Only generate if event is validated and important enough
  if (event.status !== "validated" && event.importanceScore < 60) {
    return;
  }

  try {
    // Generate YouTube script (importance > 75)
    if (event.importanceScore >= 75) {
      await generateYouTubeShort(event);
      console.log(`✓ Generated YouTube script for ${event.assetSymbol}`);
    }

    // Generate social post (importance > 60)
    if (event.importanceScore >= 60) {
      await generateSocialPost(event);
      console.log(`✓ Generated social post for ${event.assetSymbol}`);
    }

    // Mark as ready for publication
    updateMarketEvent(event.id, {
      status: "ready",
    });

    console.log(`✓ Marked ${event.assetSymbol} as ready for publication`);
  } catch (error) {
    console.error(`Failed to generate content for ${event.assetSymbol}:`, error);
    updateMarketEvent(event.id, {
      status: "validated", // Stay in validated, don't move to ready
    });
  }
}
