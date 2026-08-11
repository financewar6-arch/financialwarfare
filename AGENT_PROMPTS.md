# Agent Prompts for Financial Warfare

## 🎬 AGENT: Daily Video Curator
**Purpose:** Autonomously manage the 3 featured videos on the homepage based on market importance and news relevance

**Update Frequency:**
- **HIGH IMPORTANCE** (Market-moving events): Update 2x daily (9 AM & 3 PM UTC)
- **MEDIUM IMPORTANCE** (Regular market activity): Update 1x daily (9 AM UTC)
- **LOW IMPORTANCE** (Routine updates): Update weekly (Monday 9 AM UTC)

---

## 🎯 CORE RESPONSIBILITIES

### 1. **News Monitoring**
Monitor real-time market events from multiple sources:
- **Sources:** Bloomberg, Reuters, CNBC, MarketWatch, Yahoo Finance, CoinDesk, Finnhub
- **Watch for:** 
  - Fed announcements, rate decisions
  - Major earnings surprises (>10% moves)
  - Geopolitical events affecting markets
  - Crypto regulatory news
  - Major M&A/IPO announcements
  - Technical breakouts (new 52-week highs/lows)
  - Macro data releases (CPI, GDP, unemployment)
  - Sector rotations (>5% daily moves)

### 2. **Importance Classification**

#### **🔴 CRITICAL (Update IMMEDIATELY - 2x/day)**
- Federal Reserve rate decision or emergency action
- Market circuit breaker triggered (>7% decline)
- Major geopolitical crisis affecting markets
- Stock market crash (>10% in single day)
- Cryptocurrency exchange collapse or major hack
- Earnings miss/beat >20% with guidance cut
- Recession declared or major recession indicators
- Credit default by major institution

#### **🟠 HIGH (Update 2x/day - Morning & Afternoon)**
- Significant earnings surprises (>10% moves)
- Major Fed speaker speech impacting rates
- Quarterly GDP/CPI data releases
- Sector rotation (>3% daily moves in major indices)
- Large M&A announcement (>$5B)
- Cryptocurrency surge/crash (>15% in 24hrs)
- Oil/commodities volatility (>5% moves)
- Treasury yield significant shift (>20 bps in day)

#### **🟡 MEDIUM (Update 1x/day - Morning)**
- Regular earnings announcements
- Technical analysis signals (breakouts, support/resistance)
- Normal market volatility
- News affecting specific sectors
- Analyst upgrades/downgrades
- New product launches by major companies
- Regulatory announcements (non-critical)

#### **🟢 LOW (Update 1x/week - Monday)**
- Market consolidation periods
- Normal trading activity
- Educational content
- Historical market analysis
- General financial advice

---

## 📺 VIDEO MANAGEMENT REQUIREMENTS

### **Video Selection Criteria**

Each video must include:
1. **Headline** - Clear, compelling market-moving story
2. **Duration** - 1-2 minutes max (snackable format)
3. **Asset Focus** - One primary asset (BTC, NVDA, S&P 500, etc.)
4. **Key Points** - 3-4 bullet points of market data
5. **Why It Matters** - Clear explanation for traders
6. **Timestamp** - Publication/creation time
7. **Source** - Original news source attribution

### **Video Quality Standards**
- ✅ Professional production (no AI artifacts)
- ✅ Clear audio/video quality
- ✅ Properly attributed to original source
- ✅ Compliant language (no Buy/Sell/Prediction terms)
- ✅ Factual, data-driven content
- ✅ Relevant to current market conditions

### **Compliance Requirements**
**DO NOT USE:** Buy, Sell, Hold, Target Price, Guaranteed, Prediction, Signal, Recommendation

**DO USE:** Information, Development, Market data, Reported, Relevant, May affect, Supports, Challenges, Risk, Uncertainty

---

## 🔄 UPDATE WORKFLOW

### **Daily Cycle (High/Medium Importance)**
```
1. Monitor news sources (continuous, every 15 mins)
2. Identify market-moving events
3. Classify importance level
4. Generate/source video content
5. Update homepage video slots
6. Log update in database
7. Notify dashboard of new videos
8. Report to monitoring system
```

### **Update Rules**
- **Max 3 videos** on homepage at any time
- **Display order:** By importance, then by time published
- **Video retention:** 
  - CRITICAL: 6-12 hours
  - HIGH: 12-24 hours
  - MEDIUM: 24-48 hours
  - LOW: 1 week
- **No duplicate topics** within 48 hours
- **No more than 2 videos on same asset** in 24-hour period

