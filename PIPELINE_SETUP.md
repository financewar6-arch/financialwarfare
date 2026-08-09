# Financial Warfare News→Video→Social Pipeline

Complete guide to the automated content creation and publishing system.

## Overview

The pipeline automates:
1. **News Collection** (16-hour lookback window)
2. **Story Selection** (top 3-6 most important stories)
3. **Script Generation** (platform-specific: YouTube, TikTok, Instagram, LinkedIn, Twitter)
4. **Review & Approval** (human review dashboard)
5. **Video Generation** (manual CapCut or automated rendering)
6. **Multi-Platform Publishing** (one-click to all 5 platforms)
7. **Analytics & Feedback** (performance tracking)

## Architecture

### Core Components

#### 1. Story Selector (`lib/pipeline/story-selector.ts`)
- Fetches news articles from `/api/news`
- Scores articles by:
  - Quality score (0-100)
  - Recency (published hours ago)
  - Asset impact (market relevance)
  - Clustering (multi-source stories)
  - Deduplication (prevents same story twice)
- Returns top N stories ranked by importance
- Ensures asset diversity (not all crypto, not all tech)

#### 2. Platform Script Generator (`lib/pipeline/platform-script-generator.ts`)
- Generates 30-45 second scripts for each platform
- Customized by platform:
  - **YouTube**: Structured hook→what→why→CTA (30s)
  - **TikTok**: Ultra-short, snappy (15s)
  - **Instagram**: Professional with visuals (30s)
  - **LinkedIn**: Formal, institutional tone (60s)
  - **Twitter**: Text-focused with hashtags (280 char limit)
  - **Snapchat**: Story format (10s)

#### 3. Content Package Model (`lib/models/content-package.ts`)
- Groups 3-6 stories + generated scripts
- Tracks workflow status: draft → scripts_approved → videos_ready → published
- Includes approval workflow (reviewer notes)
- Stores video metadata (platform URLs)

#### 4. Review Dashboard (`app/admin/pipeline/review-scripts/page.tsx`)
- Shows top stories (left sidebar)
- Displays generated scripts for all 5 platforms (right panel)
- Edit capability for each script before approval
- Approve/reject workflow

#### 5. Multi-Platform Publishers
- Base class (`lib/publishers/base-publisher.ts`)
- Individual implementations:
  - `youtube-publisher.ts` - YouTube Data API v3
  - `tiktok-publisher.ts` - TikTok API
  - `instagram-publisher.ts` - Instagram Graph API
  - `linkedin-publisher.ts` - LinkedIn API
  - `twitter-publisher.ts` - Twitter API v2
  - `snapchat-publisher.ts` - Snapchat API
- Mock mode for testing (no API keys required)

#### 6. Publishing Dashboard (`app/admin/pipeline/publishing/page.tsx`)
- Shows content queue (videos ready)
- Select platforms to publish to
- One-click publish to all selected platforms
- Track published URLs

#### 7. Analytics Dashboard (`app/admin/pipeline/analytics/page.tsx`)
- Performance metrics across platforms
- Top performing content, assets, platforms
- Engagement rates per platform
- Recommendations for future content

## API Endpoints

### Story Selection
```
GET /api/pipeline/stories?topCount=5&lookbackHours=16&minimumScore=40
```
Returns top stories for the lookback window.

### Script Generation
```
POST /api/pipeline/generate-scripts
Body: { stories: [...] }
```
Generates platform-specific scripts for stories.

### Content Packages
```
GET /api/pipeline/packages
POST /api/pipeline/packages
```
Create, list, and manage content packages.

Supported actions:
- `action=create` - Create new package
- `action=approve` - Approve for video generation
- `action=reject` - Reject with reason
- `action=videos_ready` - Mark videos ready
- `action=publish` - Publish to platforms

### Publishing
```
POST /api/pipeline/publish
Body: {
  videoUrl: "https://...",
  title: "...",
  description: "...",
  hashtags: ["#Market", "#Trading"],
  platforms: ["youtube", "tiktok", "instagram", "linkedin", "twitter"]
}
```
Publish video to multiple platforms simultaneously.

### Analytics
```
GET /api/pipeline/analytics?action=summary
GET /api/pipeline/analytics?action=video&videoId=xyz
GET /api/pipeline/analytics?action=asset&asset=BTC
POST /api/pipeline/analytics
```
Track video performance and metrics.

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```bash
# Existing (already configured)
ANTHROPIC_API_KEY=sk-ant-...
NEWSAPI_KEY=...

# New for publishing
YOUTUBE_API_KEY=...
TIKTOK_API_KEY=...
TIKTOK_ACCESS_TOKEN=...
INSTAGRAM_ACCESS_TOKEN=...
LINKEDIN_ACCESS_TOKEN=...
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
SNAPCHAT_ACCESS_TOKEN=...

# Cron scheduling
SITE_URL=https://yourdomain.com
CRON_SECRET=generated-secret
```

### 2. API Key Setup

