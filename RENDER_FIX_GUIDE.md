# 🔴 RENDER Database Configuration Fix

## Problem
- App is live but 2 API endpoints return HTTP 500:
  - `/api/articles-list` 
  - `/api/weekly-outlook`
- Root cause: **DATABASE_URL not set in Render environment**

## Solution: 3-Step Fix

### STEP 1: Add PostgreSQL Database to Render (5 minutes)

1. Go to: https://dashboard.render.com
2. Select your **financial-warfare** service
3. Click **"Database"** tab (or **"Add"** → **"Add Database"**)
4. Click **"Create new PostgreSQL"**
   - Name: `financial-warfare-db` (or any name)
   - Database: `financial_warfare`
   - User: `postgres`
   - Region: Choose same as app
   - Plan: Free tier (available)
5. Click **"Create"**
6. **COPY the connection string** that appears (looks like `postgresql://user:pass@host:port/db`)

### STEP 2: Set DATABASE_URL Environment Variable

1. Still in Render dashboard, go to **Environment** tab
2. Find `DATABASE_URL` (should already be listed)
3. Paste the connection string from Step 1
4. Click **"Save"**
5. Wait for environment to update (should say "Applied")

### STEP 3: Verify & Redeploy

1. Click **"Redeploy"** button
2. Wait for deployment to complete (2-3 minutes)
3. Watch for this in logs:
   ```
   Running 'npx prisma migrate deploy'
   Prisma schema loaded from prisma/schema.prisma
   [migration_name] ... done in XXms
   Starting server on port 3000
   ```

---

## Verification Checklist

After deployment, test these endpoints:

### ✅ Homepage loads
```bash
curl https://financialwarfare.onrender.com
# Should see HTML content, no errors
```

### ✅ Articles endpoint works
```bash
curl https://financialwarfare.onrender.com/api/articles-list
# Should return JSON with articles array:
# {"articles": [...], "count": N}
```

### ✅ Weekly outlook endpoint works
```bash
curl https://financialwarfare.onrender.com/api/weekly-outlook
# Should return JSON with outlook data
```

### ✅ Check Render logs
1. Render Dashboard → your service → **"Logs"** tab
2. Search for "500" or "articles-list"
3. Should show no errors once database is connected

---

## Troubleshooting: If Still Getting 500 Errors

### A) Check PostgreSQL add-on status
1. Dashboard → your service → **"Database"** tab
2. Status should be **"Available"**
3. If "Creating", wait a few minutes

### B) Verify DATABASE_URL was applied
1. Go to **"Environment"** tab
2. Confirm `DATABASE_URL` shows your connection string
3. If blank, paste it again (Step 2)

### C) Check migration logs
1. Go to **"Logs"** tab
2. Look for lines starting with "Running" or "Prisma"
3. If you see errors like "Can't reach database":
   - DATABASE_URL might be wrong
   - Connection string needs exact format: `postgresql://user:password@host:port/database`

### D) Force redeploy
1. Click **"Redeploy"** again
2. This reruns migrations and startup commands

---

## Emergency: Reset Everything

If nothing works:

1. Delete the PostgreSQL database:
   - Dashboard → your service → Database tab → "Delete"
   
2. Disconnect the service:
   - Settings → Deployment → Disconnect
   
3. Reconnect and redeploy:
   - Click "Deploy"
   - Select repo and branch
   - Let Render auto-create everything

---

## Key Files Changed

These files were updated in the last session to use Prisma:

- ✅ `lib/prisma.ts` — Lazy-loaded Prisma client
- ✅ `app/api/articles-list/route.ts` — Uses getPrisma()
- ✅ `app/api/weekly-outlook/route.ts` — Uses getPrisma()
- ✅ `render.yaml` — StartCommand runs migrations
- ✅ `.env.local` — Local database URL (reference)

---

## Notes

- **render.yaml** defines: `startCommand: npx prisma migrate deploy && npm start`
  - This automatically runs migrations on every deployment
  - No manual migration commands needed

- **Free PostgreSQL on Render**:
  - 256 MB storage
  - Sufficient for testing/development
  - Upgrade to Starter ($15/mo) for production

- **Connection pooling**:
  - Render PostgreSQL handles this automatically
  - Our Prisma config uses `log: ["error"]` only

---

## Contact / Questions

If DATABASE_URL still isn't connecting after these steps:
1. Double-check the connection string format
2. Verify PostgreSQL add-on shows "Available"
3. Check Render logs for the exact error message
4. Contact Render support if database add-on is stuck

---

**Status**: Ready to fix — just need to add the database and set the env var! 🚀
