# 🚀 Financial Warfare - Quick Start (30 Minutes to Live)

## STEP 1: OAuth Setup (15 min)

### Google OAuth
```
1. Visit: https://console.cloud.google.com/
2. Create new project: "Financial Warfare"
3. Go to APIs & Services → Credentials
4. Click Create Credentials → OAuth client ID
5. Select "Web application"
6. Add Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://yourdomain.com/api/auth/callback/google
7. COPY: Client ID and Client Secret
```

### GitHub OAuth
```
1. Visit: https://github.com/settings/apps
2. Click "New GitHub App"
3. Fill in:
   - App name: Financial Warfare
   - Homepage URL: https://yourdomain.com
   - Authorization callback URL: https://yourdomain.com/api/auth/callback/github
4. COPY: Client ID and Client Secret
```

### Save Credentials
```
Create .env.local in project root with:

NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<paste>
GOOGLE_CLIENT_SECRET=<paste>
GITHUB_CLIENT_ID=<paste>
GITHUB_CLIENT_SECRET=<paste>
ALPHA_VANTAGE_API_KEY=<your-key>
FINNHUB_API_KEY=<your-key>
NEWS_API_KEY=<your-key>
CRON_SECRET=<run: openssl rand -base64 32>
```

---

## STEP 2: Choose Hosting & Deploy (10 min)

### ✅ EASIEST: Vercel

```bash
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Select your Financial Warfare GitHub repo
5. Click "Import"
6. Set Environment Variables in Vercel dashboard:
   - Add all variables from .env.local
7. Click "Deploy"
8. Wait ~2 minutes
9. Get production URL
```

### Alternative: Railway
```bash
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add PostgreSQL
5. Set environment variables
6. Deploy
```

### Alternative: AWS
```bash
1. Create AWS account
2. Deploy with Amplify
3. More complex but more control
```

---

## STEP 3: Add Custom Domain (5 min)

### For Vercel:
```
1. Vercel dashboard → Settings → Domains
2. Add your domain
3. Update nameservers at domain registrar
4. Wait 24-48 hours for DNS
```

---

## STEP 4: Update OAuth Redirect URIs

### Google Console:
```
Go back to: https://console.cloud.google.com/
- Edit OAuth client
- ADD new URI: https://yourdomain.com/api/auth/callback/google
```

### GitHub:
```
Go back to: https://github.com/settings/apps
- Edit your app
- Update callback URL to: https://yourdomain.com/api/auth/callback/github
```

---

## STEP 5: Test Everything (5 min)

```
Visit: https://yourdomain.com

✅ Homepage loads
✅ Click SIGN IN
✅ Test Google sign-in (redirects to homepage)
✅ Test GitHub sign-in (redirects to homepage)
✅ Test Email/Password demo
✅ Click war room (Apple, Bitcoin, Gold)
✅ Videos load on DAILY NEWS
✅ Search works
✅ Dark/Light mode toggle works
✅ Mobile responsive (F12 → Ctrl+Shift+M)
✅ 404 page (visit /nonexistent)
```

---

## STEP 6: Go Live! ✨

```
Congratulations! Your site is now live at:
https://yourdomain.com

Next Steps:
1. Monitor error logs (Vercel dashboard → Deployments)
2. Test with real users
3. Add email notifications (Phase 2)
4. Add watchlist UI components (Phase 2)
```

---

## 🆘 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| OAuth not working | Clear cookies, test incognito, verify redirect URI matches exactly |
| Videos not loading | Check .env vars are set, wait for cron job to run |
| Slow performance | Check Vercel Analytics, verify database connection |
| 502 errors | Check Vercel logs, TypeScript type errors? |
| Domain not resolving | DNS takes 24-48 hours, verify nameservers in registrar |

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Deployment Guide**: See DEPLOYMENT_GUIDE.md for detailed steps

---

## Timeline

- ⏱️ **15 min**: OAuth setup
- ⏱️ **10 min**: Deploy to Vercel
- ⏱️ **5 min**: Custom domain
- ⏱️ **5 min**: Testing
- **TOTAL: ~35 minutes to LIVE** 🎉

START NOW! 🚀
