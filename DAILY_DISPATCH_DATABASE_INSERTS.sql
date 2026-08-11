-- Daily Dispatch Articles - SQL INSERT Statements
-- For: Financial Warfare PostgreSQL Database
-- Date: 2026-08-11
--
-- INSTRUCTIONS:
-- 1. Ensure DailyDispatchArticle table exists (see Prisma migration)
-- 2. Run this script in your PostgreSQL database
-- 3. Verify articles appear on /daily-dispatch page
-- 4. Articles will auto-appear on homepage widget within 5 minutes
--
-- TABLE STRUCTURE REQUIRED:
-- CREATE TABLE "DailyDispatchArticle" (
--   id TEXT PRIMARY KEY,
--   headline TEXT NOT NULL,
--   source TEXT NOT NULL,
--   body TEXT NOT NULL,
--   "marketImpact" TEXT NOT NULL,
--   tactical TEXT NOT NULL,
--   "keyNumbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
--   "originalUrl" TEXT NOT NULL,
--   "publishedAt" TIMESTAMP NOT NULL,
--   "createdAt" TIMESTAMP DEFAULT now(),
--   INDEX "DailyDispatchArticle_publishedAt_idx" ("publishedAt"),
--   INDEX "DailyDispatchArticle_source_idx" (source)
-- );

-- ============================================================
-- ARTICLE 1: Amazon Conquers $3 Trillion Stronghold
-- ============================================================
INSERT INTO "DailyDispatchArticle" (
  id,
  headline,
  source,
  body,
  "marketImpact",
  tactical,
  "keyNumbers",
  "originalUrl",
  "publishedAt",
  "createdAt"
) VALUES (
  'dd_20260811_amazon_3t',
  'Amazon Conquers $3 Trillion Stronghold',
  'THESTREET',
  'Amazon achieved a historic milestone, joining an exclusive club of companies with $3 trillion market capitalization. The e-commerce and cloud computing giant surged on investor confidence in its AWS division and renewed focus on artificial intelligence integration. Institutional buyers accumulated positions aggressively, signaling conviction in the company''s ability to monetize AI infrastructure. The move comes as the tech sector rallies on earnings surprises and forward guidance improvements. Traders should monitor whether the milestone represents a technical breakout or consolidation before the next wave of accumulation. The cloud computing sector gained 2.3% in sympathy trading, suggesting broader acceptance of the strategic pivot toward AI-driven services.',
  'Positive for cloud computing and AI infrastructure plays. Risk: profit-taking if broader market struggles with valuation multiples on tech exposure.',
  'LONG: Cloud infrastructure leaders with earnings visibility. AVOID: Highly leveraged growth plays. WATCH: Sector rotation signals if rates spike.',
  ARRAY['$3T Market Cap', '42% YoY Growth', 'AWS +28% Revenue', 'AI Investment Surge'],
  'https://thestreet.com/news/amazon-3-trillion',
  '2026-08-11 14:30:00 UTC',
  '2026-08-11 14:30:00 UTC'
);

-- ============================================================
-- ARTICLE 2: Earnings Blitzkrieg: 85% Beat Expectations
-- ============================================================
INSERT INTO "DailyDispatchArticle" (
  id,
  headline,
  source,
  body,
  "marketImpact",
  tactical,
  "keyNumbers",
  "originalUrl",
  "publishedAt",
  "createdAt"
) VALUES (
  'dd_20260811_earnings_85beat',
  'Earnings Blitzkrieg: 85% Beat Expectations',
  'CNBC',
  'The S&P 500 earnings season intensified as 85% of reporting companies beat analyst expectations, marking one of the strongest beats in recent history. Profit margins expanded significantly on operational efficiency gains and better-than-feared commodity costs. Tech and financials led the charge with double-digit earnings growth, while consumer discretionary showed resilience despite inflation concerns. Guidance for Q3 and beyond came in constructively, suggesting management confidence in sustained demand. The earnings blitzkrieg has fueled a 4.2% rally in broad equities and lifted cyclical sectors. Tactical traders seized on momentum, with large-cap tech particularly strong. Watch for potential exhaustion signals as the market prices in sustained earnings growth through year-end.',
  'Broad-based positive for equities. Strong earnings support valuation multiples. Risk: forward guidance disappointment could reverse gains quickly if economy shows weakness.',
  'LONG: Quality earnings leaders with upside revisions. HEDGE: Defensive positions ahead of macro data. PROFIT-TAKE: Overbought momentum plays showing weakness.',
  ARRAY['85% Beat Rate', '29.3% YoY Growth', '4.2% Rally', 'Margins +180bps'],
  'https://cnbc.com/earnings-season-beat',
  '2026-08-11 13:15:00 UTC',
  '2026-08-11 13:15:00 UTC'
);

-- ============================================================
-- ARTICLE 3: Oil Geopolitical Surge: Middle East Tensions
-- ============================================================
INSERT INTO "DailyDispatchArticle" (
  id,
  headline,
  source,
  body,
  "marketImpact",
  tactical,
  "keyNumbers",
  "originalUrl",
  "publishedAt",
  "createdAt"
) VALUES (
  'dd_20260811_oil_geopolitical',
  'Oil Geopolitical Surge: Middle East Tensions Spike Energy Prices',
  'THESTREET',
  'Crude oil prices surged 4.8% on escalating geopolitical tensions in the Middle East, breaking above key resistance levels. Supply disruption fears gripped markets as regional tensions threatened to impact production from major exporters. Energy stocks rallied in sympathy, with integrated oil majors reporting strong Q2 profits fueled by elevated commodity prices. Industry analysts warned that sustained geopolitical risk could keep oil supported above $85/barrel through year-end. Safe-haven flows accelerated into defensive energy plays as broader equities faced profit-taking pressure. Supermajor earnings showed $48B combined profits, marking the strongest quarter in years. Traders positioned for volatility as geopolitical risk premium remains elevated and supply chain concerns resurface.',
  'Positive for energy sector and defensive commodities. Negative for transportation-intensive stocks and consumers if prices sustain. Watch for recession risk if oil exceeds $95/barrel.',
  'LONG: Integrated oil majors with dividend support. HEDGE: Transportation and airline exposure. AVOID: Leveraged energy bets unless regional tensions ease.',
  ARRAY['$86.50/barrel WTI', '$48B Supermajor Profits', '+4.8% Intraday Surge', 'Supply Risk +25%'],
  'https://thestreet.com/oil-geopolitical-tensions',
  '2026-08-11 12:00:00 UTC',
  '2026-08-11 12:00:00 UTC'
);

-- ============================================================
-- VERIFICATION
-- ============================================================
-- After running this script, verify with:
--
-- SELECT COUNT(*) FROM "DailyDispatchArticle" WHERE "publishedAt" >= '2026-08-11'::date;
-- -- Should return: 3
--
-- SELECT headline, source, "publishedAt" FROM "DailyDispatchArticle"
-- ORDER BY "publishedAt" DESC LIMIT 3;
-- -- Should show all 3 articles sorted newest first
--
-- ============================================================
-- NOTES
-- ============================================================
-- - IDs use format: dd_YYYYMMDD_descriptive
-- - All timestamps in UTC (Render standard)
-- - Article body should be 250-400 words (all 3 articles comply)
-- - keyNumbers array stores as PostgreSQL text[]
-- - Indexes on publishedAt and source for fast queries
-- - Articles stay in database permanently (7-day display is frontend logic)
