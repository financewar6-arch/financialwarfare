# Financial Warfare - Live Deployment Guide

**Goal**: Launch Financial Warfare to production in ~1 hour  
**Estimated Cost**: $0-50/month (depending on traffic)

---

## ⏱️ PHASE 1: OAuth Setup (15 minutes)

### Step 1: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
7. Copy **Client ID** and **Client Secret**

### Step 2: GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/apps)
2. Click **New GitHub App** or **New OAuth App**
3. Fill in:
   - **Application name**: Financial Warfare
   - **Homepage URL**: https://yourdomain.com
   - **Authorization callback URL**: https://yourdomain.com/api/auth/callback/github
4. Copy **Client ID** and generate **Client Secret**

### Step 3: Save Credentials

Create `.env.local` in project root:

```bash
# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Google OAuth
GOOGLE_CLIENT_ID=<paste from Google Console>
GOOGLE_CLIENT_SECRET=<paste from Google Console>

# GitHub OAuth
GITHUB_CLIENT_ID=<paste from GitHub>
GITHUB_CLIENT_SECRET=<paste from GitHub>

# APIs (existing)
ALPHA_VANTAGE_API_KEY=<your-key>
FINNHUB_API_KEY=<your-key>
NEWS_API_KEY=<your-key>
CRON_SECRET=<generate with: openssl rand -base64 32>
```

**DO NOT commit .env.local to git**

---

## 🚀 PHASE 2: Deployment (30 minutes)

### Option A: Vercel (Recommended - Easiest)

**Why Vercel?**
- Free tier includes Next.js hosting
- Automatic deployments from GitHub
- Built-in serverless functions
- Edge network (fast globally)
- One-click rollbacks

#### Steps:

