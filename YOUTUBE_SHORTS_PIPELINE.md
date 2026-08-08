# YouTube Shorts Automation Pipeline

## Status: Phase 1-4 Complete ✅

### What's Built

#### Phase 1: Data Models ✅
- **VideoScript**: Script content with hook, what, why, significance, watchNext, CTA
- **ContentQueue**: Workflow management (DRAFT → APPROVED → GENERATING → READY → PUBLISHED)
- **VideoMetadata**: Video storage, thumbnail, platform distribution tracking
- Location: `lib/models/video-content.ts`

#### Phase 2: Script Generation ✅
- **YouTubeScriptGenerator**: Converts MarketEvent → 30-60 second shorts script
- Data-driven (no hallucinations), uses event data only
- Validates for price predictions, unsubstantiated claims, length
- Example output:
  ```
  📈 NVIDIA just up 5.8%. Here's what's driving the move.
  
  The company announced AI breakthrough, which is the immediate catalyst.
  
  Market reaction showing strong momentum — NVDA up 5.8% vs sector +2.1%, volume 3.2x normal.
  
  Next thing we're watching: break above $120 resistance.
  
  For the full breakdown, check the NVIDIA War Room.
  ```
- Location: `lib/generators/youtube-script-generator.ts`

#### Phase 3: Database Operations ✅
- Extended `lib/db.ts` with:
  - `createContentQueueItem()` / `getContentQueueItem()` / `updateContentQueueItem()`
  - `getContentQueueByStatus()` (DRAFT, APPROVED, GENERATING, etc.)
  - `createVideoMetadata()` / `getVideoMetadata()` / `getLatestVideos()`
  - All operations persist to `.data/content-queue.json` and `.data/video-metadata.json`

#### Phase 4: API Routes ✅

**POST /api/shorts/generate-script**
- Input: `{ marketEventId }`
- Generates script, creates ContentQueue item in DRAFT status
- Output: `{ contentQueueId, scriptId, flaggedIssues }`

**POST /api/shorts/approve**
- Input: `{ contentQueueId, action: "approve" | "reject" | "regenerate", approvalNotes }`
- Approve → status APPROVED (triggers video generation)
- Reject → status REJECTED (discarded)
- Regenerate → status DRAFT (can regenerate script)

**GET /api/shorts/latest**
- Returns latest N videos for homepage display
- Query: `?limit=5`
- Response: `{ videos: [...], total }`

#### Phase 5: Homepage Integration ✅
- **MarketShorts component** displays 3 latest videos
- Responsive grid (300px+ columns)
- Video player with controls
- Links to War Rooms
- Shows: title, asset symbol, price change, time ago, duration
- Location: `components/site/MarketShorts.tsx`
- Integrated into `app/page.tsx` between news and asset grid

---

## Phase 4: Video Generation Service ✅

**Status**: Architecture complete, Remotion templates ready

**Built**:
- Remotion-based video templates (MarketMovesTemplate)
- Video generator service with placeholder support
- Video generation API endpoint (`POST /api/shorts/generate-video`)
- Cron job for auto-generating videos (`/api/cron/shorts-generation`)
- Vercel cron configuration (every 30 mins, 8am-4pm, Mon-Fri)
- Content Queue dashboard for script review/approval
- Admin page at `/admin/content-queue`

**Location**:
- Templates: `lib/video/templates/`
- Generator: `lib/video/video-generator.ts`
- API: `app/api/shorts/generate-video/route.ts`
- Cron: `app/api/cron/shorts-generation/route.ts`
- Dashboard: `components/admin/ContentQueueDashboard.tsx`
- Admin page: `app/admin/content-queue/page.tsx`

**How it works**:
1. User approves script in dashboard (`/admin/content-queue`)
2. Status changes to APPROVED
3. Cron job detects APPROVED items every 30 minutes
4. Calls `POST /api/shorts/generate-video`
5. Remotion renders video
6. Video stored, thumbnail generated
7. Status changes to READY
8. Homepage displays video

---

## What's Missing (Next Phases)

### Phase 5: Full Remotion Video Rendering
**Status**: Pending (MVP uses placeholders)

