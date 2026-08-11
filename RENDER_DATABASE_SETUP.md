# Path 2: Database Integration — Render Setup

## Quick Setup (30 minutes)

### Step 1: Get Render Database Connection

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your PostgreSQL database
3. Copy the **Internal Database URL** (starts with `postgresql://`)
   - Example: `postgresql://username:password@dpg-xxx.internal/financial_warfare`

### Step 2: Run the SQL Script

#### Option A: Render Web Browser (Easiest)

1. In Render Dashboard, go to your PostgreSQL database
2. Click the **"Browser"** tab (if available)
3. You'll see a SQL query editor
4. Open file: `DAILY_DISPATCH_DATABASE_INSERTS.sql`
5. Copy all the SQL code
6. Paste into Render's query editor
7. Click **Run** or **Execute**
8. Should see: `INSERT 0 1` three times (one for each article)

#### Option B: psql Command Line

```bash
# Navigate to the project
cd C:\Users\test\Desktop\gemstone\financial-warfare

# Run the SQL script
psql "your_connection_string_here" -f DAILY_DISPATCH_DATABASE_INSERTS.sql
```

Replace `your_connection_string_here` with the Internal Database URL from Render.

### Step 3: Verify Articles Were Created

In Render Browser or psql, run:

```sql
SELECT COUNT(*) as article_count 
FROM "DailyDispatchArticle" 
WHERE "publishedAt" >= '2026-08-11'::date;
```

**Expected Result:** `3`

### Step 4: Check the Website

Visit: `https://financialwarfare.onrender.com/daily-dispatch`

**Expected:** All 3 articles display (newest first)

### Step 5: Check Homepage Widget

Visit: `https://financialwarfare.onrender.com`

Scroll down to find **"Today's Battle Brief"** section.

**Expected:** Widget shows the 3 new articles

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Permission denied" on psql | Check you have database access, use Internal URL |
| "Table does not exist" | Prisma migration hasn't run — run `npx prisma migrate deploy` on Render |
| Articles don't appear on website | Clear browser cache, wait 5 minutes for widget refresh |
| "Connection refused" | Verify Render PostgreSQL is running (check dashboard) |

---

## Files You Need

- `DAILY_DISPATCH_DATABASE_INSERTS.sql` — The SQL script to run
- This guide — Step-by-step instructions

---

## Timeline

- **Copy SQL:** 1 minute
- **Paste into Render:** 1 minute  
- **Run script:** 1 minute
- **Verify in database:** 2 minutes
- **Check website:** 2 minutes
- **Total:** ~7 minutes (then reload website to see it)

---

## Done!

Once articles appear on the website, you're all set. They're now permanent and will show on:
- `/daily-dispatch` page
- Homepage "Today's Battle Brief" widget
- Auto-refresh every 5 minutes

No additional work needed — articles are live! 🚀