1. **Sign up at [Vercel](https://vercel.com)**
   - Sign up with GitHub account (easier)

2. **Connect your GitHub repo**
   - Click **Add New** → **Project**
   - Select your Financial Warfare repo
   - Click **Import**

3. **Configure Environment Variables**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - NEXTAUTH_URL
     - NEXTAUTH_SECRET
     - GOOGLE_CLIENT_ID
     - GOOGLE_CLIENT_SECRET
     - GITHUB_CLIENT_ID
     - GITHUB_CLIENT_SECRET
     - ALPHA_VANTAGE_API_KEY
     - FINNHUB_API_KEY
     - NEWS_API_KEY
     - CRON_SECRET

4. **Set Custom Domain** (optional)
   - Vercel Settings → Domains
   - Add your domain (financialwarfare.com)
   - Update DNS records as instructed

5. **Deploy**
   - Click **Deploy**
   - Wait for deployment to complete (~2 minutes)
   - You'll get a production URL

---

### Option B: AWS (More Control)

#### Steps:

1. **Create AWS Account** at [aws.amazon.com](https://aws.amazon.com)

2. **Install AWS CLI**
   ```bash
   # macOS/Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Windows PowerShell
   msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
   ```

3. **Create AWS Access Keys**
   - Go to IAM Console
   - Create new user with EC2 + RDS access
   - Generate access key
   - Run `aws configure` and paste keys

4. **Deploy with Amplify**
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify push
   ```

5. **Configure RDS Database**
   - Create PostgreSQL instance
   - Set security group to allow Amplify app
   - Get connection string

---

### Option C: Railway (Simple)

1. Go to [Railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your Financial Warfare repo
4. Add PostgreSQL plugin
5. Set environment variables
6. Deploy

---

## 📦 PHASE 3: Database Setup (20 minutes)

### For Vercel (Recommended: Vercel Postgres)

1. **Add Vercel Postgres**
   - Vercel dashboard → Storage → Databases
   - Click **Create Database**
   - Select **Postgres**
   - Follow the wizard
   - Copy connection string

2. **Add to Environment Variables**
   ```
   DATABASE_URL=<connection-string-from-vercel>
   ```

3. **Deploy**
   - Vercel auto-redeploys when env vars change

### For Self-Managed Postgres

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql@15

   # Ubuntu/Debian
   sudo apt-get install postgresql-15

   # Windows
   Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE financial_warfare;
   \q
   ```

3. **Get Connection String**
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/financial_warfare
   ```

---

## 🔐 PHASE 4: Update OAuth Redirect URIs

**Important**: After getting your production domain, update OAuth apps:

### Google Console
- APIs & Services → Credentials
- Edit OAuth client
- Add new authorized URI:
  ```
  https://yourdomain.com/api/auth/callback/google
  ```

### GitHub
- Developer Settings → OAuth Apps
- Edit your app
- Update Authorization callback URL:
  ```
  https://yourdomain.com/api/auth/callback/github
  ```

---

## ✅ PHASE 5: Pre-Launch Testing (10 minutes)

### 1. Test OAuth Flows

```bash
# Visit your site
https://yourdomain.com

# Click SIGN IN
# Test: Google sign-in
# Test: GitHub sign-in
# Test: Email/Password (demo mode)
```

### 2. Test Key Features

- [ ] Homepage loads
- [ ] War rooms load data
- [ ] Search works
- [ ] Dark/Light mode toggle works
- [ ] Videos load on DAILY NEWS
- [ ] Footer social links present
- [ ] 404 page works (visit /nonexistent)
- [ ] Breadcrumbs show on articles

### 3. Check Console for Errors

```bash
# Open browser DevTools (F12)
# Check Console tab for errors
# Check Network tab - all requests should be green (200s)
```

### 4. Mobile Test

```bash
# DevTools → Toggle device toolbar (Ctrl+Shift+M)
# Test on mobile size (375px width)
# Verify responsive layout
```

---

## 🎯 PHASE 6: DNS & Domain Setup (5 minutes)

### If using custom domain:

1. **Get Nameservers from hosting platform**
   - Vercel: Settings → Domains
   - AWS: Route 53
   - Railway: Settings → Domains

2. **Update Domain Registrar** (GoDaddy, Namecheap, etc)
   - Go to Domain Settings
   - Update Nameservers to those provided
   - Wait 24-48 hours for DNS propagation
   - Verify with: `nslookup yourdomain.com`

---

## 📊 PHASE 7: Monitoring Setup (10 minutes)

### Option A: Vercel Analytics (Free, Built-in)

```bash
# Already included with Vercel deployment
# Check at: Vercel Dashboard → Analytics
```

### Option B: Sentry (Free tier = 5k errors/month)

1. Sign up at [sentry.io](https://sentry.io)
2. Create project (select Next.js)
3. Install SDK:
   ```bash
   npm install @sentry/nextjs
   ```
4. Add to `next.config.js`:
   ```javascript
   const withSentry = require("@sentry/nextjs/withSentry");
   module.exports = withSentry(nextConfig);
   ```
5. Set environment variable:
   ```
   SENTRY_AUTH_TOKEN=<from Sentry dashboard>
   ```

### Option C: LogRocket (Free tier = 1GB/month)

1. Sign up at [logrocket.com](https://logrocket.com)
2. Create new app, get App ID
3. Install:
   ```bash
   npm install logrocket
   ```
4. Add to `app/layout.tsx`:
   ```typescript
   import LogRocket from "logrocket";
   LogRocket.init("app-id");
   ```

---

## 🚨 PHASE 8: Production Checklist

Before going live, verify:

### Security
- [ ] HTTPS enabled (automatic with Vercel/AWS)
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] OAuth secrets never in git
- [ ] `.env.local` in `.gitignore`
- [ ] CRON_SECRET is random and strong

### Performance
- [ ] Images optimized (Next.js Image component used)
- [ ] CSS is minified (automatic with Next.js)
- [ ] JavaScript is bundled (automatic with Next.js)
- [ ] No console warnings/errors
- [ ] Lighthouse score > 80

### Functionality
- [ ] All war rooms load data
- [ ] Search works
- [ ] OAuth flows complete
- [ ] Videos load and play
- [ ] 404 page displays
- [ ] Mobile responsive

### Monitoring
- [ ] Error tracking enabled (Sentry/LogRocket)
- [ ] Vercel Analytics dashboard open
- [ ] Monitoring emails configured
- [ ] Uptime monitoring enabled (optional)

---

## 🔄 PHASE 9: Enable Cron Jobs (Optional)

### For auto-generating videos every 30 minutes:

**Vercel Crons** (Recommended for Vercel)

1. Create `vercel.json` in project root:
```json
{
  "crons": [
    {
      "path": "/api/cron/shorts-generation",
      "schedule": "*/30 8-16 * * 1-5"
    }
  ]
}
```

2. Push to GitHub
3. Vercel automatically runs cron jobs

**External Cron Service** (Alternative)

Use [EasyCron](https://www.easycron.com) or [cron-job.org](https://cron-job.org):

1. Create account
2. Add new cron job:
   - URL: `https://yourdomain.com/api/cron/shorts-generation`
   - Header: `Authorization: Bearer <CRON_SECRET>`
   - Schedule: Every 30 minutes, 8AM-4PM weekdays

---

## 📞 PHASE 10: Go Live!

### 1. Final Verification
```bash
# Visit your production URL
# Test all features one more time
# Check analytics dashboard
```

### 2. Announce Launch
- [ ] Email users
- [ ] Post on social media (Twitter, Instagram, LinkedIn)
- [ ] Share with financial community
- [ ] Monitor error logs for first hour

### 3. Monitor First 24 Hours
- [ ] Check Vercel dashboard every hour
- [ ] Watch error tracking (Sentry/LogRocket)
- [ ] Monitor database performance
- [ ] Check uptime monitoring
- [ ] Respond to user feedback

---

## 🆘 Troubleshooting

### OAuth Not Working
**Fix**: 
- Verify `NEXTAUTH_URL` matches your domain (including protocol)
- Check redirect URI exactly matches in OAuth app settings
- Clear browser cookies and cache
- Test in incognito window

### Videos Not Loading
**Fix**:
- Check `CRON_SECRET` matches between `.env.local` and Vercel
- Verify cron job is running (check logs)
- Confirm database connection is working

### Slow Performance
**Fix**:
- Check Vercel Analytics → Slowest pages
- Verify images are optimized
- Check database query performance
- Enable CDN caching for static assets

### Database Connection Issues
**Fix**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection limits
# Increase pool size in Vercel Postgres settings
```

---

## 💰 Cost Estimate

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free-$150/mo | Free tier includes up to 100GB bandwidth |
| Vercel Postgres | Free-$35/mo | Free tier = 256MB storage |
| Domain | $10-15/yr | From GoDaddy, Namecheap, etc |
| Sentry | Free-$99/mo | Free tier sufficient for launch |
| Total | **$10-50/mo** | Scales with traffic |

---

## ✨ You're Live!

Congratulations! Financial Warfare is now live. 

**Next Steps After Launch:**
1. Monitor error logs for first week
2. Gather user feedback
3. Implement Phase 2 features (watchlist UI, email alerts)
4. Optimize based on analytics
5. Plan marketing campaign

**Support & Docs:**
- Vercel Docs: https://vercel.com/docs
- NextAuth Docs: https://next-auth.js.org
- PostgreSQL Docs: https://www.postgresql.org/docs

Good luck! 🚀
