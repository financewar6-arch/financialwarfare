# Environment Variables - Complete Reference

All configuration for Financial Warfare pipeline is managed via environment variables.

## Setup Instructions

### Local Development (.env.local)

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
# Then fill in the values below
```

### Production (Render/Vercel)

Add to deployment platform's environment variables:

**Render.com:**
- Dashboard → Environment
- Add each variable name + value

**Vercel:**
- Dashboard → Settings → Environment Variables
- Add each variable name + value

---

## Required Variables

### Authentication & Framework

```bash
# NextAuth Configuration (Required)
NEXTAUTH_URL=https://your-deployed-site.com
NEXTAUTH_SECRET=generated-random-secret-here

# OAuth Providers (Required for sign-in)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### API Keys - Financial Data

```bash
# News API (Required - for news ingestion)
NEWSAPI_KEY=your-newsapi-key-here

# Anthropic Claude (Required - for script generation)
ANTHROPIC_API_KEY=sk-ant-...

# Market Data APIs (Required - for context)
ALPHA_VANTAGE_API_KEY=...
FINNHUB_API_KEY=...
GOLD_API_KEY=...

# These are already configured but included for reference
# Check render.yaml for current keys
```

### API Keys - Social Platforms

```bash
# YouTube Data API v3 (For publishing)
YOUTUBE_API_KEY=AIzaSy...

# TikTok API (Requires Business Account)
TIKTOK_API_KEY=...
TIKTOK_ACCESS_TOKEN=...

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=...

# LinkedIn API
LINKEDIN_ACCESS_TOKEN=...

# Twitter/X API v2
TWITTER_API_KEY=...
TWITTER_API_SECRET=...

# Snapchat API
SNAPCHAT_ACCESS_TOKEN=...
```

### Automation & Security

```bash
# Cron Job Secret (for GitHub Actions)
CRON_SECRET=generated-random-secret-here

# Admin Token (for admin API access)
ADMIN_TOKEN=generated-random-secret-here

# Site URL (for GitHub Actions callbacks)
SITE_URL=https://your-deployed-site.com
```

### Database (Optional - for persistence)

```bash
# PostgreSQL (Optional - for data persistence)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis (Optional - for caching)
REDIS_URL=redis://host:6379
```

---

## Getting Each API Key

### 1. NewsAPI

**Purpose:** Financial news ingestion

**Steps:**
1. Go to https://newsapi.org
2. Sign up (free tier: 100 requests/day)
3. Click "Get API Key"
4. Copy key to .env.local:
   ```
   NEWSAPI_KEY=your-key-here
   ```

**Testing:**
```bash
curl "https://newsapi.org/v2/everything?q=bitcoin&apiKey=YOUR_KEY"
```

---

### 2. Anthropic Claude

**Purpose:** Script generation

**Steps:**
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to API Keys section
4. Create new API key
5. Copy to .env.local:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

**Cost:**
- Claude 3.5 Sonnet: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- Estimated: $2-5/day for script generation

