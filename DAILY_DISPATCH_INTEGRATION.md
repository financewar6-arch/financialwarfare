# Daily Dispatch Integration Guide

## Overview

The **Daily Dispatch** system allows your **Article Rewriter Agent** to automatically post rewritten financial news articles to your website. Articles appear instantly on the `/daily-dispatch` page and in the "Today's Battle Brief" widget on the homepage.

## Architecture

### Components

1. **POST /api/articles** - Receives articles from Article Rewriter agent
2. **GET /api/articles-list** - Fetches articles for display (cached)
3. **/daily-dispatch** - Full archive page (7-day sliding window)
4. **DailyDispatchWidget** - Homepage widget showing latest 3 articles
5. **DailyDispatchCard** - Reusable card component for article display
6. **Prisma ORM** - PostgreSQL storage via DailyDispatchArticle model

### Data Flow

```
Article Rewriter Agent
         ↓
   POST /api/articles (with Bearer token)
         ↓
   Validate & Store in PostgreSQL
         ↓
   Instantly appears on:
   - /daily-dispatch page
   - Homepage widget
   - Navigation link
```

---

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local` (for development) and Render environment settings (for production):

```env
# Daily Dispatch Article Rewriter
WEBSITE_API_TOKEN=fw_article_secret_key_20260811_test
NEXTAUTH_SECRET=your_nextauth_secret_change_this_in_production
```

**Generate a secure token:**
```bash
# Option 1: Use openssl
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Database Migration

If using a local database:

```bash
npx prisma migrate dev --name add_daily_dispatch
```

The migration creates the `DailyDispatchArticle` table with:
- `id` (primary key)
- `headline` (article title)
- `source` (BLOOMBERG, REUTERS, CNBC, FINNHUB, etc.)
- `body` (250-400 word rewrite in "war tone")
- `marketImpact` (impact on markets)
- `tactical` (tactical position/advice)
- `keyNumbers` (array of key metrics)
- `originalUrl` (link to source article)
- `publishedAt` (publication timestamp)
- `createdAt` (record creation timestamp)

**Indexes:**
- `publishedAt` (for sorting, fastest queries)
- `source` (for filtering by news source)

### 3. On Render (Production)

1. **Set environment variables** in Render dashboard:
   - `WEBSITE_API_TOKEN`: Your secure Bearer token
   - `NEXTAUTH_SECRET`: Random 32-character secret
   - `DATABASE_URL`: Already configured

2. **Run migration** (one-time):
   ```bash
   npx prisma migrate deploy
   ```

3. **Deploy**: Push to GitHub main branch, Render auto-deploys

---

## API Endpoint: POST /api/articles

### Request

**URL:** `POST https://yoursite.com/api/articles`

**Headers:**
```
Authorization: Bearer YOUR_WEBSITE_API_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "headline": "Market Alert: Tech Stocks Rally on AI Earnings Beat",
  "source": "FINNHUB",
  "body": "Major technology companies surged in afternoon trading following stronger-than-expected earnings reports. The rally was led by AI-focused firms reporting record revenue and margin expansion. Market analysts point to institutional accumulation as a key driver. Investors should monitor Fed communication for any signals that could impact valuation multiples. The sector's momentum appears sustainable given underlying growth fundamentals.",
  "market_impact": "Positive for growth stocks | Risk to bond markets if rate expectations shift",
  "tactical": "LONG: Quality tech with earnings visibility | AVOID: Highly leveraged growth plays | WATCH: Sector rotation signals",
  "key_numbers": ["$2.3T market cap added", "15% YTD gain", "+250bps beta"],
  "original_url": "https://example.com/article",
  "published_at": "2026-08-11T14:30:00Z"
}
```

### Response

**Success (201 Created):**
```json
{
  "success": true,
  "url": "/daily-dispatch?date=2026-08-11"
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Missing required field: headline"
}
```

**Error (500 Server Error):**
```json
{
  "error": "Failed to post article"
}
```

---

## Testing

### Option 1: Test Endpoint (Development Only)

```bash
curl "http://localhost:3000/api/articles?action=test"
```

This POSTs a sample article to verify the system works.

### Option 2: Manual curl Test

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Authorization: Bearer fw_article_secret_key_20260811_test" \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Gold Prices Surge on Geopolitical Tensions",
    "source": "CNBC",
    "body": "Safe-haven demand pushes precious metals to new highs as global tensions escalate. Gold has broken above key resistance levels. Traders positioning for volatility...",
    "market_impact": "Positive for defensive assets | Negative for equities",
    "tactical": "LONG: Gold futures | HEDGE: Portfolio risk with GLD calls | WATCH: USD strength",
    "key_numbers": ["$2,050/oz", "+3.2% YTD", "VIX 18.5"],
    "original_url": "https://cnbc.com/gold-prices",
    "published_at": "2026-08-11T10:00:00Z"
  }'
```

### Verify Article Appears

1. Visit: `http://localhost:3000/daily-dispatch`
2. Article should appear at the top (sorted by publishedAt DESC)
3. Check homepage at `http://localhost:3000`
4. Widget should show article in "Today's Battle Brief" section

---

## Article Rewriter Agent Integration

### Automatic Daily Posts (8 AM)

