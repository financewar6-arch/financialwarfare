# News API Auto-Refresh Setup (Twice Daily)

## ✅ What's Configured

Your news API now automatically updates **twice per day** (every 12 hours):
- News is cached in server memory
- All page loads serve cached news (super fast)
- Cron job automatically refreshes cache every 12 hours
- Fallback to demo news if API fails

---

## 🔧 SETUP STEPS (3 minutes)

### Step 1: Set Admin Token in Render

This token secures the refresh endpoint.

1. Go to **render.com** → Your Service → **Environment**
2. Add new variable:
   - **Key:** `ADMIN_TOKEN`
   - **Value:** `your-super-secret-token-12345` (make up something random)
3. Click **Save**
4. Service auto-redeploys

### Step 2: Create Cron Jobs in Render

Render has a cron service to call your endpoint twice daily.

**Option A: Using Render Cron (Recommended)**

Render doesn't have built-in cron yet, so use an external cron service:

1. Go to **EasyCron.com** (free tier works)
2. Sign up with email
3. Create new cron job:
   - **URL to call:** `https://financialwarfare.onrender.com/api/admin/refresh-news`
   - **Headers:** Add header:
     - Name: `x-admin-token`
     - Value: `your-super-secret-token-12345` (same as above)
   - **Schedule:** Every 12 hours (0 UTC and 12 UTC)
   - **Execution:** Cron Expression: `0 0,12 * * *`

4. Save and activate

**Alternative: Use curl with Uptime Robot**

1. Go to **uptimerobot.com** (free)
2. Create cron/interval monitoring
3. URL: `https://financialwarfare.onrender.com/api/admin/refresh-news`
4. Headers: Add `x-admin-token: your-super-secret-token-12345`
5. Set interval: Every 12 hours

---

## 🧪 TEST IT MANUALLY

### Test the refresh endpoint:

```bash
curl -X POST https://financialwarfare.onrender.com/api/admin/refresh-news \
  -H "x-admin-token: your-super-secret-token-12345"
```

**Expected response:**
```json
{
  "success": true,
  "message": "News cache refreshed successfully",
  "status": {
    "articlesCount": 8,
    "cachedAt": "2026-08-09T10:30:45.123Z",
    "expiresAt": "2026-08-09T22:30:45.123Z",
    "isExpired": false,
    "timeUntilRefresh": 43200000
  }
}
```

### Check cache status anytime:

Visit: `https://yoursite.com/api/news`

Response shows:
- Fresh articles (8 per refresh)
- When last cached
- When it expires
- If it needs refresh

---

## 📊 HOW IT WORKS

```
Morning (6 AM):
  → Cron job calls refresh endpoint
  → News API fetches 8 latest articles
  → Cached in server memory for 12 hours
  → All users see same cached articles (fast!)

Evening (6 PM):
  → Cron job calls refresh endpoint again
  → New articles fetched and cached
  → Users see fresh news

If API fails:
  → Falls back to demo news
  → Users never see "NO SIGNAL"
```

---

## 🚨 TROUBLESHOOTING

### News still old after 12 hours?
- Check EasyCron dashboard - is job running?
- Check Render logs for errors
- Try manual test: `curl` command above

### Getting "Unauthorized" error?
- Admin token doesn't match
- Check Render env var spelling
- Check EasyCron header matches exactly

### News shows demo articles?
- NewsAPI might be down
- Check if NEWSAPI_KEY is set
- Try refresh manually

---

## 📱 MONITOR REFRESH STATUS

### Check status anytime:
```bash
curl https://yoursite.com/api/news | jq '.cache'
```

Output shows:
- `cachedAt`: When articles were last fetched
- `expiresAt`: When they'll refresh
- `timeUntilRefresh`: Seconds until next refresh

---

## 💡 ALTERNATIVE: Daily Refresh Only

If twice daily is too much, change:
- **Schedule:** `0 8 * * *` (8 AM daily)
- Or: `0 9 * * MON-FRI` (weekdays only)

---

## 🔐 SECURITY NOTES

- Keep `ADMIN_TOKEN` secret (like a password)
- Only the refresh endpoint checks this token
- Regular news endpoint is public (no auth needed)
- Consider changing token occasionally

---

## ✅ ONCE SETUP IS DONE

News will:
- ✅ Update automatically twice per day
- ✅ Always show fresh articles
- ✅ Fallback to demo news if API down
- ✅ Be fast (cached, no real-time fetch delay)
- ✅ Display in "Market News" section on home page

---

## 📝 QUICK CHECKLIST

- [ ] Set `ADMIN_TOKEN` in Render environment
- [ ] Create EasyCron account
- [ ] Create cron job with URL and headers
- [ ] Test manually with curl
- [ ] Verify news updates after 12 hours
- [ ] Keep token safe in password manager

Done! Your news is now automatically updated twice daily. 🎉
