import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function insertDailyDispatchArticles() {
  console.log("🚀 Inserting Daily Dispatch articles...\n");

  try {
    // Article 1: Amazon
    const article1 = await prisma.dailyDispatchArticle.create({
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
    console.log(`✅ Article 1 created: "${article1.headline}"`);

    // Article 2: Earnings
    const article2 = await prisma.dailyDispatchArticle.create({
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
    console.log(`✅ Article 2 created: "${article2.headline}"`);

    // Article 3: Oil
    const article3 = await prisma.dailyDispatchArticle.create({
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
    console.log(`✅ Article 3 created: "${article3.headline}"`);

    // Verify
    console.log("\n📊 Verifying insertion...");
    const count = await prisma.dailyDispatchArticle.count({
      where: {
        publishedAt: {
          gte: new Date("2026-08-11T00:00:00Z"),
        },
      },
    });

    console.log(`✅ Total articles created today: ${count}`);
    console.log(
      "\n🎉 SUCCESS! Articles are now live on your website:"
    );
    console.log("   📄 /daily-dispatch");
    console.log("   🏠 Homepage widget (Today's Battle Brief)");
    console.log("\n📱 Next steps:");
    console.log("   1. Visit https://financialwarfare.onrender.com/daily-dispatch");
    console.log("   2. Scroll homepage to see 'Today's Battle Brief' widget");
    console.log("   3. Articles will auto-refresh every 5 minutes\n");
  } catch (error) {
    console.error("❌ Error inserting articles:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

insertDailyDispatchArticles();
