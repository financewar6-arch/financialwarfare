// Cron job definitions
// These run on a schedule to detect events, enrich them, and generate content

import { detectAndPersistMarketEvents } from "@/lib/frontline";
import {
  getEventsByStatus,
  archiveStaleEvents,
  updateMarketEvent,
  getPublishedEvents
} from "@/lib/db";
import { enrichEventWithAI } from "@/lib/generators/event-enricher";
import { generateAllContent, generateDailyBriefing } from "@/lib/generators/content-generator";

/**
 * Main detection + enrichment + content generation pipeline
 * Should run every 1-5 minutes during market hours
 */
export async function runDetectionPipeline(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Starting detection pipeline...`);

  try {
    // STEP 1: Detect new market events
    const detectedEvents = await detectAndPersistMarketEvents();
    console.log(`✓ Detected ${detectedEvents.length} events`);

    // STEP 2: Enrich detected events with AI
    const pendingEvents = getEventsByStatus("detected", 100);
    for (const event of pendingEvents) {
      try {
        await enrichEventWithAI(event);
        console.log(`✓ Enriched ${event.assetSymbol}`);
      } catch (error) {
        console.error(`Failed to enrich ${event.assetSymbol}:`, error);
      }
    }

    // STEP 3: Generate content for validated events
    const validatedEvents = getEventsByStatus("validated", 100);
    for (const event of validatedEvents) {
      try {
        await generateAllContent(event);
        console.log(`✓ Generated content for ${event.assetSymbol}`);
      } catch (error) {
        console.error(`Failed to generate content for ${event.assetSymbol}:`, error);
      }
    }

    // STEP 4: Publish ready events
    const readyEvents = getEventsByStatus("ready", 100);
    for (const event of readyEvents) {
      try {
        updateMarketEvent(event.id, {
          status: "published",
          publishedAt: Date.now(),
        });
        console.log(`✓ Published ${event.assetSymbol}`);
      } catch (error) {
        console.error(`Failed to publish ${event.assetSymbol}:`, error);
      }
    }

    // STEP 5: Archive stale events
    const archived = archiveStaleEvents();
    console.log(`✓ Archived ${archived} stale events`);

    console.log(`[${new Date().toISOString()}] Detection pipeline complete\n`);
  } catch (error) {
    console.error("Detection pipeline failed:", error);
  }
}

/**
 * Daily briefing generator
 * Should run once per day (typically at market open or close)
 */
export async function runDailyBriefingPipeline(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Generating daily briefing...`);

  try {
    const topEvents = getPublishedEvents(20);
    if (topEvents.length === 0) {
      console.log("No events to brief on");
      return;
    }

    const briefing = generateDailyBriefing(topEvents);
    console.log(`✓ Generated daily briefing with ${topEvents.length} events`);
    console.log(`✓ Briefing ready for distribution`);
  } catch (error) {
    console.error("Daily briefing pipeline failed:", error);
  }
}

/**
 * Cleanup jobs - archive old events, remove processed content
 * Should run daily (overnight or off-hours)
 */
export async function runCleanupPipeline(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Running cleanup pipeline...`);

  try {
    const archived = archiveStaleEvents();
    console.log(`✓ Archived ${archived} stale events`);
  } catch (error) {
    console.error("Cleanup pipeline failed:", error);
  }
}
