# Financial Warfare Deployment Guide

## Quick Start: Deploy to Render

### Prerequisites
- GitHub account with your Financial Warfare repo
- Render account (free tier available)
- API keys for external services

### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/financial-warfare.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect your GitHub account and authorize
5. Select the `financial-warfare` repository
6. Use default settings, click "Create Web Service"

Render will automatically detect `render.yaml` and set up your service.

### Step 3: Configure Environment Variables
In Render Dashboard → Your Service → Environment:

Add these variables (get values from your API providers):

| Variable | Required | Example |
|----------|----------|---------|
| `HEALTH_CHECK_SECRET` | Yes | `super-secure-random-uuid-here` |
| `DATABASE_URL` | Yes | Render auto-provides PostgreSQL |
| `FINNHUB_API_KEY` | No | Get from [finnhub.io](https://finnhub.io) |
| `NEWSAPI_KEY` | No | Get from [newsapi.org](https://newsapi.org) |
| `ALPHA_VANTAGE_API_KEY` | No | Get from [alphavantage.co](https://alphavantage.co) |
| `GOLD_API_KEY` | No | Get from [metals.live](https://metals.live) |
| `CRON_SECRET` | Yes | Generate a strong random string |
| `NEXT_PUBLIC_API_URL` | Yes | `https://your-app-name.onrender.com` |
| `SLACK_WEBHOOK_URL` | Optional | Get from Slack (for notifications) |

### Step 4: Add Database (PostgreSQL)
1. Dashboard → Your Service → Data
2. Click "Create Database"
3. Select PostgreSQL
4. Render auto-adds `DATABASE_URL` environment variable
5. Run initial migrations on first deploy

### Step 5: Generate HEALTH_CHECK_SECRET
Generate a strong random string. Use one of these:

**On Mac/Linux:**
```bash
uuidgen
# or
openssl rand -hex 32
```

**On Windows:**
```powershell
[guid]::NewGuid().ToString()
```

Copy the output and paste it into the `HEALTH_CHECK_SECRET` variable in Render.

### Step 6: Deploy
Your app will auto-deploy when you push to `main`. Manual deploy via Render Dashboard → "Manual Deploy".

### Step 7: Test the Health Endpoint
Once deployed, your app URL will be: `https://financial-warfare-XXXX.onrender.com`

Test the health check:
```bash
curl -H "Authorization: Bearer YOUR_HEALTH_CHECK_SECRET" \
  https://financial-warfare-XXXX.onrender.com/api/health
```

Expected response (all services up):
```json
{
  "status": "ok",
  "timestamp": "2026-08-10T14:30:00Z",
  "totalLatencyMs": 2150,
  "checks": {
    "database": { "ok": true, "latencyMs": 234 },
    "coingecko": { "ok": true, "latencyMs": 450 },
    "finnhub": { "ok": true, "latencyMs": 612, "cached": true },
    "goldApi": { "ok": true, "latencyMs": 521, "cached": true },
    "alphaVantage": { "ok": true, "latencyMs": 334, "cached": true }
  }
}
```

## Monitoring

Once deployed, use the Financial Warfare Health Monitor (runs every 30 minutes):
1. Update the monitor with your app URL and secret
2. Monitor will alert automatically on failures

## Troubleshooting

**Deploy fails with "Build failed"**
- Check that `npm run build` works locally: `npm run build`
- Ensure `prisma migrate deploy` succeeds: `npx prisma migrate deploy`
- Check Render logs for specific errors

**Health endpoint returns 401**
- Verify `HEALTH_CHECK_SECRET` is set in Render environment
- Ensure your curl header matches exactly: `Bearer {SECRET}`

**Services showing as down**
- **CoinGecko**: Usually very reliable; check network connectivity
- **Finnhub**: Requires valid API key; check `FINNHUB_API_KEY`
- **Gold API**: Public endpoint; check network
- **Alpha Vantage**: Rate-limited; check API key is valid
- **Database**: If down, app won't start; check Render logs

## Local Development

```bash
# Install dependencies
npm install

# Set up .env.local (copy from .env.example)
cp .env.example .env.local
# Edit .env.local with your local API keys

# Run dev server
npm run dev

# Test health endpoint locally (without auth if HEALTH_CHECK_SECRET not set)
curl http://localhost:3000/api/health
```

## Auto-Scaling & Performance

Render free tier includes:
- 0.5 CPU, 512 MB RAM (auto-suspend after 15 min inactivity)
- Limited to 1 instance

For production traffic:
1. Upgrade to Starter or Pro plan
2. Enable auto-scaling for concurrent requests
3. Monitor resource usage in Render Dashboard

## CI/CD Notes

Render automatically deploys on `main` branch push. For staging:
1. Create a `staging` branch
2. Connect as separate service with different name/secret
3. Pull from staging branch in service settings
