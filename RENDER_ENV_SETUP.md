# 🚀 Render Environment Variables Setup

Add these variables to your Render service to enable live pricing and automation:

## Steps:
1. Go to **Render Dashboard** → Select your **financial-warfare service**
2. Go to **Environment** tab
3. Add these variables:

| Key | Value |
|-----|-------|
| `FINNHUB_API_KEY` | `97f5069e61c14610b4ee9ab910b9a9e9` |
| `NEWSAPI_KEY` | `97f5069e61c14610b4ee9ab910b9a9e9` |
| `GOLD_API_KEY` | `596994ade4b99a951cb019c36eb75be7b9ed04182297ff7a2ba0fcf457715e83` |
| `ALPHA_VANTAGE_API_KEY` | `FYTQR83WLU2TXK0U` |
| `CRON_SECRET` | `(generate: openssl rand -base64 32)` |
| `NEXT_PUBLIC_API_URL` | `https://financialwarfare.onrender.com` |

4. **Redeploy** the service

## What This Enables:
- ✅ Live market prices (hourly via Finnhub)
- ✅ Daily editorial updates
- ✅ News aggregation
- ✅ Gold/precious metals data
- ✅ Stock market technical analysis

**Note:** Once added, war rooms will show real-time prices instead of static mock data.