#### YouTube
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project "Financial Warfare"
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials (Desktop app)
5. Copy API key and client secret

#### TikTok
1. Go to [TikTok Developer Portal](https://developer.tiktok.com)
2. Create business account
3. Request API access (Business Account required)
4. Get API key and access token

#### Instagram
1. Go to [Meta Developers](https://developers.facebook.com)
2. Create app → Instagram Graph API
3. Create Instagram Business Account
4. Generate access token

#### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers)
2. Create app
3. Request API access
4. Generate access token with `w_member_social` scope

#### Twitter
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create app
3. Generate API keys and access tokens
4. Enable OAuth 1.0a for media upload

#### Snapchat
1. Go to [Snapchat Ads Manager](https://ads.snapchat.com)
2. Enable Business Account
3. Get API credentials from Settings

### 3. GitHub Actions Setup

1. Copy `.github/workflows/daily-pipeline.yml` to your repo
2. Go to Settings → Secrets → New repository secret
3. Add secrets:
   - `SITE_URL`: Your deployed site URL
   - `CRON_SECRET`: Random token for API validation
4. Workflow runs daily at 6 AM ET (market open)

### 4. Deploy

```bash
# Add to Render.com environment variables
YOUTUBE_API_KEY=...
TIKTOK_API_KEY=...
# ... other keys ...
SITE_URL=https://your-render-url.onrender.com

# Deploy
git push
# Render auto-deploys on push
```

## Daily Workflow

### Automated (via GitHub Actions at 6 AM ET)
1. ✓ News articles collected (12-18 hour lookback)
2. ✓ Top 3-6 stories selected by importance
3. ✓ 5 platform-specific scripts generated
4. ✓ Content package created and ready for review

### Manual (you do this)
1. Go to `/admin/pipeline/review-scripts`
2. Review stories and scripts for all platforms
3. Approve scripts (or edit if needed)
4. Create videos in CapCut using generated scripts
5. Upload videos back to system

### Automated (one-click publishing)
1. Go to `/admin/pipeline/publishing`
2. Select platforms (or use all 5 defaults)
3. Click "Publish to X Platforms"
4. Videos live on YouTube, TikTok, Instagram, LinkedIn, Twitter!

## Estimated Timeline

**Morning (6-9 AM):**
- Automated: Stories selected + scripts generated
- You: Review scripts (10-15 min)
- You: Make 3-6 videos in CapCut (45-90 min)

**Midday (11 AM):**
- You: Upload videos to system
- You: Click "Publish"
- Automated: Videos live on all 5 platforms!

**Total manual work: ~1-1.5 hours per day**

## Cost Estimate

### APIs
- **Anthropic Claude**: $2-5/day (script generation)
- **NewsAPI**: $0-50/month (included tier)
- **YouTube API**: Free
- **TikTok API**: Free
- **Instagram API**: Free
- **LinkedIn API**: Free
- **Twitter API**: Free
- **Snapchat API**: Free

### Hosting (Render.com)
- Web Service: ~$15/month
- Postgres (optional): ~$15/month

**Total: ~$30-50/month**

## Advanced Configuration

### Custom Story Selection Algorithm

Edit `lib/pipeline/story-selector.ts`:
- Adjust `minimumScore` threshold
- Change `lookbackHours` window
- Modify asset diversity ratio
- Add custom scoring factors

### Custom Script Tone

Edit `lib/pipeline/platform-script-generator.ts`:
- Change hook phrasing
- Adjust technical depth
- Add branding elements
- Modify CTA language

### Custom Publishing Flow

Edit `lib/publishers/*.ts`:
- Add custom hashtag generation
- Implement platform-specific formatting
- Add watermarks or branding
- Schedule posts for later

### Feedback Loop

Uncomment analytics → story selector integration:
```typescript
// High-performing assets get boosted in next selection
const performanceScores = await getAssetPerformance();
const performanceBoost = performanceScores[asset] * 0.1; // +10% score
```

## Troubleshooting

### Stories not showing
- Check `/api/news` is working
- Verify NewsAPI key is set
- Check quality thresholds (default: 40/100)

### Scripts not generating
- Verify ANTHROPIC_API_KEY is set
- Check story array is populated
- Look at server logs for errors

### Publishing fails
- Verify API keys are correct
- Check rate limits on platform APIs
- Ensure video URL is accessible
- Check platform account is in good standing

## Next Steps After Launch

1. **Week 1**: Monitor script quality, adjust prompts if needed
2. **Week 2**: Analyze video performance, optimize asset selection
3. **Week 3**: Add custom thumbnails and branding
4. **Week 4**: Automate video generation (Remotion or Synthesia)
5. **Month 2**: Implement full automation (video generation + publishing)

## Support

For issues:
1. Check server logs: `render.com` → dashboard
2. Test API endpoints with `curl`:
   ```bash
   curl https://yourdomain.com/api/pipeline/stories
   ```
3. Review environment variables
4. Check GitHub Actions workflow logs

---

**You're now running a semi-automated news→video→social pipeline!** 🚀