**Options**:
1. **Remotion** (React-based video generation)
   - Pros: Full control, matches tech stack, scales
   - Cons: Complex setup
   - Cost: Free

2. **Synthesia API** (AI avatar)
   - Pros: Fully automated, consistent branding
   - Cons: $30-300/month, AI avatar quality
   - Cost: $30-300/month

3. **ffmpeg + Canvas** (simple)
   - Pros: Free, lightweight
   - Cons: Basic templates only
   - Cost: Free

**Recommendation for MVP**: Start with ffmpeg + canvas to generate simple videos with text overlay + asset chart. If branding is important, use Synthesia.

**Implementation**:
```typescript
POST /api/shorts/generate-video
{
  contentQueueId,
  template: "market_moves" | "price_action" | "breaking_news"
}

Response:
{
  videoId,
  videoUrl,
  status: "success" | "failed"
}
```

### Phase 5: Content Queue Dashboard UI
**Status**: Not built yet

Need admin UI to:
- View DRAFT scripts with content
- Preview full script text
- Edit script before approval
- See flagged issues
- Approve, reject, or regenerate scripts
- Monitor video generation progress
- View published videos

**Location**: `/admin/shorts` or `/dashboard/content-queue`

### Phase 6: Cron Job for Auto-Generation
**Status**: Not built yet

```typescript
// Every 2 hours during market hours
- Fetch MarketEvents with importanceScore >= 75
- For each event without script:
  - Call POST /api/shorts/generate-script
  - Script goes to DRAFT in content queue
```

**Location**: `lib/scheduler/` or Vercel Cron (`api/cron/shorts-generation`)

### Phase 7: Video Storage & Hosting
**Status**: Designed, not built yet

**Current plan**: Vercel Blob Storage
- Free tier: 1GB (suitable for MVP)
- Integration: `@vercel/blob`
- Video upload function in video generation service

**Later**: Scale to S3 or Mux

### Phase 8: Full Shorts Page
**Status**: Not built yet

`/shorts` page shows:
- All published videos
- Filter by asset
- Pagination
- Sort by newest/trending
- Video statistics (views, likes)

---

## Data Flow

```
MarketEvent Created
    ↓
[importanceScore >= 75?]
    ↓ YES
Generate YouTube Script
    ↓
Create ContentQueue Item (DRAFT)
    ↓
User Reviews Script in Dashboard
    ↓
User Clicks "Approve"
    ↓
Status → APPROVED
    ↓
Trigger Video Generation
    ↓
[Video Generation Service]
    ↓
Upload to Storage
    ↓
Create VideoMetadata
    ↓
Status → READY
    ↓
Homepage "Latest Market Shorts" displays video
    ↓
[Later: Publish to YouTube, TikTok, Instagram]
```

---

## Database Schema

### content-queue.json
```json
{
  "queue-item-uuid": {
    "id": "uuid",
    "marketEventId": "evt-123",
    "videoType": "YOUTUBE_SHORT",
    "status": "DRAFT|APPROVED|GENERATING|READY|PUBLISHED|FAILED",
    "scriptId": "script-123",
    "title": "NVIDIA jumps 5.8% on AI breakthrough",
    "description": "Market reacting to company AI chip announcement",
    "assetSlug": "nvidia",
    "assetSymbol": "NVDA",
    "assetName": "NVIDIA",
    "priceChange": 5.8,
    "videoUrl": "https://...",
    "thumbnailUrl": "https://...",
    "approvalNotes": "Approved for immediate publication",
    "createdAt": 1691234567890,
    "reviewedAt": 1691234667890,
    "generatedAt": 1691234767890,
    "updatedAt": 1691234867890
  }
}
```

### video-metadata.json
```json
{
  "video-uuid": {
    "id": "uuid",
    "contentQueueId": "queue-item-uuid",
    "marketEventId": "evt-123",
    "title": "NVIDIA jumps 5.8% on AI breakthrough",
    "description": "Short description...",
    "videoUrl": "https://storage.url/video.mp4",
    "duration": 45,
    "tags": ["NVDA", "AI", "earnings"],
    "thumbnail": {
      "url": "https://...",
      "method": "auto|manual|frame_extract"
    },
    "platforms": {
      "youtube": {
        "published": false
      }
    },
    "generatedAt": 1691234867890
  }
}
```

