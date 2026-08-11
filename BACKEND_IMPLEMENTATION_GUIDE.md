# Daily Dispatch Articles — Backend Implementation Guide

## Overview

3 production-ready articles are ready for publication. This guide explains how to get them live on your website with minimal work.

---

## 🚀 Quick Start (5 minutes)

### Option 1: Immediate HTML Share (No Backend Needed)

**Time Required:** 2 minutes

1. Open `DAILY_DISPATCH_ARTICLES_DISPLAY.html` in a web browser
2. Save as PDF or share the link directly
3. Send to users via email or social media
4. ✅ Done — articles are published immediately

**Pros:** No code, no database, instant distribution
**Cons:** One-time manual process, doesn't integrate with website

---

## 📊 Option 2: Database Integration (Recommended)

**Time Required:** 30 minutes (one-time setup)

### Prerequisites

- PostgreSQL database access
- Ability to run SQL scripts
- Prisma ORM configured (already in your repo)

### Step 1: Verify Table Exists

```bash
cd financial-warfare/
npx prisma migrate status

# Should show migration: add_daily_dispatch
# If not run: npx prisma migrate deploy
```

### Step 2: Run SQL Insert Script

```bash
# Connect to your PostgreSQL database
psql -U postgres -d financial_warfare -f DAILY_DISPATCH_DATABASE_INSERTS.sql

# Or paste the SQL directly in your database client (pgAdmin, DBeaver, etc.)
```

### Step 3: Verify Articles Were Created

```bash
# Query the database to confirm
psql -U postgres -d financial_warfare -c \
  "SELECT COUNT(*) FROM \"DailyDispatchArticle\" WHERE \"publishedAt\" >= '2026-08-11'::date;"

# Should return: 3
```

### Step 4: Test the Website

1. Visit: `https://yoursite.com/daily-dispatch`
2. Should see all 3 articles (newest first)
3. Check homepage for "Today's Battle Brief" widget
4. Widget should auto-refresh every 5 minutes

**Pros:** Permanent, integrated, automated refresh
**Cons:** Requires database access, one-time setup

---

## 🔌 Option 3: API Integration (Most Automated)

**Time Required:** 1-2 hours

### Prerequisites

- REST API endpoint that accepts POST requests
- Bearer token authentication configured
- Deployed to production (Render, Vercel, etc.)

### Available Endpoints

#### POST /api/articles

**Purpose:** Submit a Daily Dispatch article

**Request:**
```bash
curl -X POST https://yoursite.com/api/articles \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Article Title",
    "source": "CNBC",
    "body": "Full article text...",
    "market_impact": "Impact analysis",
    "tactical": "Trading guidance",
    "key_numbers": ["$value", "X% metric"],
    "original_url": "https://source.com/article",
    "published_at": "2026-08-11T14:30:00Z"
  }'
```

**Response (Success 201):**
```json
{
  "success": true,
  "url": "/daily-dispatch?date=2026-08-11"
}
```

**Response (Error 401):**
```json
{
  "error": "Unauthorized"
}
```

#### GET /api/articles-list

**Purpose:** Fetch articles for display

**Request:**
```bash
curl "https://yoursite.com/api/articles-list?limit=10&days=7"
```

**Response:**
```json
{
  "articles": [
    {
      "id": "dd_20260811_amazon_3t",
      "headline": "Amazon Conquers $3 Trillion Stronghold",
      "source": "THESTREET",
      "body": "...",
      "marketImpact": "...",
      "tactical": "...",
      "keyNumbers": ["$3T Market Cap", "..."],
      "originalUrl": "https://...",
      "publishedAt": "2026-08-11T14:30:00Z"
    }
  ],
  "count": 1
}
```

### Setup Steps

1. **Ensure API is deployed** to production (Render, AWS, etc.)
2. **Generate API token:**
   ```bash
   openssl rand -base64 32
   # Example: fw_article_secret_key_20260811_test
   ```

3. **Set environment variable:**
   ```bash
   # On Render dashboard or your hosting platform
   WEBSITE_API_TOKEN=fw_article_secret_key_20260811_test
   ```

4. **Test with curl:**
   ```bash
   # Use the test endpoint (development only)
   curl "http://localhost:3000/api/articles?action=test"
   ```

5. **Submit the 3 articles:**
   - Use the JSON data provided in `daily_dispatch_2026_08_11.json`
   - POST to `/api/articles` with Bearer token
   - Articles appear immediately on website

---

## 📋 Article Data Format

