# News Intelligence Engine — Original Market Analysis from News + Market Data

**CRITICAL PRINCIPLE:** News is INPUT, not CONTENT. We extract verified facts from articles and combine them with proprietary market data to generate ORIGINAL intelligence that NO OTHER PLATFORM produces.

We do NOT copy, paraphrase, or rewrite news articles. We extract facts and analyze them.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       NEWS INTELLIGENCE PIPELINE                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ↓                         ↓
            ┌──────────────┐        ┌──────────────┐
            │  NewsAPI     │        │  NewsAPI     │
            │  Finance     │        │  Crypto      │
            └──────────────┘        └──────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 ↓
                    ┌────────────────────────┐
                    │  FACT EXTRACTION       │
                    │  (Claude Opus)         │
                    │                        │
                    │ Extract verified facts │
                    │ with confidence levels │
                    │ (CONFIRMED/REPORTED/   │
                    │  ALLEGED/EXPECTED/     │
                    │  SPECULATIVE)          │
                    │                        │
                    │ Quality score (0-100)  │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │  Skip if score < 50     │
                    └────────────┴────────────┘
                                 ↓
                    ┌────────────────────────┐
                    │  MARKET DATA MATCHING  │
                    │                        │
                    │ Cross-check facts with │
                    │ • Current prices       │
                    │ • Volume               │
                    │ • Related assets       │
                    │ • Sector correlations  │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │  STORY CLUSTERING      │
                    │                        │
                    │ Group multi-source     │
                    │ stories (Reuters +     │
                    │ Bloomberg + CNBC =     │
                    │ one event)             │
                    │                        │
                    │ Dedup via clusterHash  │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │  CREATE MARKET EVENT   │
                    │                        │
                    │ Generate original      │
                    │ War Room analysis      │
                    │ (NOT rewrite of news)  │
                    └────────────────────────┘
                                 │
        ┌───────────┬────────────┼────────────┬───────────┐
        ↓           ↓            ↓            ↓           ↓
    ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
    │War Room │ │Front Line│ │YouTube │ │  Social │ │   Email  │
    │  Page   │ │  Feed    │ │ Script │ │  Posts  │ │ Briefing │
    └─────────┘ └──────────┘ └────────┘ └─────────┘ └──────────┘
```

## Core Components

### 1. News Article Model (`lib/models/news-article.ts`)

- **ProcessedNewsArticle**: Stores ingested article with extracted facts
- **ExtractedFact**: Factual claim with confidence level and sources
- **NewsCluster**: Groups multi-source stories about same event

Key fields:
```typescript
{
  id: string;                    // UUID
  articleHash: string;           // For deduplication
  facts: ExtractedFact[];        // CONFIRMED/REPORTED/ALLEGED/etc.
  qualityScore: number;          // 0-100: is this worth a War Room event?
  mentionedAssets: string[];     // bitcoin, nvda, etc.
  clusterHash?: string;          // Groups Reuters+Bloomberg+CNBC
  status: "ingested" | "fact_extracted" | "market_matched" | "clustered" | "event_created";
}
```

### 2. Fact Extraction Pipeline (`lib/generators/news-fact-extractor.ts`)

Uses Claude Opus to:
- Extract verified factual claims (NOT copy text)
- Tag confidence levels
- Identify mentioned assets
- Score article quality (0-100)

**Confidence Levels:**
- `CONFIRMED`: Explicitly stated as fact with numbers/dates
- `REPORTED`: Stated as someone's report or statement
- `ALLEGED`: Claimed but not independently verified
- `EXPECTED`: Forecast or guidance
- `SPECULATIVE`: Possibility mentioned

**Quality Score:**
- 70+: High quality, create War Room
- 50-70: Medium quality, monitor clustering
- <50: Skip event creation

### 3. News Persistence (`lib/news-db.ts`)

JSON-based storage in `.data/news-articles.json` and `.data/news-clusters.json`:
- `createNewsArticle()`: Ingest and deduplicate
- `updateNewsArticle()`: Track processing status
- `createNewsCluster()`: Group multi-source stories
- `getUnprocessedArticles()`: Pipeline queue
- `archiveOldArticles()`: Cleanup (>48 hours)

### 4. Intelligence Pipeline (`lib/generators/news-intelligence-pipeline.ts`)

Main orchestration:

1. **Ingest** (`ingestArticle`):
   - Fetch from NewsAPI
   - Extract facts with confidence levels
   - Score quality
   - Skip if < 50

2. **Enrich** (`enrichWithMarketData`):
   - Cross-check facts with market prices
   - Identify impacted assets
   - Validate claims against data

3. **Cluster** (`clusterArticles`):
   - Group stories by clusterHash
   - Merge multi-source articles
   - Deduplicate

4. **Create Events** (`createEventFromCluster`):
   - Generate original headline (not copy of article title)
   - Create MarketEvent with original analysis
   - Link to related news articles
   - Feed into War Room, Front Line, Content Factory

### 5. War Room Intelligence Generator (`lib/generators/news-warroom-generator.ts`)

Generates ORIGINAL analysis from facts:
- **WHY IT MOVED**: Market mechanism (not news summary)
- **WHY IT MATTERS**: Trading/investment implication
- **RISK**: What could go wrong
- **WHAT TO WATCH**: Specific levels/events to monitor

Also generates:
- YouTube shorts script (original, not article rewrite)
- Social media posts (original, not news share)

## How It's NOT Just News

### What We DON'T Do ❌
- Copy article text
- Paraphrase headlines
- Reproduce article content
- Share article links as "content"
- Create AI summaries of news

### What We DO ✅
- Extract verified factual claims
- Cross-check with market data
- Generate original analysis
- Create actionable War Room intelligence
- Group multi-source stories intelligently
- Generate original YouTube/social content
- Attribute sources properly

### Example

**Article:** "Bitcoin jumps 5% on institutional adoption news"

**We DON'T generate:** "Bitcoin has jumped 5% following news of institutional adoption"

**We DO generate:**
- **Headline:** "Bitcoin surges 5% as institutional demand creates upside imbalance"
- **Why It Moved:** "Large spot buying from institutions exceeded selling pressure, creating 8-hour price breakout above $45k resistance"
- **Why It Matters:** "If institutional accumulation continues at this pace, next resistance at $47.2k could break before weekly expiration"
- **Watch:** "Monitor $44.8k support and $47.2k resistance; volume above 1.2M suggests continuation risk"

## Integration with Existing Systems

### War Rooms
- News-driven MarketEvents automatically feed into War Room system
- Only high-quality events (score ≥ 60) get SEO pages
- Original analysis (not news rewrite) in War Room

### Front Line
- News-driven events appear in Front Line feed
- Clustered stories show as single event
- Source attribution visible
- Freshness timestamp always shown

### Content Factory
- High-quality news events trigger YouTube script generation
- Social media posts generated from original analysis
- Email briefing includes news-driven events
- All content is original, not news republishing

## API Endpoints

### Cron Jobs
```
GET /api/cron/news-intelligence
Schedule: Every 30 minutes (8 AM - 6 PM ET, weekdays)
Secret: CRON_SECRET header
```

### Admin Dashboard
```
GET /api/admin/news?action=recent&hours=24
GET /api/admin/news?action=asset&asset=bitcoin
GET /api/admin/news?action=status&status=fact_extracted

