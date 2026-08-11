# 🚀 RENDER Deployment Guide

## Quick Start (10 minutes)

### Step 1: Get Free API Keys
```
1. Finnhub: https://finnhub.io/register → Copy API key
2. NewsAPI: https://newsapi.org/register → Copy API key
```

### Step 2: Deploy to Render

1. **Connect Repository**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select branch: main

2. **Configure Service**
   - **Name**: financial-warfare
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for more)

3. **Set Environment Variables**
   - Click "Environment" tab
   - Add these variables:
   ```
   FINNHUB_API_KEY = [your key]
   NEWSAPI_KEY = [your key]
   CRON_SECRET = [generate: openssl rand -base64 32]
   GOLD_API_KEY = 596994ade4b99a951cb019c36eb75be7b9ed04182297ff7a2ba0fcf457715e83
   ALPHA_VANTAGE_API_KEY = FYTQR83WLU2TXK0U
   NODE_ENV = production
   ```

4. **Set Up Cron Job**
   - Click "Cron Jobs" tab
   - Click "Create New Cron Job"
   - **Schedule**: `0 21 * * *` (daily at 21:00 UTC / 5 PM ET)
   - **Command**: `/api/cron/daily-update`
   - **Notification** (optional): Add Slack webhook

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 min)
   - Copy your service URL

---

## Post-Deploy Verification

### 1. Check Service Status
```bash
curl https://your-render-url.onrender.com/api/automation/status
# Should return: {"status": "healthy", ...}
```

### 2. Verify Cron Scheduled
- Render Dashboard → Your Service → "Cron Jobs"
- Should show: "daily-automation" at "0 21 * * *"

### 3. Test Automation (Optional)
```bash
curl -X POST https://your-render-url.onrender.com/api/cron/daily-update \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Important Notes

### Free Plan Limits
- **Compute**: Limited CPU
- **Uptime**: App spins down after 15 min inactivity
- **Cron Jobs**: ✅ Available on free plan
- **Cost**: $0/month

### For Production
Consider Starter Plan ($7/month):
- Keeps app always running
- Better performance
- Recommended for production

### Render URL
Your site will be at: `https://financial-warfare-xxxxx.onrender.com`
Update this in your code as needed

---

## Daily Automation Schedule

Every day at **21:00 UTC** (5 PM ET):
- Fetch live market data (Finnhub)
- Generate dynamic editorials
- Aggregate news (NewsAPI)
- Update war rooms
- Refresh homepage
- Update luxury assets
- Log analytics
- Clear caches

**Zero manual work** ✨

---

## Troubleshooting

### App Won't Start
1. Check build logs in Render dashboard
2. Verify Node/npm versions
3. Check environment variables are set

### Cron Not Running
1. Verify schedule in Cron Jobs tab
2. Check notification logs
3. Test manually with curl

### No Market Data
1. Verify API keys in Environment tab
2. Test Finnhub key: 
   ```bash
   curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY"
   ```

---

## Performance

- **Build time**: 2-3 minutes
- **Deploy time**: < 1 minute
- **Cron execution**: < 5 minutes daily
- **Server response**: < 1 second (when running)

---

**Status**: Ready to Deploy
**Estimated Setup**: 10 minutes
**Monthly Cost**: $0 (free tier with crons)