### JSON (for API submission)

**File:** `daily_dispatch_2026_08_11.json`

```json
{
  "articles": [
    {
      "headline": "Amazon Conquers $3 Trillion Stronghold",
      "source": "THESTREET",
      "body": "Amazon achieved a historic milestone...",
      "market_impact": "Positive for cloud computing and AI infrastructure plays...",
      "tactical": "LONG: Cloud infrastructure leaders...",
      "key_numbers": ["$3T Market Cap", "42% YoY Growth", "AWS +28% Revenue"],
      "original_url": "https://thestreet.com/news/amazon-3-trillion",
      "published_at": "2026-08-11T14:30:00Z"
    },
    // ... 2 more articles
  ]
}
```

### SQL (for database direct insert)

**File:** `DAILY_DISPATCH_DATABASE_INSERTS.sql`

```sql
INSERT INTO "DailyDispatchArticle" (
  id, headline, source, body, "marketImpact", tactical,
  "keyNumbers", "originalUrl", "publishedAt", "createdAt"
) VALUES (
  'dd_20260811_amazon_3t',
  'Amazon Conquers $3 Trillion Stronghold',
  'THESTREET',
  'Amazon achieved a historic milestone...',
  'Positive for cloud computing...',
  'LONG: Cloud infrastructure leaders...',
  ARRAY['$3T Market Cap', '42% YoY Growth', 'AWS +28% Revenue'],
  'https://thestreet.com/news/amazon-3-trillion',
  '2026-08-11 14:30:00 UTC',
  '2026-08-11 14:30:00 UTC'
);
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Table does not exist" | Run Prisma migration: `npx prisma migrate deploy` |
| "401 Unauthorized" | Check `WEBSITE_API_TOKEN` env var is set correctly |
| "Articles don't appear on website" | Clear browser cache, wait 5 min for widget refresh |
| "Database connection failed" | Verify `DATABASE_URL` is set and PostgreSQL is running |
| "API returns 405 Method Not Allowed" | Ensure code is deployed to production, not just local |

---

## 📊 Verification Checklist

After implementation, verify:

- [ ] `/daily-dispatch` page loads
- [ ] All 3 articles display (sorted newest first)
- [ ] Market Impact sections highlighted
- [ ] Tactical Position sections highlighted
- [ ] Key Numbers display as pills/tags
- [ ] Source badges show correct color
- [ ] Links to original articles work
- [ ] Homepage "Today's Battle Brief" widget shows articles
- [ ] Widget auto-refreshes when articles updated
- [ ] Mobile layout responsive on phones
- [ ] Dark theme colors correct

---

## 🚀 Automation (Optional Next Step)

To automate daily article posting:

1. **Set up a cron job or scheduled task**
   ```bash
   # Daily at 8 AM UTC
   0 8 * * * curl -X POST https://yoursite.com/api/articles \
     -H "Authorization: Bearer $WEBSITE_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d @daily_article.json
   ```

2. **Or use a service like:**
   - GitHub Actions (free)
   - IFTTT
   - Zapier
   - AWS Lambda
   - Render Cron Jobs

3. **Configuration needed:**
   - Source for articles (Finnhub, NewsAPI, RSS feeds)
   - Article rewriting logic (AI-powered or manual)
   - Daily schedule (8 AM recommended)
   - Error notification (Slack, email)

---

## 📞 Support

If you hit blockers:

1. Check the troubleshooting table above
2. Verify environment variables are set
3. Check server logs for errors
4. Ensure Prisma migrations ran
5. Confirm database connection works

---

## Summary

**Quickest Path to Live (Recommended):**

1. SQL Option (Option 2) - 30 minutes
2. Run `DAILY_DISPATCH_DATABASE_INSERTS.sql`
3. Verify on `/daily-dispatch` page
4. Done — articles are live

**Total Time:** ~30 minutes
**Difficulty:** Easy (copy/paste SQL)
**Result:** Permanent, integrated articles on website

---

**Files Provided:**
- `DAILY_DISPATCH_ARTICLES_DISPLAY.html` (immediate share)
- `DAILY_DISPATCH_DATABASE_INSERTS.sql` (database)
- `daily_dispatch_2026_08_11.json` (API format)
- `BACKEND_IMPLEMENTATION_GUIDE.md` (this file)
- `DAILY_DISPATCH_CONTACT_EMAIL.txt` (send to team)

**Next Action:** Pick your option above and follow the steps. Questions? Check the troubleshooting section.
