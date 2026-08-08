# Automatic Editorial Content Updates

War room editorial content (Why It Moved, Why It Matters, Risk, Watch Next) can now be automatically generated and updated daily using Claude AI analysis.

## How It Works

1. **Editorial Generator** (`lib/generators/editorial-generator.ts`): Uses Claude Opus to generate fresh market analysis for any asset based on its performance and market category.

2. **Editorial Loader** (`lib/editorial-loader.ts`): Loads generated content from `.data/editorial/` directory if available, falling back to static content files in `/content`.

3. **Cron Endpoint** (`app/api/cron/editorial-update/route.ts`): Runs daily (via Vercel Cron or your infrastructure) to regenerate content for all war room assets.

## Setup Instructions

### 1. Vercel Cron Configuration

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/editorial-update",
      "schedule": "0 8 * * *"
    }
  ]
}
```

The schedule `"0 8 * * *"` means: **8 AM UTC every day**. Adjust to your preferred time zone.

### 2. Environment Variables

Ensure `CRON_SECRET` is set in your environment:

```bash
CRON_SECRET=your-secret-key-here
```

This protects the cron endpoint from unauthorized calls.

### 3. Enable for War Rooms

Update war room pages to use the editorial loader:

```typescript
import { loadEditorialContent } from "@/lib/editorial-loader";
import { bitcoinEditorial } from "@/content/bitcoin";

export default async function BitcoinWarRoomPage() {
  const asset = ASSETS.bitcoin;
  const editorial = await loadEditorialContent(asset.slug, bitcoinEditorial);
  return (
    <WarRoom 
      assetSlug={asset.slug} 
      name={asset.name} 
      symbol={asset.symbol} 
      editorial={editorial} 
    />
  );
}
```

Pages using the editorial loader automatically serve generated content when available, falling back to static content.

## How It Updates Daily

1. **Cron triggers** at scheduled time (e.g., 8 AM UTC)
2. **Editorial generator** creates fresh analysis for all assets
3. **Content saved** to `.data/editorial/{assetSlug}.json`
4. **War room pages** detect and load the fresh content on next visit
5. **Fallback** to static content if generation fails

## Generated Content Structure

Generated content includes:
- `photoLabel`: Visual asset description
- `whyItMoved`: Market mechanism explanation
- `whyYouShouldCare`: Trading implications
- `risk`: Potential reversals/risks
- `watchNext`: Specific monitoring points

All analysis is **original** and tailored to current market conditions.

## Manual Trigger

To manually trigger an update:

```bash
curl -X GET http://localhost:3000/api/cron/editorial-update \
  -H "Authorization: Bearer your-cron-secret"
```

## Fallback Behavior

If content generation fails:
- Cron continues processing remaining assets
- War rooms display static content from `/content` files
- Users always see valid analysis (no blank fields)

## Production Considerations

- Claude API calls cost money; adjust cron frequency based on budget
- Generation takes ~10-15 seconds per asset; consider batch limiting
- Store generated content in persistent storage (already using `.data/`)
- Monitor cron execution for failures in Vercel dashboard

## Disabling Auto-Updates

Simply don't add the cron schedule to `vercel.json`. War rooms will always use static editorial content from `/content` files.