**Testing:**
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model": "claude-opus-5", "max_tokens": 100, "messages": [{"role": "user", "content": "Hi"}]}'
```

---

### 3. YouTube Data API v3

**Purpose:** Publishing videos to YouTube

**Steps:**
1. Go to https://console.cloud.google.com
2. Create new project "Financial Warfare"
3. Go to APIs & Services → Library
4. Search "YouTube Data API v3"
5. Click Enable
6. Go to Credentials
7. Create OAuth 2.0 Desktop Credentials
8. Download JSON
9. Extract API Key:
   ```
   YOUTUBE_API_KEY=AIzaSy...
   ```

**Requirements:**
- Google account
- YouTube channel (with monetization eventually)

**Testing:**
```bash
# Get your channel info
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=YOUR_KEY"
```

---

### 4. TikTok API

**Purpose:** Publishing videos to TikTok

**Requirements:**
- ⚠️ **MUST be Business Account** (personal accounts don't get API access)
- Minimum 1,000 followers (usually)
- Existing content history (usually)

**Steps:**
1. Go to https://developer.tiktok.com
2. Log in with your Business Account
3. Click "Build an app"
4. Select "Personal use"
5. Provide app details
6. Request API access (wait 5-7 days for approval)
7. Once approved:
   ```
   TIKTOK_API_KEY=your-client-key
   TIKTOK_ACCESS_TOKEN=your-access-token
   ```

**If you're a new account:**
- Build content manually first
- Get 1,000+ followers
- Then apply for API access
- This is why we start with YouTube/Instagram

---

### 5. Instagram Graph API

**Purpose:** Publishing reels to Instagram

**Steps:**
1. Go to https://developers.facebook.com
2. Create App → Select "Other"
3. Select "Business" type
4. Fill in app details
5. Go to Products → Add Product → Instagram Graph API
6. Create Instagram Business Account (linked to Facebook Page)
7. Go to Settings → Basic → Copy App ID
8. Go to Roles → Get Access Token:
   ```
   INSTAGRAM_ACCESS_TOKEN=your-token
   ```

**Requirements:**
- Facebook Business Account
- Instagram Business Account
- Linked Facebook Page

**Testing:**
```bash
curl "https://graph.instagram.com/v18.0/me?fields=id,username&access_token=YOUR_TOKEN"
```

---

### 6. LinkedIn API

**Purpose:** Publishing professional content to LinkedIn

**Steps:**
1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. Fill in app details:
   - Name: "Financial Warfare"
   - LinkedIn Page: Your company page
4. Request API access ("Content Creator")
5. Wait for approval (usually 1-2 weeks)
6. Once approved, generate Access Token:
   ```
   LINKEDIN_ACCESS_TOKEN=your-token
   ```

**Scopes needed:**
- `w_member_social` (write social content)
- `r_liteprofile` (read profile)

**Requirements:**
- LinkedIn Company Page
- API access request (takes time)

---

### 7. Twitter/X API v2

**Purpose:** Publishing to Twitter/X

**Steps:**
1. Go to https://developer.twitter.com
2. Apply for developer access (fill form)
3. Wait for approval (1-3 days)
4. Once approved, create app
5. Go to Keys & Tokens
6. Generate:
   ```
   TWITTER_API_KEY=your-api-key
   TWITTER_API_SECRET=your-api-secret
   TWITTER_BEARER_TOKEN=your-bearer-token
   ```

**Requirements:**
- Phone number for verification
- Active Twitter account
- Explain intended use

---

### 8. Snapchat API

**Purpose:** Publishing to Snapchat (optional)

**Steps:**
1. Go to https://ads.snapchat.com
2. Enable Business Account
3. Go to Settings → API
4. Create Snapchat Ads Manager app
5. Generate credentials:
   ```
   SNAPCHAT_ACCESS_TOKEN=your-token
   ```

**Requirements:**
- Business Account
- Snapchat Business Manager

---

### 9. GitHub Actions Secrets

**Purpose:** Allow GitHub Actions to call your deployed site

**Steps:**
1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Create these secrets:
   ```
   SITE_URL = https://your-deployed-site.com
   CRON_SECRET = openssl rand -base64 32
   ```

**Generate CRON_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Maximum 256)}))
```

---

## Generating Secrets

### NEXTAUTH_SECRET

```bash
# Generate in terminal
openssl rand -base64 32

# Copy output to .env.local
NEXTAUTH_SECRET=generated-output-here
```

### CRON_SECRET

```bash
# Same as NEXTAUTH_SECRET
openssl rand -base64 32

# Copy to both:
# - .env.local
# - GitHub Actions Secrets
```

### ADMIN_TOKEN

```bash
# Same process
openssl rand -base64 32

# Copy to .env.local
ADMIN_TOKEN=generated-output-here
```

---

## Configuration by Environment

### Local Development

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-12345
SITE_URL=http://localhost:3000

NEWSAPI_KEY=your-key
ANTHROPIC_API_KEY=sk-ant-...
# ... other keys ...

