# Financial Warfare Health Monitor - Setup Instructions

## What Was Fixed

✅ **Enhanced Health Endpoint** (`/api/health`)
- Added authorization via `HEALTH_CHECK_SECRET` bearer token
- Added comprehensive service checks:
  - Database connectivity
  - CoinGecko API
  - Finnhub API
  - Gold API
  - Alpha Vantage API
- Returns detailed latency metrics and service status
- Properly handles 401 (unauthorized), 503 (service unavailable), and 200 (ok) responses

✅ **Updated Render Configuration** (`render.yaml`)
- Added `HEALTH_CHECK_SECRET` environment variable
- Ready for production deployment

✅ **Updated Health Monitor Skill**
- Includes step-by-step deployment guide
- Clear setup instructions for HEALTH_CHECK_SECRET
- Proper error handling and alerting

## Deployment Checklist

### Phase 1: Prepare (5 min)
- [ ] Generate `HEALTH_CHECK_SECRET`: `uuidgen` (Mac/Linux) or `[guid]::NewGuid()` (Windows PowerShell)
- [ ] Gather API keys:
  - [ ] FINNHUB_API_KEY from https://finnhub.io
  - [ ] NEWSAPI_KEY from https://newsapi.org
  - [ ] ALPHA_VANTAGE_API_KEY from https://alphavantage.co
  - [ ] GOLD_API_KEY (optional, public API)
  - [ ] CRON_SECRET (generate another strong random string)

### Phase 2: Deploy to Render (10 min)
- [ ] Push code to GitHub
- [ ] Create Render Web Service from GitHub repository
- [ ] Render auto-creates PostgreSQL database
- [ ] Add all environment variables from Phase 1
- [ ] Wait for deploy to complete (~2 min)

### Phase 3: Test (5 min)
- [ ] Copy your Render app URL: `https://financial-warfare-XXXX.onrender.com`
- [ ] Test health endpoint:
  ```bash
  curl -H "Authorization: Bearer YOUR_HEALTH_CHECK_SECRET" \
    https://financial-warfare-XXXX.onrender.com/api/health
  ```
- [ ] Verify you get a 200 response with service checks

### Phase 4: Update Health Monitor (2 min)
- [ ] Open your Cowork health monitor skill
- [ ] Replace `https://financialwarfare.onrender.com` with your actual Render URL
- [ ] The monitor will start running every 30 minutes
- [ ] First check: ✅ ALL CLEAR or 🚨 SERVICE DOWN (if services fail)

## Expected Health Response

```json
{
  "status": "ok",
  "timestamp": "2026-08-10T14:30:00Z",
  "totalLatencyMs": 2150,
  "checks": {
    "database": {
      "ok": true,
      "latencyMs": 234
    },
    "coingecko": {
      "ok": true,
      "latencyMs": 450
    },
    "finnhub": {
      "ok": true,
      "latencyMs": 612,
      "cached": true
    },
    "goldApi": {
      "ok": true,
      "latencyMs": 521,
      "cached": true
    },
    "alphaVantage": {
      "ok": true,
      "latencyMs": 334,
      "cached": true
    }
  }
}
```

## Monitoring Rules

- ✅ **ALL CLEAR**: Status is "ok" and all services return true → No alert (silent logging only)
- 🚨 **SERVICE DOWN**: Status is "degraded" or services fail → Alert sent immediately
- 🔴 **APP DOWN**: 502/503 errors or connection refused → Critical alert
- ⚠️ **NOT READY**: 404 (not deployed) or 401 (secret missing) → Setup incomplete

## Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Full Deployment Guide**: See `DEPLOYMENT.md` in this repo
- **Health Endpoint Code**: `app/api/health/route.ts`
- **Monitor Skill**: Saved to your Cowork account

## Support

If health checks fail:
1. Check Render logs: Dashboard → Your Service → Logs
2. Verify all environment variables are set
3. Test API keys individually from your local machine
4. Ensure database is initialized: Render auto-runs migrations on deploy
