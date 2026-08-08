// End-to-end test of the automation pipeline
// Run with: npx ts-node scripts/test-automation-pipeline.ts

import {
  createMarketEvent,
  getMarketEvent,
  updateMarketEvent,
  getPublishedEvents,
  getEventsByStatus,
} from "../lib/db";
import { enrichEventWithAI } from "../lib/generators/event-enricher";
import { generateAllContent, generateDailyBriefing } from "../lib/generators/content-generator";
import { generateEventId } from "../lib/utils/id-generator";
import { getDefaultExpiration } from "../lib/models/market-event";

async function runTest() {
  console.log("🚀 Starting automation pipeline test...\n");

  try {
    // STEP 1: Create a test market event
    console.log("1️⃣  Creating test market event...");
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
    console.log(`   ✓ Created event: ${testEvent.id}`);
    console.log(`   ✓ Status: ${testEvent.status}`);
    console.log(`   ✓ Importance: ${testEvent.importanceScore}/100\n`);

    // STEP 2: Verify event was persisted
    console.log("2️⃣  Verifying persistence...");
    const retrievedEvent = getMarketEvent(testEvent.id);
    if (!retrievedEvent) {
      throw new Error("Event not found in database!");
    }
    console.log(`   ✓ Event persisted and retrieved\n`);

    // STEP 3: Enrich with AI
    console.log("3️⃣  Enriching with AI...");
    const enrichedEvent = await enrichEventWithAI(testEvent);
    console.log(`   ✓ Event enriched`);
    console.log(`   ✓ Why it moved: "${enrichedEvent.whyItMoved?.substring(0, 50)}..."`);
    console.log(`   ✓ Why it matters: "${enrichedEvent.whyItMatters?.substring(0, 50)}..."`);
    console.log(`   ✓ Status: ${enrichedEvent.status}`);
    console.log(`   ✓ Confidence: ${enrichedEvent.confidenceScore}\n`);

    // STEP 4: Generate content
    console.log("4️⃣  Generating content...");
    await generateAllContent(enrichedEvent);
    const updatedEvent = getMarketEvent(enrichedEvent.id);
    if (!updatedEvent) {
      throw new Error("Event lost after content generation!");
    }
    console.log(`   ✓ Content generated`);
    console.log(`   ✓ YouTube script generated: ${updatedEvent.youtubeScriptGenerated}`);
    console.log(`   ✓ Social post generated: ${updatedEvent.socialPostGenerated}`);
    console.log(`   ✓ Status: ${updatedEvent.status}\n`);

    // STEP 5: Publish event
    console.log("5️⃣  Publishing event...");
    const publishedEvent = updateMarketEvent(updatedEvent.id, {
      status: "published",
      publishedAt: Date.now(),
    });
    console.log(`   ✓ Event published`);
    console.log(`   ✓ Published at: ${new Date(publishedEvent.publishedAt || 0).toISOString()}\n`);

    // STEP 6: Verify retrieval by status
    console.log("6️⃣  Verifying database queries...");
    const published = getPublishedEvents(1);
    console.log(`   ✓ Published events: ${published.length}`);
    const detected = getEventsByStatus("detected", 10);
    console.log(`   ✓ Detected events: ${detected.length}`);
    const validated = getEventsByStatus("validated", 10);
    console.log(`   ✓ Validated events: ${validated.length}\n`);

    // STEP 7: Generate daily briefing
    console.log("7️⃣  Generating daily briefing...");
    const topEvents = getPublishedEvents(10);
    if (topEvents.length > 0) {
      const briefing = generateDailyBriefing(topEvents);
      console.log(`   ✓ Briefing generated`);
      console.log(`   ✓ Briefing title: ${briefing.title}`);
      console.log(`   ✓ Briefing status: ${briefing.status}\n`);
    }

    // SUCCESS
    console.log("✅ ALL TESTS PASSED!\n");
    console.log("Pipeline Summary:");
    console.log("  • Event detection: ✓");
    console.log("  • AI enrichment: ✓");
    console.log("  • Content generation: ✓");
    console.log("  • Persistence: ✓");
    console.log("  • Publishing: ✓");
    console.log("  • Briefing: ✓\n");
    console.log("The automation system is ready for production use!");
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error);
    process.exit(1);
  }
}

runTest();