Returns:
- Article processing status
- Quality breakdown
- Fact extraction summary
- Clustering status
- Asset mentions
- Source distribution
```

## Database Schema

### News Articles (`.data/news-articles.json`)
```json
[
  {
    "id": "article-uuid",
    "articleHash": "dedup-hash",
    "sourceId": "Reuters",
    "title": "Article Title",
    "url": "https://...",
    "facts": [
      {
        "claim": "Institutional fund bought 5,000 BTC",
        "confidence": "CONFIRMED",
        "sources": ["Sentence 3-4"]
      }
    ],
    "qualityScore": 78,
    "mentionedAssets": ["bitcoin"],
    "impactedAssets": [
      {
        "slug": "bitcoin",
        "direction": "up",
        "confidence": 85
      }
    ],
    "status": "event_created",
    "eventId": "event-uuid",
    "processedAt": 1722969600000
  }
]
```

### News Clusters (`.data/news-clusters.json`)
```json
[
  {
    "id": "cluster-uuid",
    "clusterHash": "same-story-hash",
    "articles": [...],
    "leadArticle": {...},
    "unifiedFact": "Institutional buying of Bitcoin",
    "impactAssets": ["bitcoin"],
    "eventGenerated": true,
    "createdAt": 1722969600000
  }
]
```

## Key Design Decisions

1. **Fact Extraction with Confidence**: News is messy. Each fact is tagged with confidence level so we only create events for verified claims.

2. **Story Clustering**: Multiple sources covering same story = one MarketEvent, not duplicates. Grouped by clusterHash.

3. **Quality Filtering**: Articles < 50 quality score don't create events. Prevents noise.

4. **No Paraphrasing**: We extract facts and generate original analysis from facts + market data, never rewrite articles.

5. **Source Attribution**: Every fact links back to source. War Room readers know where intelligence came from.

6. **Market Data Cross-Check**: News is validated against actual market movement. False claims (e.g., "Bitcoin up 10%" when it's only up 2%) get lower confidence.

7. **Original Content**: YouTube, social, email all generate original content from analysis, not by sharing articles.

## Deployment

Add to `.env.local`:
```
NEWSAPI_KEY=your_newsapi_key
CRON_SECRET=your_secret_here
```

Cron job runs automatically on Vercel every 30 minutes during market hours.

Monitor via:
```
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://yoursite.com/api/admin/news?action=recent
```

## Future Enhancements

- Source reliability scoring (Reuters > random blog)
- Real-time market data integration for cross-checking
- Broader news sources (RSS feeds, Twitter, Discord)
- Automatic fact-checking against exchange data
- Regional news filtering (US market news, crypto markets, etc.)
- Integration with trading signals (news → position suggestion)
