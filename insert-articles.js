#!/usr/bin/env node

/**
 * Daily Dispatch Article Insertion Script
 * Usage: node insert-articles.js "your_render_database_url"
 *
 * Example:
 * node insert-articles.js "postgresql://user:pass@dpg-xxx.internal/financial_warfare"
 */

const { PrismaClient } = require("@prisma/client");

async function insertArticles() {
  console.log("🚀 Daily Dispatch Article Insertion\n");

  // Get database URL from command line or environment
  const dbUrl =
    process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error(
      "❌ Error: DATABASE_URL not provided.\n" +
        "Usage: node insert-articles.js \"your_database_url\"\n\n" +
        "Get your Render database URL from:\n" +
        "1. Render Dashboard → PostgreSQL database\n" +
        "2. Copy the 'Internal Database URL'\n" +
        "3. Run: node insert-articles.js \"postgresql://...\"\n"
    );
    process.exit(1);
  }

  console.log("📡 Connecting to database...");

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  try {
    // Check connection
    await prisma.$executeRawUnsafe("SELECT NOW()");
    console.log("✅ Connected to database\n");

    console.log("📝 Inserting articles...\n");

    // Article 1
    await prisma.dailyDispatchArticle.create({
      data: {
        headline: "Amazon Conquers $3 Trillion Stronghold",
        source: "THESTREET",
        body: "Amazon achieved a historic milestone, joining an exclusive club of companies with $3 trillion market capitalization. The e-commerce and cloud computing giant surged on investor confidence in its AWS division and renewed focus on artificial intelligence integration. Institutional buyers accumulated positions aggressively, signaling conviction in the company's ability to monetize AI infrastructure. The move comes as the tech sector rallies on earnings surprises and forward guidance improvements. Traders should monitor whether the milestone represents a technical breakout or consolidation before the next wave of accumulation. The cloud computing sector gained 2.3% in sympathy trading, suggesting broader acceptance of the strategic pivot toward AI-driven services.",
        marketImpact:
          "Positive for cloud computing and AI infrastructure plays. Risk: profit-taking if broader market struggles with valuation multiples on tech exposure.",
        tactical:
          "LONG: Cloud infrastructure leaders with earnings visibility. AVOID: Highly leveraged growth plays. WATCH: Sector rotation signals if rates spike.",
        keyNumbers: [
          "$3T Market Cap",
          "42% YoY Growth",
          "AWS +28% Revenue",
          "AI Investment Surge",
        ],
        originalUrl: "https://thestreet.com/news/amazon-3-trillion",
        publishedAt: new Date("2026-08-11T14:30:00Z"),
      },
    });
    console.log("✅ Amazon article created");

    // Article 2
    await prisma.dailyDispatchArticle.create({
      data: {
        headline: "Earnings Blitzkrieg: 85% Beat Expectations",
        source: "CNBC",
        body: "The S&P 500 earnings season intensified as 85% of reporting companies beat analyst expectations, marking one of the strongest beats in recent history. Profit margins expanded significantly on operational efficiency gains and better-than-feared commodity costs. Tech and financials led the charge with double-digit earnings growth, while consumer discretionary showed resilience despite inflation concerns. Guidance for Q3 and beyond came in constructively, suggesting management confidence in sustained demand. The earnings blitzkrieg has fueled a 4.2% rally in broad equities and lifted cyclical sectors. Tactical traders seized on momentum, with large-cap tech particularly strong. Watch for potential exhaustion signals as the market prices in sustained earnings growth through year-end.",
        marketImpact:
          "Broad-based positive for equities. Strong earnings support valuation multiples. Risk: forward guidance disappointment could reverse gains quickly if economy shows weakness.",
        tactical:
          "LONG: Quality earnings leaders with upside revisions. HEDGE: Defensive positions ahead of macro data. PROFIT-TAKE: Overbought momentum plays showing weakness.",
        keyNumbers: [
          "85% Beat Rate",
          "29.3% YoY Growth",
          "4.2% Rally",
          "Margins +180bps",
        ],
        originalUrl: "https://cnbc.com/earnings-season-beat",
        publishedAt: new Date("2026-08-11T13:15:00Z"),
      },
    });
    console.log("✅ Earnings article created");

    // Article 3
    await prisma.dailyDispatchArticle.create({
      data: {
        headline:
          "Oil Geopolitical Surge: Middle East Tensions Spike Energy Prices",
        source: "THESTREET",
        body: "Crude oil prices surged 4.8% on escalating geopolitical tensions in the Middle East, breaking above key resistance levels. Supply disruption fears gripped markets as regional tensions threatened to impact production from major exporters. Energy stocks rallied in sympathy, with integrated oil majors reporting strong Q2 profits fueled by elevated commodity prices. Industry analysts warned that sustained geopolitical risk could keep oil supported above $85/barrel through year-end. Safe-haven flows accelerated into defensive energy plays as broader equities faced profit-taking pressure. Supermajor earnings showed $48B combined profits, marking the strongest quarter in years. Traders positioned for volatility as geopolitical risk premium remains elevated and supply chain concerns resurface.",
        marketImpact:
          "Positive for energy sector and defensive commodities. Negative for transportation-intensive stocks and consumers if prices sustain. Watch for recession risk if oil exceeds $95/barrel.",
        tactical:
          "LONG: Integrated oil majors with dividend support. HEDGE: Transportation and airline exposure. AVOID: Leveraged energy bets unless regional tensions ease.",
        keyNumbers: [
          "$86.50/barrel WTI",
          "$48B Supermajor Profits",
          "+4.8% Intraday Surge",
          "Supply Risk +25%",
        ],
        originalUrl: "https://thestreet.com/oil-geopolitical-tensions",
        publishedAt: new Date("2026-08-11T12:00:00Z"),
      },
    });
    console.log("✅ Oil article created\n");

    // Verify
    const count = await prisma.dailyDispatchArticle.count({
      where: {
        publishedAt: {
          gte: new Date("2026-08-11T00:00:00Z"),
        },
      },
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 SUCCESS! All articles inserted!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("📊 Summary:");
    console.log(`   Total articles created: ${count}`);
    console.log(`   Date: 2026-08-11\n`);

    console.log("🔗 Your articles are now live at:");
    console.log("   📄 https://financialwarfare.onrender.com/daily-dispatch");
    console.log("   🏠 Homepage widget: 'Today's Battle Brief'\n");

    console.log("✨ Articles will:");
    console.log("   • Display in newest-first order");
    console.log("   • Show Market Impact & Tactical Position");
    console.log("   • Auto-refresh homepage widget every 5 minutes");
    console.log("   • Stay permanent in database\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\nTroubleshooting:");
    console.error("   • Check DATABASE_URL is correct");
    console.error("   • Verify PostgreSQL is running");
    console.error("   • Ensure Prisma migrations ran: npx prisma migrate deploy");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

insertArticles();