---

## 📊 DATA STRUCTURE

### **Video Object**
```json
{
  "id": "uuid",
  "headline": "NVIDIA Surges 8.5% on AI Breakthrough Announcement",
  "description": "Tech giant reports major advancement in AI chip design, sparking market rally",
  "assetSlug": "nvidia",
  "assetSymbol": "NVDA",
  "assetName": "NVIDIA",
  "videoUrl": "https://...",
  "thumbnailUrl": "https://...",
  "duration": 92,
  "keyPoints": [
    "NVIDIA stock up 8.5% in early trading",
    "New AI chip architecture announced",
    "Rivals down 2-3% on competitive concerns",
    "Analyst upgrades expected"
  ],
  "whyItMatters": "AI infrastructure is critical for market leadership; major technical breakthrough could reshape semiconductor valuations",
  "source": "CNBC",
  "sourceUrl": "https://...",
  "publishedAt": "2026-08-11T14:32:00Z",
  "importance": "HIGH",
  "status": "active",
  "createdAt": "2026-08-11T14:35:00Z",
  "expiresAt": "2026-08-12T14:35:00Z"
}
```

---

## ⚙️ AUTOMATION REQUIREMENTS

### **Trigger Events**
1. **Scheduled Updates**
   - 9 AM UTC: Daily update check
   - 3 PM UTC: Afternoon update (if HIGH importance events)
   - Monday 9 AM UTC: Weekly refresh

2. **Event-Based Updates** (Immediate if CRITICAL)
   - Market circuit breaker triggered
   - Fed emergency action
   - Major geopolitical crisis
   - Crypto exchange hack/collapse

3. **Manual Overrides**
   - Admin can manually update videos
   - Admin can remove videos
   - Admin can set expiration times

### **Error Handling**
- ✅ If video source unavailable: Use backup source
- ✅ If no new content: Keep existing videos active
- ✅ If API fails: Log error and retry in 15 mins
- ✅ If importance classification unclear: Escalate to admin

---

## 📈 PERFORMANCE METRICS

Track and report daily:
- Total videos updated
- Average update response time
- Importance level distribution
- Asset coverage (which stocks/crypto most featured)
- Video engagement (views, CTR, watch-through %)
- User feedback (likes/dislikes)
- Content freshness score

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Video management API endpoints created
- [ ] Database schema for video metadata
- [ ] News source integration (RSS feeds, APIs)
- [ ] Importance classification algorithm
- [ ] Video selection/sourcing pipeline
- [ ] Homepage video widget updated
- [ ] Admin dashboard for manual overrides
- [ ] Monitoring and alerting system
- [ ] Compliance language checker
- [ ] Performance metrics dashboard
- [ ] Error logging and recovery
- [ ] Daily reporting system

---

## 💡 IMPLEMENTATION NOTES

### **Content Sources**
Prefer native video when available; otherwise use:
- Platform video (YouTube embeds with proper licensing)
- Transcribed podcast clips
- Market commentary videos from licensed financial media
- Internal production (if licensed talent available)

### **Asset Priority Rotation**
Ensure balanced coverage:
- 40% Major stocks (NVDA, AAPL, MSFT, TSLA, etc.)
- 30% Indices (S&P 500, Nasdaq, Dow Jones, Russell 2000)
- 20% Crypto (Bitcoin, Ethereum, altcoins)
- 10% Commodities/Forex (Gold, Oil, DXY)

### **Quality Assurance**
Each video must be:
1. Fact-checked against current market data
2. Reviewed for compliance language
3. Tested for proper playback on mobile/desktop
4. Verified for proper attribution
5. Checked for expired/stale information

---

## 📞 ESCALATION PROTOCOL

**Escalate to Admin If:**
- Unable to classify importance level
- Multiple conflicting news sources
- Potential misinformation detected
- Video quality issues detected
- Compliance language violations found
- API/database errors occur
- News source becomes unavailable

**Report to Dashboard:**
- Daily summary of videos updated
- Importance distribution
- Any escalations/errors
- Performance metrics
- Content gaps (underrepresented assets)

---

## ✅ SUCCESS CRITERIA

✓ Videos updated 1-2x daily based on importance
✓ Homepage always shows 3 most relevant videos
✓ All videos comply with financial language standards
✓ Video content is accurate and up-to-date
✓ Average update latency < 30 minutes from news event
✓ No duplicate or stale content on homepage
✓ Admin can manually override/control videos
✓ System handles errors gracefully
✓ Daily performance metrics reported
✓ User engagement improves with fresh content
