# Financial Warfare Automation Engine Setup

## Overview

This document describes the automated financial content and distribution system built into Financial Warfare.

## Architecture

The system operates on a central **MarketEvent** model that represents meaningful market occurrences:

```
Market Data + Prices
        ↓
Event Detection (scoreAsset)
        ↓
MarketEvent (persistent)
        ↓
Multiple Outputs:
├─ War Room updates
├─ The Front Line
├─ SEO pages
├─ YouTube scripts
├─ Social posts
├─ Daily briefings
└─ Analytics
```

## Core Components

### 1. MarketEvent Model (`lib/models/market-event.ts`)

The canonical representation of a market event:

- **Lifecycle**: detected → processing → validated → ready → published → archived
- **Persistence**: Events are stored in SQLite, not ephemeral
- **Deduplication**: Same asset + same event type within 4 hours = same event (auto-updated)
- **Scoring**: 0-100 importance score determines what content gets generated

### 2. Database Layer (`lib/db.ts`)

Lightweight SQLite database using `better-sqlite3`:

- **Tables**:
  - `market_events` - Core event storage
  - `content_assets` - Generated content (YouTube, social, email)
  - `analytics_events` - User interaction tracking

- **Location**: `./financial-warfare.db` (local) or configured via `DATABASE_URL`

- **Operations**:
  ```typescript
  createMarketEvent(input)        // Create or update event
  getRecentEvents(minScore)       // Fetch by importance
  getEventsByStatus(status)       // Fetch by lifecycle state
  archiveStaleEvents()            // Clean up old events
  ```

### 3. Event Detection (`lib/frontline.ts`)

**New functions:**

- `detectAndPersistMarketEvents()` - Main event detection and persistence
  - Polls all assets
  - Scores each by importance
  - Handles deduplication automatically
  - Returns persisted MarketEvents

- `getPersistedMarketEvents(minScore)` - Fetch from database

**Scoring Algorithm:**
- Price component (0-25): Absolute change from baseline
- Volume component (0-15): Current vs 7-day average
- Unexpectedness (0-15): Deviation from recent trend
- Total capped at 100

## API Endpoints

### Event Management

**GET /api/admin/events**
- Query parameters: `status`, `minScore`, `limit`
- Returns: List of market events

Example:
```bash
curl "http://localhost:3000/api/admin/events?status=ready&minScore=60"
```

**POST /api/admin/events/detect**
- Manually trigger event detection
- Returns: Newly detected events

```bash
curl -X POST "http://localhost:3000/api/admin/events/detect"
```

### Health Check

**GET /api/health**
- Verifies database connectivity
- Returns: `{ status: "healthy", database: "ok" }`

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

New dependencies added:
- `better-sqlite3` - SQLite database
- `node-cron` - Job scheduling
- `zod` - Type validation
- `date-fns` - Date utilities
- `slugify` - URL-safe strings

### 2. Database Initialization

The database is automatically initialized on first access. No migration scripts needed.

Database file: `./financial-warfare.db`

### 3. Environment Variables

Add to `.env.local`:

```env
# Existing
FINNHUB_API_KEY=your_key
NEWSAPI_KEY=your_key
ANTHROPIC_API_KEY=your_key

# New (optional)
DATABASE_URL=./financial-warfare.db  # Defaults to this
CRON_SECRET=your-cron-secret         # For scheduled jobs
```

### 4. Install Node Dependencies (Updated)

```bash
npm install node-cron zod date-fns slugify
```

(No SQLite needed - using JSON-based file storage for Windows compatibility)

## How It Works (Current State: PHASES 1-9 Complete)

### PHASE 1-2: Event Detection & Storage ✅

Event detection runs in a pipeline:

1. **Fetch prices** for all ~40 assets
2. **Calculate importance score** (0-100):
   - Price change: 0-25 points
   - Volume: 0-15 points  
   - News: 0-20 points (future)
   - Unexpectedness: 0-15 points
   - Total: capped at 100
3. **Deduplicate**: Same asset + event type within 4 hours = update existing, not create new
4. **Persist to JSON**: Events stored in `.data/market-events.json`

### PHASE 3-4: Enrichment & SEO Pages ✅