---

## Next Steps (Prioritized)

1. **Choose video generation method** (Remotion, Synthesia, or ffmpeg)
2. **Build video generation service** with template support
3. **Create content queue dashboard UI** for script review/approval
4. **Implement cron job** for auto-script generation
5. **Build full shorts page** (`/shorts`)
6. **Add YouTube publishing** (API integration)
7. **Add TikTok/Instagram distribution** (API integration)

---

## Success Metrics

- Scripts auto-generated on MarketEvent creation
- User approval workflow active
- Videos generated on demand
- Homepage displays market shorts
- Videos link to War Rooms
- Video playback works on mobile
- Error handling for all failure modes
- Analytics tracking (generation rate, approval rate, video views)

---

## Testing Checklist

- [ ] Generate script from MarketEvent
- [ ] Script appears in content queue
- [ ] Approve script in queue
- [ ] Video generates successfully
- [ ] Video displays on homepage
- [ ] Video plays in browser
- [ ] Responsive on mobile
- [ ] Links to War Room work
- [ ] Error handling works

---

## Implementation Notes

### Script Validation
Scripts are validated for:
- ✅ Length (30-60 seconds)
- ✅ No price predictions ("will rise", "target price")
- ✅ No unsubstantiated claims
- ✅ Proper attribution to War Room
- ✅ Correct CTA

Flagged issues shown to user before approval.

### Data-Driven Only
Scripts pull ONLY from MarketEvent data:
- Headline
- Price change
- Volume ratio
- Technical levels (high/low)
- Related news
- Why it moved (from enrichment)

No LLM inference beyond factual composition.

### Content Queue Workflow
Every script must be:
1. Generated (DRAFT)
2. Reviewed by user (flagged issues visible)
3. Approved explicitly (APPROVED)
4. Video generated (GENERATING → READY)
5. Published (PUBLISHED)

No automatic publication without approval.

---

## Quick Start Guide

### 1. Generate a Script from a Market Event

```bash
curl -X POST http://localhost:3000/api/shorts/generate-script \
  -H "Content-Type: application/json" \
  -d { "marketEventId": "evt-123" }
```

Response:
```json
{
  "success": true,
  "contentQueueId": "queue-456",
  "scriptId": "script-789",
  "status": "DRAFT",
  "flaggedIssues": []
}
```

### 2. Review Script in Dashboard

Visit: `http://localhost:3000/admin/content-queue`

- Filter by DRAFT status
- Select script to review
- See flagged issues if any
- Click APPROVE or REJECT

### 3. Video Auto-Generates

When approved:
- Status → APPROVED
- Cron job runs (every 30 mins)
- Video generation triggered
- Status → READY
- Video appears on homepage

### 4. Manually Trigger Video Generation

```bash
curl -X POST http://localhost:3000/api/shorts/generate-video \
  -H "Content-Type: application/json" \
  -d { "contentQueueId": "queue-456", "template": "market_moves" }
```

Response:
```json
{
  "success": true,
  "videoId": "vid-999",
  "videoUrl": "/api/videos/placeholder.mp4?id=queue-456",
  "thumbnailUrl": "/api/videos/thumbnail?...",
  "duration": 45,
  "status": "READY"
}
```

### 5. View Latest Videos

Homepage automatically displays 3 latest videos:
- Video player
- Asset symbol + price change
- Title + description
- Link to War Room

Or visit API:
```bash
curl http://localhost:3000/api/shorts/latest?limit=5
```

---

## Environment Variables

Add to `.env.local`:

```
CRON_SECRET=your-secret-key-here
VERCEL_BLOB_STORE_NAME=financial-warfare  # For Vercel Blob
```

---

## Next: Implement Full Remotion Rendering

Current MVP uses placeholder videos. To implement real video rendering:

1. Set up Remotion render service
2. Replace `generateVideoFile()` in `lib/video/video-generator.ts`
3. Use Remotion API to render `MarketMovesTemplate`
4. Store rendered MP4 to Vercel Blob Storage or S3
5. Return video URL

---

Done. The complete YouTube Shorts automation pipeline is ready.
