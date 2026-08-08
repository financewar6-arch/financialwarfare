import { detectAndScoreEvents } from "@/lib/frontline";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function generateBriefingSummary(topEvents: any[]): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    return generateFallbackBriefing(topEvents);
  }

  try {
    const eventsList = topEvents
      .slice(0, 5)
      .map((e) => `${e.assetName} (${e.assetSymbol}): ${e.headline} — ${e.whyItMatters}`)
      .join("\n");

    const prompt = `You are a financial market briefer. Summarize the top market moves in 2-3 sentences. Be direct and actionable.

Top Events:
${eventsList}

Write a brief that tells traders: (1) What just happened, (2) Why it matters, (3) What to watch. Keep it under 100 words.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-5",
        max_tokens: 150,
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
      return generateFallbackBriefing(topEvents);
    }

    const data = await response.json();
    return data.content[0]?.text || generateFallbackBriefing(topEvents);
  } catch (error) {
    console.error("Briefing generation error:", error);
    return generateFallbackBriefing(topEvents);
  }
}

function generateFallbackBriefing(topEvents: any[]): string {
  if (topEvents.length === 0) {
    return "Markets steady. No significant moves detected.";
  }

  const top = topEvents[0];
  return `${top.assetName} ${top.priceChange >= 0 ? "up" : "down"} ${Math.abs(top.priceChange).toFixed(2)}% — ${top.whyItMatters}`;
}

export async function GET() {
  try {
    const events = await detectAndScoreEvents();
    const topEvents = events.slice(0, 5);
    const summary = await generateBriefingSummary(topEvents);

    return Response.json({
      briefing: {
        summary,
        topEvents,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Briefing API error:", error);
    return Response.json(
      { briefing: { summary: "Unable to generate briefing.", topEvents: [], timestamp: Date.now() }, error: "Briefing unavailable" },
      { status: 502 }
    );
  }
}