Each detected event flows through enrichment and content generation:

1. **AI Enrichment** (`lib/generators/event-enricher.ts`):
   - Claude API call with structured prompt
   - Generates: `whyItMoved`, `whyItMatters`, `whatToWatch`
   - Fallback to deterministic heuristics if API unavailable
   - Event moves to `validated` status

2. **Dynamic SEO Pages** (`app/stocks/[symbol]/why-is-[symbol]-up/page.tsx`):
   - Auto-generated pages only when event importance ≥ 60
   - Full metadata for search indexing
   - Internal links to War Rooms
   - Both "up" and "down" variants built

### PHASE 5-8: Content Generation ✅

Each validated event generates multiple content pieces:

1. **YouTube Short Scripts** (importance ≥ 75):
   - 30-second script format
   - Hook → What Happened → Why → Why It Matters → Watch Next → CTA
   - Stored in content asset model

2. **Social Media Posts** (importance ≥ 60):
   - Twitter-optimized (280 chars)
   - Emoji indicators, hashtags, link
   - Draft status ready for approval

3. **Daily Briefing** (runs once/day):
   - Top 10 events formatted for email
   - Links to full War Rooms
   - Ready for newsletter distribution

### PHASE 9: Automated Scheduling ✅

Three cron pipelines run automatically:

**Detection Pipeline** (`/api/cron/detect`):
- Runs every 5 minutes during market hours
- 1. Detect new events
- 2. Enrich with AI
- 3. Generate content
- 4. Publish ready events
- 5. Archive stale events

**Daily Briefing** (`/api/cron/briefing`):
- Runs 9 AM EST weekdays
- Compiles top 10 events into email format

**Cleanup Pipeline**:
- Runs daily overnight
- Archives events older than 24 hours

Event Lifecycle:
```
detected → (AI enrichment) → validated → (content gen) → ready → (cron) → published → archived
```

### Step 3: Persistence

Events stored in JSON files (no SQLite needed for Windows compatibility):
- `.data/market-events.json` - Main events
- `.data/content-assets.json` - Generated content
- `.data/analytics.json` - User interactions

Persistence means events survive app restarts and can be queried later.

## Future Phases (Not Yet Implemented)

### PHASE 10: Admin Dashboard
- Content approval queue interface
- Event management UI
- Analytics viewing

### PHASE 11: Advanced Analytics
- Click tracking (SEO pages → War Rooms)
- Engagement metrics
- Revenue attribution

### PHASE 12: Monetization Infrastructure
- Ad slot management
- Affiliate link tracking
- Premium alert system

## Testing

### Test Event Detection & Enrichment

```bash
# Trigger detection pipeline (detects + enriches + generates content)
curl -X POST http://localhost:3000/api/admin/events/detect

# View events by lifecycle status
curl "http://localhost:3000/api/admin/events?status=detected"
curl "http://localhost:3000/api/admin/events?status=validated"
curl "http://localhost:3000/api/admin/events?status=ready"
curl "http://localhost:3000/api/admin/events?status=published"

# View high-importance events
curl "http://localhost:3000/api/admin/events?minScore=60&limit=20"
```

### Test SEO Pages

```bash
# Check if dynamic SEO pages are generated
# Visit: http://localhost:3000/stocks/NVDA/why-is-NVDA-up
# Visit: http://localhost:3000/stocks/NVDA/why-is-NVDA-down
```

### Test Manual Cron Execution

```bash
# Trigger detection cron (pass secret in header)
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/detect

# Trigger daily briefing cron
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/briefing
```

### Check System Health

```bash
curl http://localhost:3000/api/health
```

Returns:
```json
{
  "status": "healthy",
  "database": "ok",
  "timestamp": "2026-08-08T..."
}
```

### View Persisted Data

The system stores data in `.data/`:

```bash
# View market events
cat .data/market-events.json

# View generated content assets  
cat .data/content-assets.json

# View analytics
cat .data/analytics.json
```

## Key Principles

1. **One Event, Multiple Outputs**: A single MarketEvent generates War Room updates, SEO pages, YouTube scripts, social posts, and briefings.