# Don't need these locally (they're for production automation)
# CRON_SECRET=...
# ADMIN_TOKEN=...
```

### Production (Render)

```
Environment Variables:
├─ NEXTAUTH_URL=https://your-render-url.onrender.com
├─ NEXTAUTH_SECRET=production-secret
├─ SITE_URL=https://your-render-url.onrender.com
├─ NEWSAPI_KEY=...
├─ ANTHROPIC_API_KEY=sk-ant-...
├─ YOUTUBE_API_KEY=AIzaSy...
├─ TIKTOK_API_KEY=...
├─ INSTAGRAM_ACCESS_TOKEN=...
├─ LINKEDIN_ACCESS_TOKEN=...
├─ TWITTER_API_KEY=...
├─ SNAPCHAT_ACCESS_TOKEN=...
├─ CRON_SECRET=... (for GitHub Actions)
└─ ADMIN_TOKEN=...
```

---

## Security Best Practices

### ✅ DO

- [x] Store keys in `.env.local` (not in code)
- [x] Never commit `.env.local` to Git
- [x] Use separate keys for dev/prod
- [x] Rotate keys periodically
- [x] Use environment variables on production
- [x] Set `.env.local` in `.gitignore` (already done)

### ❌ DON'T

- [ ] Put keys in source code
- [ ] Commit `.env.local`
- [ ] Share keys in Slack/email
- [ ] Use same key for dev and prod
- [ ] Expose keys in error messages
- [ ] Log API keys

### .gitignore (Already Configured)

```
.env.local
.env.*.local
node_modules/
.next/
out/
.DS_Store
```

---

## Testing Your Setup

### Test NewsAPI

```bash
curl "https://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=YOUR_NEWSAPI_KEY"
```

Expected: JSON with articles array

### Test Anthropic Claude

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-opus-5", "max_tokens": 50, "messages": [{"role": "user", "content": "Hello"}]}'
```

Expected: JSON with response

### Test Your Endpoints

```bash
# Once deployed:

# Test stories endpoint
curl https://your-site.com/api/pipeline/stories

# Test script generation
curl -X POST https://your-site.com/api/pipeline/generate-scripts

# Test analytics
curl https://your-site.com/api/pipeline/analytics?action=summary
```

---

## Troubleshooting

### "API Key Invalid"
```
✓ Double-check key is copied exactly (no spaces)
✓ Verify key is for the correct API
✓ Check key hasn't expired
✓ Confirm API is enabled in console
```

### "Rate Limited"
```
✓ Check daily/hourly limits for that API
✓ Wait for rate limit window to reset
✓ Upgrade API tier if needed
✓ Add request caching to reduce calls
```

### "Unauthorized"
```
✓ Verify token/key format
✓ Check scopes (LinkedIn, Twitter)
✓ Confirm account is in good standing
✓ Try regenerating the key
```

### "API Disabled"
```
✓ Go to API console
✓ Search for API
✓ Click "Enable"
✓ Wait a minute
✓ Try again
```

---

## Cost Summary

| Service | Monthly Cost | Free Tier | Notes |
|---------|---------|-----------|-------|
| NewsAPI | $0-50 | 100 req/day | Sufficient for morning use |
| Anthropic Claude | $2-5 | None | ~$0.003 per 1K tokens |
| YouTube | Free | Unlimited | Just API calls |
| TikTok | Free | Unlimited | Just API calls |
| Instagram | Free | Unlimited | Just API calls |
| LinkedIn | Free | Unlimited | Just API calls |
| Twitter | $0-100 | Free tier | Basic tier sufficient |
| Snapchat | Free | Unlimited | Just API calls |
| **TOTAL** | **~$50-150** | **Mostly free** | Before hosting |

---

## Environment Variables Checklist

Before deploying to production:

- [ ] NEXTAUTH_URL set
- [ ] NEXTAUTH_SECRET generated and set
- [ ] NEWSAPI_KEY configured
- [ ] ANTHROPIC_API_KEY configured
- [ ] YOUTUBE_API_KEY (if YouTube enabled)
- [ ] TIKTOK_API_KEY + TIKTOK_ACCESS_TOKEN (if TikTok enabled)
- [ ] INSTAGRAM_ACCESS_TOKEN (if Instagram enabled)
- [ ] LINKEDIN_ACCESS_TOKEN (if LinkedIn enabled)
- [ ] TWITTER_API_KEY (if Twitter enabled)
- [ ] SNAPCHAT_ACCESS_TOKEN (if Snapchat enabled)
- [ ] CRON_SECRET generated and set
- [ ] ADMIN_TOKEN generated and set
- [ ] SITE_URL set to production URL
- [ ] All secrets added to production platform

---

**🔒 Secure, configured, and ready to deploy!**
