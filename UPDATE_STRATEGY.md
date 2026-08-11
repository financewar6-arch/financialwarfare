# 📊 Update Strategy: Live Prices vs Daily Analysis

## Architecture: Two-Tier Updates

### Tier 1: LIVE PRICES (Every Hour)
**What Updates**: Prices, volume, market cap, 24H change
**Frequency**: Every hour (or every 4 hours - see options below)
**Source**: Finnhub API
**Cache TTL**: 1 hour
**User sees**: Real-time market data, current price, live charts

```
┌─ 00:00 UTC ─ Fetch & cache prices
├─ 01:00 UTC ─ Update prices
├─ 02:00 UTC ─ Update prices
├─ 03:00 UTC ─ Update prices
├─ 04:00 UTC ─ Update prices
└─ ... (24 times per day)
```

### Tier 2: DAILY EDITORIAL (Once per Day at Market Close)
**What Updates**: "Why It Moved", "Why You Should Care", "Risk", "Watch Next"
**Frequency**: Once daily at 21:00 UTC (5 PM ET - market close)
**Source**: Dynamic generation from market data + news
**Cache TTL**: 24 hours
**User sees**: Fresh analysis, new insights, updated narratives

```
┌─ 21:00 UTC ─ Market close
├─ Analyze today's price action
├─ Generate "Why It Moved" narrative
├─ Calculate risk assessment
├─ Create "Watch Next" guidance
├─ Update news articles
└─ Cache for next 24 hours
```

---

## Implementation

### Live Price Updates
```typescript
// /api/cron/hourly-prices (NEW)
// Runs every hour: 0 * * * *
async function hourlyPriceUpdate() {
  for each asset:
    fetch live price from Finnhub
    update cache
    socket.emit('price-update') → Real-time to clients
}
```

### Daily Editorial Updates
```typescript
// /api/cron/daily-update (EXISTING)
// Runs once daily: 0 21 * * *
async function dailyEditorialUpdate() {
  for each asset:
    fetch daily market snapshot
    generate "Why It Moved" (market-driven)
    calculate risk assessment
    create "Watch Next" guidance
    fetch fresh news
    update all caches
}
```

---

## Frontend: Show Both

### War Room Display
```
┌─ LIVE PRICES (Updated every hour)
│  ├─ Current price: $47,250 ← LIVE
│  ├─ 24H change: +2.15% ← LIVE
│  ├─ Volume: 3.2M shares ← LIVE
│  └─ Market cap: $450B ← LIVE
│
├─ CHARTS (Every hour)
│  ├─ Candlestick data ← LIVE
│  ├─ Moving averages ← LIVE
│  └─ Bollinger Bands ← LIVE
│
└─ DAILY EDITORIAL (Updated at 21:00 UTC)
   ├─ Why It Moved ← DAILY
   ├─ Why You Should Care ← DAILY
   ├─ Risk Assessment ← DAILY
   ├─ Watch Next ← DAILY
   ├─ News Articles ← DAILY
   └─ Last updated: 21:00 UTC yesterday
```

---

## Update Schedule

### Hourly (Live Prices)
```
Runs: 0 * * * * (every hour)
Tasks:
  ├─ Fetch prices (Finnhub)
  ├─ Update chart data
  ├─ Calculate indicators
  ├─ Update homepage
  └─ Broadcast to clients (WebSocket)
Time: ~2 minutes
Cost: ~1.2 Finnhub calls per hour (12/day) ✅ within limits
```

### Daily (Editorial & Analysis)
```
Runs: 0 21 * * * (21:00 UTC / 5 PM ET)
Tasks:
  ├─ Analyze market movements
  ├─ Generate "Why It Moved"
  ├─ Calculate risk scores
  ├─ Create Watch Next guidance
  ├─ Fetch news articles
  ├─ Update all editorials
  ├─ Update luxury assets
  └─ Clear caches
Time: ~5 minutes
Cost: ~0.5 API calls per asset
```

---

## Configuration

### Vercel
```json
{
  "crons": [
    {
      "path": "/api/cron/hourly-prices",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/daily-update",
      "schedule": "0 21 * * *"
    }
  ]
}
```

### Render
```yaml
crons:
  - id: hourly-prices
    command: "curl -X POST /api/cron/hourly-prices"
    schedule: "0 * * * *"
  
  - id: daily-update
    command: "curl -X POST /api/cron/daily-update"
    schedule: "0 21 * * *"
```

---

## Why This Works

| Aspect | Hourly Prices | Daily Editorial |
|--------|---------------|-----------------|
| Freshness | Real-time | Daily insight |
| Cost | Low (1 call/hour) | Minimal |
| Complexity | Simple fetch | Smart generation |
| User need | "What's the price now?" | "Why did it move?" |
| Cache TTL | 1 hour | 24 hours |
| Update time | < 30 seconds | < 5 minutes |

---

## API Rate Limits

**Finnhub Free Tier**: 60 requests/minute

**Our Usage**:
- Hourly price fetch: ~15 requests/day (trivial)
- Daily editorial generation: ~15 requests (trivial)
- **Total**: ~30 requests/day ✅ way under limit

---

## User Experience

### Live Price Updates
User sees:
- ✅ Current price updates every hour
- ✅ Charts refresh with new data
- ✅ Volume/market cap current
- ✅ Instant market feedback

### Daily Editorial
User sees:
- ✅ Fresh "Why It Moved" every day
- ✅ New risk assessments daily
- ✅ Updated "Watch Next" guidance
- ✅ Latest news articles
- ✅ Timestamp: "Last updated 21:00 UTC"

---

## Next Steps

1. Create `/api/cron/hourly-prices` endpoint
2. Update cron configuration (vercel.json or render.yaml)
3. Deploy both crons
4. Test: Prices update hourly, editorials update daily

Result: **Real-time prices + smart daily narratives** ✨

