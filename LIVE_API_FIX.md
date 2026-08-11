# Live API Price Problems - Fix Guide

## Current Issues

Server logs show 401/404 errors from:
- **Finnhub** (Stock prices) - 401 Unauthorized
- **Gold API** (Precious metals) - 404 Not Found / ENOTFOUND
- **Alpha Vantage** (Stock data) - Likely auth issue

## Root Cause

The API keys in `RENDER_ENV_SETUP.md` are either:
1. ❌ Invalid/fake (test keys)
2. ❌ Not set in Render environment
3. ❌ Rate-limited or expired
4. ❌ Domain restrictions on the keys

## Solution

### Step 1: Get Real API Keys

#### Finnhub (Stock Prices)
1. Go to: https://finnhub.io/dashboard
2. Sign up (free tier: 60 requests/minute)
3. Copy your API key
4. Free tier includes:
   - Real-time quotes
   - Company news
   - Earnings calendar

#### Gold API (Precious Metals)
1. Go to: https://www.gold-api.com/
2. Sign up (free tier: 1000 requests/day)
3. Copy your API key

#### Alpha Vantage (Alternative Stock Data)
1. Go to: https://www.alphavantage.co/
2. Sign up (free tier: 5 requests/minute)
3. Copy your API key

#### News API (Market News)
1. Go to: https://newsapi.org/
2. Sign up (free tier: 100 requests/day)
3. Copy your API key

### Step 2: Update Render Environment

1. Go to **Render Dashboard** → **financial-warfare service**
2. Click **Environment** tab
3. **Delete the old keys** (they're not valid)
4. **Add new environment variables**:

```
FINNHUB_API_KEY=your_real_finnhub_key_here
GOLD_API_KEY=your_real_gold_api_key_here
ALPHA_VANTAGE_API_KEY=your_real_alpha_vantage_key_here
NEWSAPI_KEY=your_real_newsapi_key_here
CRON_SECRET=your_secure_random_string_here
NEXT_PUBLIC_API_URL=https://financialwarfare.onrender.com
```

4. Click **Save**
5. **Render will auto-redeploy** with new keys

### Step 3: Set Locally (Development)

Create `.env.local`:

```env
FINNHUB_API_KEY=your_real_finnhub_key_here
GOLD_API_KEY=your_real_gold_api_key_here
ALPHA_VANTAGE_API_KEY=your_real_alpha_vantage_key_here
NEWSAPI_KEY=your_real_newsapi_key_here
CRON_SECRET=your_secure_random_string_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Then restart dev server:
```bash
npm run dev
```

### Step 4: Verify

Check server logs for:
- ✅ No more 401/404 errors
- ✅ Real price data showing (not mock)
- ✅ Market news loading
- ✅ War room pages displaying live prices

---

## What Each API Provides

| API | Purpose | Tier | Rate Limit |
|-----|---------|------|-----------|
| **Finnhub** | Stock prices, quotes, news | Free | 60/min |
| **Gold API** | Gold & metals prices | Free | 1000/day |
| **Alpha Vantage** | Stock technical analysis | Free | 5/min |
| **News API** | Market news aggregation | Free | 100/day |

---

## Code References

The following files use these API keys:

**Stock Prices:**
- `lib/providers/finnhub.ts` - Uses FINNHUB_API_KEY
- `lib/providers/alpha-vantage.ts` - Uses ALPHA_VANTAGE_API_KEY

**Metals Prices:**
- `lib/providers/goldapi.ts` - Uses GOLD_API_KEY

**News:**
- `app/api/news/route.ts` - Uses NEWSAPI_KEY

---

## Testing Live APIs

### Test Finnhub
```bash
curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY"
```

### Test Gold API
```bash
curl "https://api.gold-api.com/price/gold?currency=USD&api-key=YOUR_KEY"
```

### Test Alpha Vantage
```bash
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY"
```

### Test News API
```bash
curl "https://newsapi.org/v2/everything?q=market&apiKey=YOUR_KEY"
```

---

## After Deployment

1. **Wait 2-3 minutes** for Render to redeploy
2. **Check War Room pages** - prices should be live
3. **Monitor server logs** - no more 401 errors
4. **Check dashboard** - analytics should show API calls

---

## Free Tier Limits

- **Finnhub**: 60 requests/minute (plenty for ~10 assets)
- **Gold API**: 1000/day (sufficient for hourly updates)
- **Alpha Vantage**: 5 requests/minute (use for core assets only)
- **News API**: 100/day (enough for 3-4 news fetches/day)

**Pro Tip**: Use caching to stay within free tier limits!

---

## Troubleshooting

### Still getting 401?
1. Check key is correct (copy-paste carefully)
2. Verify it's in Render Environment (not in code)
3. Restart the deployment

### Still getting 404?
1. URL format might be wrong
2. Check provider's API docs
3. Might need to upgrade to paid tier

### Prices still showing as mock?
1. Check server logs for API errors
2. Verify API key is set
3. Check if rate limit exceeded

---

## Next: Production Readiness

After fixing API keys:
1. ✅ Database setup (PostgreSQL)
2. ✅ Live API keys configured
3. ⬜ Payment integration (Stripe)
4. ⬜ Legal review

You're now on track for launch!