Configure your Article Rewriter Agent to POST articles daily at 8 AM:

```yaml
# Example: cron job or scheduled task
schedule: "0 8 * * *"
endpoint: "https://financial-warfare.onrender.com/api/articles"
auth_token: "${WEBSITE_API_TOKEN}"

# Fetch articles from Finnhub + RSS feeds
# Rewrite in "war tone"
# POST to endpoint with Bearer token
```

### Example Agent Code (Node.js)

```javascript
const WEBSITE_API_TOKEN = process.env.WEBSITE_API_TOKEN;
const ENDPOINT = "https://yoursite.com/api/articles";

async function postArticle(article) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WEBSITE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      headline: article.headline,
      source: article.source,
      body: article.rewrittenBody,  // Your 250-400 word rewrite
      market_impact: article.marketImpact,
      tactical: article.tacticalAdvice,
      key_numbers: article.metrics,
      original_url: article.sourceUrl,
      published_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to post article: ${response.status}`);
  }

  return await response.json();
}
```

---

## Frontend Display

### Daily Dispatch Page (/daily-dispatch)

Displays:
- ✅ All articles from past 7 days
- ✅ Sorted by publishedAt (newest first)
- ✅ Full article body (250-400 words)
- ✅ Market Impact highlighted box
- ✅ Tactical Position highlighted box
- ✅ Key Numbers as pills/tags
- ✅ Source badge with color coding
- ✅ Link to original article
- ✅ Publication date/time
- ✅ Statistics: Total briefs, Today's briefs, Last 7 days

### Homepage Widget ("Today's Battle Brief")

Displays:
- ✅ Latest 3 articles as compact cards
- ✅ Headline + source + first 100 words of body
- ✅ "View All Briefs" link to /daily-dispatch
- ✅ Auto-refreshes every 5 minutes
- ✅ Responsive mobile layout

### Navigation

- Added "DAILY DISPATCH" link in main nav (between NEWS and WEEKLY OUTLOOK)
- Shows link to `/daily-dispatch` page

---

## Styling & Theme

All components use the **Financial Warfare design system:**

- **Dark theme** (blacks and dark grays)
- **Gold/amber accents** (#FFD700, #FFE135, #FFC107)
- **Source badges** with color coding:
  - Bloomberg → Amber
  - Reuters → Blue
  - CNBC → Red
  - Finnhub → Green
- **Fonts:**
  - Headers: `var(--font-header)` (aggressive, bold)
  - Body: `var(--font-body)` (readable, professional)
  - Mono: `var(--font-mono)` (tactical, metrics)
- **Responsive:** Mobile-first, works on all devices

---

## Error Handling

### Database Connection Issues

If articles fail to post:
1. Check PostgreSQL connection in `DATABASE_URL`
2. Verify Prisma migrations ran: `npx prisma migrate status`
3. Check Prisma client: `npx prisma generate`

### Authentication Issues

If you see "Unauthorized" errors:
1. Verify Bearer token in Authorization header
2. Ensure `WEBSITE_API_TOKEN` env var is set on Render
3. Check token matches exactly (no extra spaces)

### Validation Errors

If you see "Missing required field" errors:
1. Verify all required fields present in JSON payload
2. Check field names match exactly (case-sensitive):
   - `headline` ✅ (not `title`)
   - `source` ✅ (not `publication`)
   - `body` ✅ (not `content`)
   - `market_impact` ✅ (not `marketImpact`)
   - `original_url` ✅ (not `sourceUrl`)

---

## Monitoring & Logging

### Server Logs (Render)

All article POSTs logged to console:

```
[2026-08-11T14:30:00Z] ✅ Article posted: "Market Alert: Tech Stocks Rally" from FINNHUB
```

### Failed Posts Logged As:

```
[2026-08-11T14:31:00Z] Unauthorized article POST attempt
[2026-08-11T14:32:00Z] Missing required field: headline
[2026-08-11T14:33:00Z] Error posting article: Error details...
```

### Database Queries

Fetch articles list:
```bash
# Development
curl "http://localhost:3000/api/articles-list"

# Production
curl "https://yoursite.com/api/articles-list?limit=10&days=7"
```

Query parameters:
- `limit` (default: 50) - Number of articles to return
- `days` (default: 7) - Days back to fetch articles from

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Articles not appearing | Check Bearer token, verify POST to correct endpoint |
| 500 errors on POST | Check database connection, verify Prisma migrations ran |
| Widget not updating | Verify `/api/articles-list` endpoint returns data |
| Mobile layout broken | Check viewport meta tag in layout.tsx |
| Style colors wrong | Verify `palette` colors match theme in `/lib/warroom/palette.ts` |

---

## Future Enhancements

- [ ] Article search/filter by source
- [ ] Category tagging for articles
- [ ] User watchlist alerts when articles posted
- [ ] Email digest of daily dispatches
- [ ] Article sentiment analysis display
- [ ] Trading volume indicators
- [ ] Pin important articles to homepage

---

## Support

For issues or questions:
1. Check server logs on Render dashboard
2. Verify environment variables set correctly
3. Test with sample curl request
4. Check database connection

---

**Last Updated:** 2026-08-11  
**Version:** 1.0  
**Status:** ✅ Production Ready
