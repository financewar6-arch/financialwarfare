# ⚡ QUICK START — Insert Articles NOW

## Copy-Paste These Commands (2 minutes)

### Step 1: Get Your Database URL

Go to Render Dashboard → PostgreSQL Database → **Connect** tab

Copy the **Internal Database URL** (looks like):
```
postgresql://username:password@dpg-xxxxxxx.internal/financial_warfare
```

### Step 2: Run the Insertion Script

**Windows (PowerShell or Command Prompt):**
```bash
cd C:\Users\test\Desktop\gemstone\financial-warfare
node insert-articles.js "postgresql://username:password@dpg-xxxxxxx.internal/financial_warfare"
```

**Mac/Linux:**
```bash
cd ~/path/to/financial-warfare
node insert-articles.js "postgresql://username:password@dpg-xxxxxxx.internal/financial_warfare"
```

Replace the URL with your actual Render connection string.

### Step 3: Verify Success

You should see:
```
✅ Connected to database
✅ Amazon article created
✅ Earnings article created
✅ Oil article created

🎉 SUCCESS! All articles inserted!
📊 Summary:
   Total articles created: 3
   Date: 2026-08-11

🔗 Your articles are now live at:
   📄 https://financialwarfare.onrender.com/daily-dispatch
   🏠 Homepage widget: 'Today's Battle Brief'
```

### Step 4: Check Your Website

1. Visit: `https://financialwarfare.onrender.com/daily-dispatch`
2. Scroll homepage to see "Today's Battle Brief" widget
3. ✅ Done! Articles are live

---

## 🚨 If You Get an Error

### "DATABASE_URL not provided"
```bash
# Copy the URL from Render Dashboard → PostgreSQL → Connect
# Include the full URL in quotes
node insert-articles.js "postgresql://..."
```

### "Connection refused" or "Cannot connect"
1. Check PostgreSQL is running in Render Dashboard
2. Verify you're using the **Internal** Database URL (not external)
3. Check username/password are correct

### "Table does not exist"
Run this in Render → PostgreSQL → Browser:
```bash
npm install -g @prisma/cli
npx prisma migrate deploy --skip-generate
```

### "Prisma not found"
```bash
npm install
node insert-articles.js "postgresql://..."
```

---

## ✅ Verification

After running the script, verify in Render → PostgreSQL → Browser:

```sql
SELECT COUNT(*) as count 
FROM "DailyDispatchArticle" 
WHERE "publishedAt" >= '2026-08-11'::date;
```

Should return: **3**

---

## 📱 Final Check

Visit your website:
- **Daily Dispatch Page:** `https://financialwarfare.onrender.com/daily-dispatch`
  - Should show 3 articles (newest first)
  - Market Impact boxes highlighted
  - Tactical Position boxes highlighted
  - Key Numbers as pills/tags

- **Homepage Widget:** `https://financialwarfare.onrender.com`
  - Scroll to find "🔥 Daily Dispatch — Today's Battle Brief"
  - Widget shows latest 3 articles
  - Auto-refreshes every 5 minutes

---

## 🎉 You're Done!

Articles are now:
✅ In database permanently
✅ Live on your website
✅ Showing in homepage widget
✅ Auto-refreshing every 5 minutes
✅ Sorted newest-first

No additional work needed. Articles will stay on the site forever.

---

## 💡 Next Steps (Optional)

If you want to automate daily article posting:
- See `BACKEND_IMPLEMENTATION_GUIDE.md` for Path 3 (API automation)
- Set up a cron job to run this script daily
- Or use GitHub Actions to auto-post articles

---

**Questions?** See `RENDER_DATABASE_SETUP.md` for detailed troubleshooting.