2. **Persistent, Not Ephemeral**: Events are stored in the database, not recalculated every 60 seconds.

3. **Automatic Deduplication**: NVDA up 1%, 2%, 3%, 4% doesn't create 4 events. It's one event with updated scores.

4. **Data-Driven, Not AI-Invented**: Events are based on hard data (prices, volume, news). AI enriches, but doesn't invent.

5. **Human Review First**: All generated content goes to a queue for human approval before publication.

## Performance Notes

- SQLite is lightweight and works in serverless environments
- Event detection is O(n) where n = number of assets (~40)
- Database queries use indexes for fast lookups
- In-memory cache is gone; database is the source of truth

## What's Completed

1. ✅ PHASES 1-2: MarketEvent model + JSON persistence
2. ✅ PHASE 3-4: Event enrichment (AI) + SEO pages (dynamic)
3. ✅ PHASE 5-8: Content generators (YouTube, social, briefing)
4. ✅ PHASE 9: Automated scheduling (Vercel Cron integration)
5. → PHASE 10-12: Admin dashboard + analytics + monetization

## Data Schema

Events stored in `.data/market-events.json`:

```json
{
  "event-id-uuid": {
    "id": "...",
    "assetSymbol": "NVDA",
    "assetName": "NVIDIA Corporation",
    "headline": "NVDA jumps on earnings",
    "priceChange": 3.5,
    "volumeRatio": 1.2,
    "importanceScore": 78,
    "confidenceScore": 85,
    "status": "published",
    "whyItMoved": "...",
    "whyItMatters": "...",
    "whatToWatch": "...",
    "youtubeScriptGenerated": true,
    "socialPostGenerated": true,
    "publishedAt": 1691420400000,
    "expiresAt": 1691506800000
  }
}
```

Content stored in `.data/content-assets.json`:

```json
{
  "asset-id-uuid": {
    "id": "...",
    "marketEventId": "event-id-uuid",
    "type": "youtube_short",
    "platform": "youtube",
    "title": "NVDA 📈 | Jumps on earnings",
    "script": "HOOK (0-2s)...",
    "status": "draft",
    "generatedAt": 1691420400000
  }
}
```

## Troubleshooting

### Data directory not found
- The system auto-creates `.data/` directory on first run
- If missing, manually create: `mkdir .data`
- Ensure app has write permissions to project root

### Events not being detected
- Check `/api/health` endpoint for connectivity
- Verify API keys are set in `.env.local`:
  - `FINNHUB_API_KEY` (for price data)
  - `NEWSAPI_KEY` (for news context)
  - `ANTHROPIC_API_KEY` (for AI enrichment)
- Check Next.js console logs for API errors

### Events not enriching
- If AI enrichment fails, falls back to deterministic rules
- Check `ANTHROPIC_API_KEY` is set correctly
- Review Claude API rate limits (uses Opus 5)

### Cron jobs not running
- Verify `CRON_SECRET` is set in `.env.local`
- Check Vercel deployment settings have cron support
- For local testing, manually call endpoints with secret header

### Duplicate events
- Deduplication is automatic (4-hour window, same asset + type)
- If still seeing duplicates, check asset slug consistency
- Review `findRecentEvent()` logic in `lib/db.ts`

## File References

- `lib/models/market-event.ts` - Core event type definition
- `lib/db.ts` - JSON persistence layer (file I/O operations)
- `lib/frontline.ts` - Event detection and scoring
- `lib/generators/event-enricher.ts` - AI enrichment pipeline
- `lib/generators/content-generator.ts` - YouTube/social/email generators
- `lib/scheduler/cron-jobs.ts` - Automation pipeline definitions
- `app/api/admin/events/route.ts` - Event management endpoints
- `app/api/cron/detect/route.ts` - Detection cron trigger
- `app/api/cron/briefing/route.ts` - Daily briefing cron trigger
- `app/api/health/route.ts` - Health check endpoint
- `app/stocks/[symbol]/why-is-[symbol]-up/page.tsx` - SEO page template (up)
- `app/stocks/[symbol]/why-is-[symbol]-down/page.tsx` - SEO page template (down)
- `vercel.json` - Cron job configuration
