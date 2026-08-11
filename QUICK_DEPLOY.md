# Financial Warfare - Quick Deployment (30 minutes)

## Step-by-Step Deployment Guide

### STEP 1: Prepare Local Git (5 min)
```bash
cd ~/gemstone/financial-warfare

# Commit the health monitoring changes
git add app/api/health/route.ts render.yaml DEPLOYMENT.md HEALTH_MONITOR_SETUP.md RENDER_ENV_SETUP.txt
git commit -m "feat: Add comprehensive health monitoring endpoint with Render config"

# View remote (should already exist)
git remote -v
```

If no remote exists:
```bash
git remote add origin https://github.com/YOUR_USERNAME/financial-warfare.git
git branch -M main
```

### STEP 2: Push to GitHub (5 min)
```bash
git push -u origin main
```

**⚠️ If you get "fatal: Authentication failed":**
1. Visit: https://github.com/settings/tokens
2. Create new Personal Access Token with `repo` scope
3. Use token instead of password

### STEP 3: Deploy to Render (10 min)

#### 3a. Create Service
1. Go to: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect GitHub account (authorize Anthropic)
5. Select `financial-warfare` repository
6. Leave all defaults, click "Create Web Service"
7. **Wait for auto-deploy to complete** (~2-3 min)

#### 3b. Add Environment Variables
1. Dashboard → `financial-warfare` service → "Environment"
2. Click "Add Environment Variable"
3. Copy & paste each line from `RENDER_ENV_SETUP.txt`:

```
HEALTH_CHECK_SECRET = 5d06f94366bf7918689bf072ce11ebfba43d7cb016b992f262d03bbe3e73c969
CRON_SECRET = 604e5a7d398bfe211f07146983051bb86fb4b506afac37a39092cee705ce6012
FINNHUB_API_KEY = [get from https://finnhub.io]
NEWSAPI_KEY = [get from https://newsapi.org]
ALPHA_VANTAGE_API_KEY = [get from https://alphavantage.co]
NEXT_PUBLIC_API_URL = https://financial-warfare-XXXX.onrender.com
```

4. Replace `XXXX` with your actual Render subdomain (shown in dashboard)
5. Click "Save"
6. **Wait for service to redeploy** (~1-2 min)

#### 3c. Set Up Database
1. Dashboard → `financial-warfare` → "Data"
2. Click "Create Database"
3. Select PostgreSQL
4. Click "Create"
5. Render auto-adds `DATABASE_URL`
6. Service auto-runs migrations on next deploy

### STEP 4: Test Health Endpoint (5 min)

Get your app URL from Render dashboard (e.g., `https://financial-warfare-abc123.onrender.com`)

**Test in Terminal:**
```bash
curl -H "Authorization: Bearer 5d06f94366bf7918689bf072ce11ebfba43d7cb016b992f262d03bbe3e73c969" \
  https://financial-warfare-XXXX.onrender.com/api/health
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-08-10T...",
  "totalLatencyMs": 2150,
  "checks": {
    "database": { "ok": true, "latencyMs": 234 },
    "coingecko": { "ok": true, "latencyMs": 450 },
    "finnhub": { "ok": true, "latencyMs": 612 },
    "goldApi": { "ok": true, "latencyMs": 521 },
    "alphaVantage": { "ok": true, "latencyMs": 334 }
  }
}
```

If you get errors, check:
- **401 Unauthorized**: HEALTH_CHECK_SECRET not set or doesn't match
- **503 Service Unavailable**: Database not initialized or API keys invalid
- **502 Bad Gateway**: Service still deploying (wait 2 min)

### STEP 5: Update Health Monitor (2 min)

In Cowork:
1. Go to Skills → `financial-warfare-health-monitor`
2. Find and replace:
   - `https://financialwarfare.onrender.com` → `https://your-app-name.onrender.com`
3. Save
4. Monitor will run every 30 minutes automatically

---

## Timeline
- ✅ Health endpoint: Already enhanced (ready)
- ✅ Secrets generated: Already done
- ⏳ Git push: 5 min (you do this)
- ⏳ Render deploy: 10 min (Render does this)
- ⏳ Environment vars: 5 min (you do this)
- ⏳ Test: 5 min (you do this)

**Total time: ~30 minutes**

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Deploy fails | Check Render logs → service → Logs. Usually `npm run build` issue |
| Health returns 401 | Set HEALTH_CHECK_SECRET env var in Render |
| Health returns 503 | Check API keys are correct; database may not be initialized |
| Git push fails | Use GitHub Personal Access Token instead of password |
| Can't see Render subdomain | Wait 2 min for deploy to complete, refresh page |

---

## What Just Happened

✅ **Enhanced health endpoint** - `/api/health` now checks 5 services with latency metrics
✅ **Render config ready** - `render.yaml` configured for production
✅ **Secrets generated** - Both HEALTH_CHECK_SECRET and CRON_SECRET ready to use
✅ **Monitoring enabled** - Health monitor skill ready to track service status
✅ **Documentation complete** - Full deployment guides in repo

You're ready to deploy! 🚀
