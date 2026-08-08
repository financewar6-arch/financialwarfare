# SEO/Discovery Article Pages

Automated article generation from MarketEvents that drives traffic into War Rooms.

## Overview

Discovery pages convert real market events into SEO-optimized articles. They only exist when there's meaningful data backing them — no thin content farm articles.

## Core Principle

**Articles are only created when:**
- MarketEvent has `importanceScore >= 70`
- Real price/volume/news data exists
- It genuinely answers a search query
- It funnels users to the War Room

## Route Structure

Article pages are generated dynamically based on MarketEvents:

```
/stocks/[symbol]/why-is-[symbol]-up
/stocks/[symbol]/why-is-[symbol]-down
/crypto/[symbol]/why-is-[symbol]-up
/crypto/[symbol]/why-is-[symbol]-down
```

Discovery index page:
```
/discovery
```

## Article Structure

Each article includes:

1. **Headline** - "Why is NVDA up today?"
2. **Quick Stat** - +5.8% with context
3. **Why It Moved** - Catalyst explanation (2-3 sentences)
4. **Why It Matters** - Original analysis and implications
5. **Market Context** - Related assets moving similarly
6. **What Traders Are Watching** - Key events/levels to monitor
7. **Sources** - Supporting news articles
8. **CTA** - "Open NVDA War Room →"
9. **Timestamp** - Last updated time

## Implementation Files

### Page Components
- `app/[...slug]/page.tsx` - Dynamic article page renderer
- `app/discovery/page.tsx` - Discovery index (lists all articles)

### API Routes
- `app/api/discovery/article/route.ts` - Fetch single article data
- `app/api/discovery/articles/route.ts` - Fetch all articles
- `app/api/discovery/sitemap/route.ts` - Generate XML sitemap
- `app/api/og/route.ts` - Generate OpenGraph images for sharing

### Utilities
- `lib/seo.ts` - Metadata generation helpers
- `lib/db.ts` - Added `getAllMarketEvents()` function
- `public/robots.txt` - Search engine directives

## Usage

### Accessing an Article

```
GET /stocks/nvda/why-is-nvda-up

Returns ArticleResponse with:
- symbol, name, direction, priceChange
- headline, whyItMoved, whyItMatters
- relatedAssets, whatToWatch, sources
- warRoomUrl, timestamp
```

### Discovering Articles

```
GET /discovery
```

Shows all articles with high importance scores, grouped by gainers/losers.

### Sitemap for Search Engines

```
GET /api/discovery/sitemap
```

Returns XML sitemap with:
- All main pages
- All discovery articles
- All war room pages
- Proper priority and changefreq

### OpenGraph Images

```
GET /api/og?symbol=NVDA&direction=up&change=5.8
```

Generates social-sharing images dynamically.

## Page Lifecycle

```
MarketEvent created
  ↓
importanceScore >= 70?
  ↓ YES
Article auto-generated
  ↓
Search → Article → War Room
  ↓
User clicks CTA
  ↓
War Room conversion
```

## SEO Optimization

Each page includes:

- ✓ Unique `<title>` tags
- ✓ Meta descriptions
- ✓ Canonical URLs
- ✓ OpenGraph metadata
- ✓ Proper heading hierarchy
- ✓ Internal linking strategy
- ✓ Timestamps (essential for news)
- ✓ Mobile responsive
- ✓ No keyword stuffing

## Example Article Paths

```
/stocks/nvda/why-is-nvda-up
  → "Why is NVDA up today? +5.8%"
  
/crypto/btc/why-is-btc-down
  → "Why is BTC down today? -4.2%"
  
/discovery
  → Lists all high-importance market events
```

## Fallback Behavior

- **Symbol not found** → 404 "Asset not in coverage universe"
- **No significant move** → 404 "No movement for this asset"
- **Old article** → Show with flag "Check War Room for latest"

## Analytics Metrics

Track in your analytics tool:
- Article page views (which "Why is X?" pages get traffic)
- Click-through to War Room (conversion)
- Time on page
- Bounce rate
- Search keywords that led to page
- Referral source (organic, social, Front Line, etc.)

**Most important metric:** Article → War Room conversion rate

## What NOT to Do

- ✗ Create articles for every 1% move
- ✗ Write generic stock market tips
- ✗ Duplicate War Room content verbatim
- ✗ Include investment recommendations
- ✗ Claim certainty you don't have
- ✗ Publish without timestamps
- ✗ Create 100 thin pages just for SEO

## Future Enhancements

1. **Pre-rendering** - Cache high-traffic articles as static files
2. **News aggregation** - Pull actual news sources for "Sources" section
3. **Related articles** - Link to other articles about correlated assets
4. **Author bylines** - Add credibility with analyst names
5. **Video embeds** - Embed YouTube Shorts directly in articles
6. **Export formats** - PDF, email reports
7. **Scheduled publishing** - Release articles at specific times

## Integration with MarketEvents

When a MarketEvent is created/updated with `importanceScore >= 70`:

1. Article is automatically discoverable at the dynamic route
2. Sitemap updates to include new article
3. OpenGraph image is generated
4. Internal links point to War Room
5. Analytics track article → War Room conversion

## Testing

```bash
# Test discovery index
curl http://localhost:3000/discovery

# Test single article
curl http://localhost:3000/stocks/nvda/why-is-nvda-up

# Test sitemap
curl http://localhost:3000/api/discovery/sitemap

# Test OpenGraph image
curl http://localhost:3000/api/og?symbol=NVDA&direction=up&change=5.8
```

## Search Engine Submission

1. Add `https://your-domain/api/discovery/sitemap` to Google Search Console
2. Ensure `robots.txt` allows crawling
3. Monitor search impressions in GSC
4. Check Core Web Vitals
5. Build backlinks from Financial Warfare homepage/Twitter
