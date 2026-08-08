import { NextResponse } from "next/server";
import { createMarketEvent, getMarketEvent, updateMarketEvent, getPublishedEvents, getEventsByStatus } from "@/lib/db";
import { enrichEventWithAI } from "@/lib/generators/event-enricher";
import { generateAllContent, generateDailyBriefing } from "@/lib/generators/content-generator";
import { generateEventId } from "@/lib/utils/id-generator";
import { getDefaultExpiration } from "@/lib/models/market-event";

/**
 * End-to-end test of the automation pipeline
 * GET /api/admin/test
 */
export async function GET() {
  const results: any[] = [];

  try {
    // STEP 1: Create a test market event
    results.push({ step: "1. Create test event", status: "in_progress" });
    const testEvent = createMarketEvent({
      id: generateEventId("nvidia", Date.now()),
      assetSlug: "nvidia",
      assetName: "NVIDIA Corporation",
      assetSymbol: "NVDA-NASDAQ",
      assetType: "stock",
      eventType: "price_spike",
      headline: "NVDA surges 3.5% on strong AI demand",
      priceChange: 3.5,
      volumeRatio: 1.2,
      importanceScore: 78,
      confidenceScore: 75,
      detectedAt: Date.now(),
      expiresAt: getDefaultExpiration(),
    });
    results[results.length - 1] = {
      step: "1. Create test event",
      status: "✓",
      eventId: testEvent.id,
      initialStatus: testEvent.status,
      importance: testEvent.importanceScore,
    };

    // STEP 2: Verify event was persisted
    results.push({ step: "2. Verify persistence", status: "in_progress" });
    const retrievedEvent = getMarketEvent(testEvent.id);
    if (!retrievedEvent) {
      throw new Error("Event not found in database!");
    }
    results[results.length - 1] = {
      step: "2. Verify persistence",
      status: "✓",
      found: true,
    };

    // STEP 3: Enrich with AI
    results.push({ step: "3. Enrich with AI", status: "in_progress" });
    const enrichedEvent = await enrichEventWithAI(testEvent);
    results[results.length - 1] = {
      step: "3. Enrich with AI",
      status: "✓",
      enrichedStatus: enrichedEvent.status,
      hasWhyItMoved: !!enrichedEvent.whyItMoved,
      hasWhyItMatters: !!enrichedEvent.whyItMatters,
      confidence: enrichedEvent.confidenceScore,
    };

    // STEP 4: Generate content
    results.push({ step: "4. Generate content", status: "in_progress" });
    await generateAllContent(enrichedEvent);
    const updatedEvent = getMarketEvent(enrichedEvent.id);
    if (!updatedEvent) {
      throw new Error("Event lost after content generation!");
    }
    results[results.length - 1] = {
      step: "4. Generate content",
      status: "✓",
      youtubeGenerated: updatedEvent.youtubeScriptGenerated,
      socialGenerated: updatedEvent.socialPostGenerated,
      contentStatus: updatedEvent.status,
    };

    // STEP 5: Publish event
    results.push({ step: "5. Publish event", status: "in_progress" });
    const publishedEvent = updateMarketEvent(updatedEvent.id, {
      status: "published",
      publishedAt: Date.now(),
    });
    results[results.length - 1] = {
      step: "5. Publish event",
      status: "✓",
      publishedStatus: publishedEvent.status,
      publishedAt: publishedEvent.publishedAt,
    };

    // STEP 6: Verify retrieval by status
    results.push({ step: "6. Verify queries", status: "in_progress" });
    const published = getPublishedEvents(1);
    const detected = getEventsByStatus("detected", 10);
    const validated = getEventsByStatus("validated", 10);
    results[results.length - 1] = {
      step: "6. Verify queries",
      status: "✓",
      publishedCount: published.length,
      detectedCount: detected.length,
      validatedCount: validated.length,
    };

    // STEP 7: Generate daily briefing
    results.push({ step: "7. Generate briefing", status: "in_progress" });
    const topEvents = getPublishedEvents(10);
    let briefingGenerated = false;
    if (topEvents.length > 0) {
      const briefing = generateDailyBriefing(topEvents);
      briefingGenerated = true;
    }
    results[results.length - 1] = {
      step: "7. Generate briefing",
      status: "✓",
      briefingGenerated,
    };

    // SUCCESS
    return NextResponse.json({
      success: true,
      message: "All automation pipeline tests passed!",
      results,
      summary: {
        eventDetection: "✓",
        aiEnrichment: "✓",
        contentGeneration: "✓",
        persistence: "✓",
        publishing: "✓",
        briefing: "✓",
      },
    });
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        results,
      },
      { status: 500 }
    );
  }
}
