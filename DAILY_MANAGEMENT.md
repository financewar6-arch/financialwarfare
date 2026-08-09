# Financial Warfare - Daily Management Guide

## 🎯 QUICK START: 5-MINUTE DAILY CHECK

```
1. Open: https://yoursite.com
2. Check: Bitcoin war room loads with data ✓
3. Check: Gold war room loads ✓
4. Check: News section shows articles ✓
5. Done! Site is healthy
```

---

## 📹 CONTENT CREATION WORKFLOW (2-3x per week)

### Step 1: Gather News (10 min)
- Check financial news sites:
  - CNBC, Reuters, Bloomberg, Yahoo Finance
  - Market movers today
  - Sector trends
  - Breaking news

### Step 2: Write Script with Claude (5 min)
**Prompt to use:**
```
Write me a 60-second market news video script about [TOPIC/NEWS]. 
Make it exciting, professional, and suitable for 16:9 video. 
Include: headline, key details, why it matters, 1-2 fun facts.
Format for voiceover (keep sentences under 10 words).
```

### Step 3: Create Video in CapCut (15-20 min)
1. New project → 16:9 aspect ratio
2. Add background (stock footage, charts, or solid color)
3. Text overlays with your script
4. Background music (royalty-free)
5. Transitions between sections
6. Add your logo/branding
7. Export as MP4 (1080p, H.264)

### Step 4: Upload to Site (2 min)
1. Save video as: `market-news-[date].mp4`
2. Move to: `/public/videos/`
3. Update: `/app/api/shorts/custom/route.ts`
4. Add entry to `customShorts` array:
```typescript
{
  id: "custom-YYYYMMDD",
  title: "Your Video Title",
  videoUrl: "/videos/market-news-YYYYMMDD.mp4",
  duration: 60,
  publishedAt: Date.now(),
  assetSymbol: "BTC", // or "GC" for Gold, etc.
  assetName: "Bitcoin",
}
```
5. Run: `git add -A && git commit -m "Add market news video for [topic]" && git push origin main`
6. Site updates automatically (Render redeploys)

---

## ⚙️ WEEKLY MAINTENANCE (15 min)

### Monday Morning Checklist:
```
□ Check Render logs for errors
  → Go to: render.com → Dashboard → Logs
  
□ Verify all 41 war rooms load
  → Bitcoin, Gold, Apple, Nvidia, Oil, Gas, etc.
  
□ Check API health
  → Binance ✓
  → Yahoo Finance ✓
  → Finnhub ✓
  
□ Review analytics (if added)
  
□ Update any API keys before expiration
  → Finnhub key: 97f5069e61c14610b4ee9ab910b9a9e9
  → Alpha Vantage: FYTQR83WLU2TXK0U
  → NewsAPI: (in Render env)
```

### Settings to Check Monthly:
- NEXTAUTH_SECRET (keep secure)
- NEXTAUTH_URL (should be your domain)
- API key expiration dates

---

## 📊 PERFORMANCE MONITORING

### Signs Something is Wrong:
| Issue | Fix |
|-------|-----|
| War room shows "NO SIGNAL" | Fallback data should show - check logs |
| Videos not playing | Check video file exists in /public/videos |
| Site won't load | Check Render logs (render.com) |
| 502 error | Render crashed - wait 2 min or check logs |
| Sign in not working | Check NEXTAUTH_SECRET is set |

### How to Check Render Logs:
1. Go to render.com
2. Click your service "financial-warfare"
3. Click "Logs"
4. Look for any errors
5. Check deployment status

---

## 🎥 CAPCUT VIDEO TIPS

### Recommended Settings:
- **Duration:** 45-90 seconds (60s ideal)
- **Aspect Ratio:** 16:9 (for web display)
- **Resolution:** 1080p minimum
- **Music:** Royalty-free from Epidemic Sound, Artlist, or YouTube Audio Library
- **Text:** Bold, readable font (min 24pt)
- **Voiceover:** Optional (background music usually better)

### Audio Recommendations:
- Upbeat, professional background music
- Subtle news-style intro/outro sound
- Volume: -18dB for music (doesn't drown audio)

### Branding Elements:
- Add your logo top-right corner
- Use consistent color scheme (gold/amber)
- Title card at start
- "Financial Warfare" watermark at end

---

## 💰 FUTURE ENHANCEMENTS (After Launch)

Once site is live for 2-4 weeks:
1. Add **Google Analytics** (track viewer numbers)
2. Add **email newsletter** (send new videos)
3. Add **Stripe integration** (premium war rooms)
4. Add **YouTube channel** (upload videos there too)
5. Add **comment section** (user engagement)

---

## 🚀 QUICK COMMAND REFERENCE

**Deploy a new video:**
```bash
cd financial-warfare
# Edit app/api/shorts/custom/route.ts (add new video)
git add -A
git commit -m "Add market news video: [title]"
git push origin main
# Site updates in 2-3 minutes
```

**Check if deployment is done:**
```
Go to render.com → your-service → check "Deploy" tab
Status should show "Live" (green checkmark)
```

**Rollback if something breaks:**
```bash
git log --oneline  # See last 5 commits
git revert HEAD    # Undo latest change
git push origin main
```

---

## 📧 MONITORING CHECKLIST

**Daily (2 min):**
- [ ] Site loads ✓
- [ ] Bitcoin war room shows price
- [ ] News section loads

**Weekly (15 min):**
- [ ] Check Render logs
- [ ] Verify no API errors
- [ ] Count video views (if analytics added)

**Monthly (30 min):**
- [ ] Update API keys if needed
- [ ] Review performance metrics
- [ ] Plan next month's videos

---

## 💡 CONTENT IDEAS FOR VIDEOS

**Market Movers:**
- "Bitcoin hits new high"
- "Fed raises/cuts rates"
- "Gold surges on tensions"

**Educational:**
- "Why this stock is moving"
- "Understanding market sentiment"
- "Best assets to watch today"

**News:**
- "Breaking: Oil price shocks"
- "Earnings season roundup"
- "Tech sector rally today"

**Tips:**
- "3 stocks to watch"
- "Best performing assets this week"
- "Market risk alert"

---

## 🎬 YOUR FIRST VIDEO

**Suggested first topic:** "Bitcoin Explained in 60 Seconds"
- Why it matters
- Current price/trend
- What affects it
- Investment note

This establishes your channel style and lets viewers know what to expect.

---

**Questions?** You can always ask me to:
- Write scripts
- Debug issues
- Add new features
- Improve videos

Good luck! 🚀
