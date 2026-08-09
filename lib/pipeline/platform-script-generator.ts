import type { ProcessedNewsArticle } from "@/lib/models/news-article";

export interface PlatformScript {
  platform: "youtube" | "tiktok" | "instagram" | "linkedin" | "snapchat";
  title: string;
  script: string;
  duration: number; // seconds
  hashtags: string[];
  captions?: string;
  hook: string;
  cta: string;
}

interface ScriptInput {
  asset: {
    name: string;
    symbol: string;
    type: string;
  };
  story: ProcessedNewsArticle;
  priceChange?: number;
  direction?: "up" | "down";
  impact: string;
}

/**
 * Generate YouTube Shorts script (30-45 seconds)
 */
export function generateYouTubeScript(input: ScriptInput): PlatformScript {
  const { asset, story, priceChange, impact } = input;

  const hook = `BREAKING: ${asset.name} ${priceChange && priceChange > 0 ? "surges" : "drops"} as market reacts to ${impact}`;

  const script = `
[0-3s] Hook: ${hook}

[3-15s] What's happening:
${story.description?.substring(0, 150)}...

[15-25s] Why it matters:
This move could signal broader ${asset.type} market sentiment. Investors watching ${asset.symbol} for clues.

[25-30s] What's next:
Key levels to watch: [support/resistance]. Subscribe for daily market moves.

[30s] CTA: Like, subscribe, hit the bell for daily analysis
  `.trim();

  return {
    platform: "youtube",
    title: `${asset.name} ${priceChange && priceChange > 0 ? "Rally" : "Drop"}: Here's Why`,
    script,
    duration: 30,
    hashtags: ["#Markets", `#${asset.symbol}`, "#Trading", "#MarketAnalysis", "#FinancialWarfare"],
    hook,
    cta: "Like, subscribe, hit the bell for daily analysis",
  };
}

/**
 * Generate TikTok script (15-20 seconds) - maximum snappy
 */
export function generateTikTokScript(input: ScriptInput): PlatformScript {
  const { asset, story, priceChange } = input;

  const hook = `${priceChange && priceChange > 0 ? "🚀" : "📉"} ${asset.name} just ${priceChange && priceChange > 0 ? "pumped" : "dumped"}`;

  const script = `
[0-2s] Hook: ${hook} (stare at camera)

[2-8s] Quick facts:
"${story.title}"
Real impact on your portfolio 👇

[8-15s] Why you should care:
${asset.type} moves signal risk appetite. Could mean portfolio shifts ahead.

[15-20s] CTA: Follow for daily market tea ☕📊
  `.trim();

  return {
    platform: "tiktok",
    title: `${asset.name} just ${priceChange && priceChange > 0 ? "pumped 🚀" : "dumped 📉"}`,
    script,
    duration: 15,
    hashtags: ["#MarketNews", "#Stocks", "#Crypto", "#Trading", "#FinancialNews", "#DayTrading"],
    hook,
    cta: "Follow for daily market tea ☕📊",
  };
}

/**
 * Generate Instagram Reels script (30-45 seconds)
 */
export function generateInstagramScript(input: ScriptInput): PlatformScript {
  const { asset, story, priceChange } = input;

  const hook = `Market move you NEED to know about 🎯`;

  const script = `
[0-4s] Hook: ${hook} (text overlay: "${asset.name} Alert")

[4-12s] What happened:
"${story.title.substring(0, 50)}..."
Visual: chart showing price movement

[12-25s] Why it matters:
Impacts: ${story.mentionedAssets?.join(", ") || "Portfolio"}
Risk: ${story.impactedAssets?.map(a => a.direction).join(", ")}

[25-30s] Follow for more:
Daily market insights 📊 Link in bio for full analysis
  `.trim();

  return {
    platform: "instagram",
    title: `${asset.name}: Market move explained in 30 seconds`,
    script,
    duration: 30,
    hashtags: ["#MarketInsights", "#Trading", "#Stocks", "#FinancialNews", "#InvestingTips", "#MarketAnalysis"],
    hook,
    cta: "Link in bio for full analysis",
  };
}

/**
 * Generate LinkedIn script (60+ seconds) - professional tone
 */
export function generateLinkedInScript(input: ScriptInput): PlatformScript {
  const { asset, story, impact } = input;

  const hook = `Significant market development affecting ${asset.type} investors`;

  const script = `
${hook}

Today's headline: ${story.title}

Key details:
• ${story.description?.substring(0, 100)}...
• ${asset.name} momentum reflects broader market sentiment
• Impact on portfolio positioning: ${impact}

Why this matters for investors:
Understanding these movements is critical for:
→ Portfolio rebalancing decisions
→ Risk management positioning
→ Asset allocation strategy

The broader context:
${asset.type} markets are responding to ${impact}. This aligns with our thesis on ${asset.symbol} positioning.

What we're watching:
- Regulatory developments
- Institutional fund flows
- Technical support/resistance levels

#Markets #Investing #FinancialAnalysis #${asset.symbol} #Risk Management #AssetAllocation

Read the full analysis on our platform for institutional-grade insights.
  `.trim();

  return {
    platform: "linkedin",
    title: `Market Alert: ${asset.name} ${impact}`,
    script,
    duration: 60,
    hashtags: ["#Markets", "#Investing", "#FinancialAnalysis", `#${asset.symbol}`, "#AssetAllocation", "#RiskManagement"],
    hook,
    cta: "Read the full analysis on our platform for institutional-grade insights.",
  };
}

/**
 * Generate Snapchat script (10-15 seconds) - ultra-casual
 */
export function generateSnapchatScript(input: ScriptInput): PlatformScript {
  const { asset, story, priceChange } = input;

  const hook = `yo ${priceChange && priceChange > 0 ? "📈" : "📉"} watch this`;

  const script = `
[0-3s] Hook: "${hook}" (Text over chart)

[3-10s] "just dropped:"
${story.title.substring(0, 40)}...

[10-15s] "stay tuned 👀"
(Story link: full breakdown)
  `.trim();

  return {
    platform: "snapchat",
    title: `${asset.name} move`,
    script,
    duration: 10,
    hashtags: ["#Markets", "#News", "#Trading"],
    hook,
    cta: "Story link: full breakdown",
  };
}

/**
 * Generate all platform scripts for a story
 */
export function generateAllPlatformScripts(input: ScriptInput): PlatformScript[] {
  return [
    generateYouTubeScript(input),
    generateTikTokScript(input),
    generateInstagramScript(input),
    generateLinkedInScript(input),
    generateSnapchatScript(input),
  ];
}

/**
 * Format script for display/editing
 */
export function formatScriptForReview(script: PlatformScript): string {
  return `
PLATFORM: ${script.platform.toUpperCase()}
DURATION: ${script.duration}s
TITLE: ${script.title}

HOOK: ${script.hook}

SCRIPT:
${script.script}

CTA: ${script.cta}

HASHTAGS: ${script.hashtags.join(" ")}
  `.trim();
}

/**
 * Convert script to plain text for social posting
 */
export function getScriptPlainText(script: PlatformScript): string {
  const lines = script.script
    .split("\n")
    .filter((line) => !line.match(/\[\d+/)) // Remove timing markers
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^[•\-]\s/, "").trim())
    .join("\n");

  return `${script.title}\n\n${lines}\n\n${script.hashtags.join(" ")}`;
}
