# Daily Editorial Update System

## Architecture

The War Rooms feature **automated daily editorial updates** to keep market narratives fresh and relevant.

### Components

#### 1. **Editorial Generator** (`lib/pipeline/editorial-generator.ts`)
Generates dynamic editorial content based on real-time market data:
- Analyzes 24H, 7D, 30D price movements
- Detects volatility levels and trend strength
- Generates contextual "Why It Moved" narratives
- Produces risk assessments based on market conditions
- Creates forward-looking "Watch Next" guidance

**Smart Logic:**
- High volatility (>8%) → Risk warning + position management guidance
- Trending moves (7D > 2×24H) → Institutional repositioning narrative
- Normal range → Consolidation analysis + breakout signals

#### 2. **Editorial API** (`app/api/editorial/[asset]/route.ts`)
REST endpoint for fetching dynamic editorial content:
```
GET /api/editorial/palantir
GET /api/editorial/shopify
GET /api/editorial/bitcoin
```

Returns:
```json
{
  "asset": "palantir",
  "editorial": {
    "photoLabel": "...",
    "whyItMoved": "...",
    "whyYouShouldCare": "...",
    "risk": "...",
    "watchNext": "..."
  },
  "updatedAt": "2026-08-10T14:30:00Z",
  "source": "dynamic|static"
}
```

### Daily Update Flow

#### Option 1: Scheduled Background Job (Recommended)
```typescript
// Run daily via cron at market close (5 PM ET)
import { updateAllEditorials } from "@/lib/pipeline/editorial-generator";
import { ASSETS } from "@/lib/assets";

async function dailyEditorialUpdate() {
  // 1. Fetch market snapshots for all assets
  const snapshots = await fetchMarketData();
  
  // 2. Generate dynamic editorials
  const editorials = await updateAllEditorials(snapshots);
  
  // 3. Cache/store in database
  await cacheEditorials(editorials);
}

// Set via: node-cron, AWS Lambda, Vercel Crons, or custom job runner
schedule.scheduleJob("0 21 * * *", dailyEditorialUpdate); // 9 PM UTC = 5 PM ET
```

#### Option 2: Webhook Trigger
External service (market data provider) calls:
```
POST /api/editorial/refresh
```
When significant market moves occur (>5% or breaking news)

#### Option 3: On-Demand Refresh
User/admin triggers:
```
POST /api/editorial/refresh?asset=palantir
```

### Implementation Roadmap

**Phase 1: Static (Current - LIVE)**
- ✅ Hardcoded editorial templates with high-level strategies
- ✅ Fallback mechanism ensures no errors
- ✅ Professional content tier for 10+ assets

**Phase 2: Semi-Dynamic (Next Sprint)**
- Fetch market snapshots from existing data providers
- Update "Why It Moved" based on price action
- Update "Watch Next" with recent support/resistance
- Daily cache refresh at market close

**Phase 3: Full AI-Generated (Future)**
- Integrate with Claude AI API for generation
- NLP analysis of earnings transcripts + news
- Automated risk scoring from SEC filings
- Real-time sentiment tracking from social data

### Data Sources

Current & Planned:

```
Market Data:
├─ Binance (crypto)
├─ Yahoo Finance (fallback OHLC)
├─ Alpha Vantage (indices)
└─ Finnhub (stocks + sentiment)

News & Events:
├─ NewsAPI (global news)
├─ Twitter/X (sentiment)
├─ SEC Edgar (filings)
└─ Earnings calendars

Technical Analysis:
├─ TradingView (chart patterns)
├─ Existing OHLC data
└─ Volume analysis
```

### Configuration

Set daily update time in environment:
```bash
EDITORIAL_UPDATE_TIME="21:00" # UTC = 5 PM ET
EDITORIAL_UPDATE_ENABLED=true
NEWS_API_KEY=xxxx
```

### Monitoring

Track update success:
```
/api/editorial/status
→ Last update: 2026-08-10 21:05 UTC
→ Assets updated: 45/47
→ Failed: palantir (API timeout)
```

## Why This Matters

**Without daily updates:**
- Editorial content becomes stale
- Narratives don't reflect current market
- Users lose trust in analysis

**With daily updates:**
- War Rooms stay relevant and fresh
- Risk warnings adapt to market conditions
- "Watch Next" reflects current technicals
- Platform stays ahead of market narrative

## User Experience

When user visits `/war-room/palantir`:
1. Charts load with live price data
2. Editorial fetched from cache (milliseconds)
3. "Why It Moved" reflects today's action
4. "Watch Next" shows fresh technical levels
5. Last update timestamp displayed: "SYNCED 14:30 UTC"

All without extra latency - cache handles it.

---

**Status**: Infrastructure ready. Awaiting market data API integration for Phase 2 activation.
