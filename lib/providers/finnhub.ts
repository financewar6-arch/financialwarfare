import type { AssetFeedData, RangeDays } from "./types";
import { fetchYahooOhlc } from "./yahoofinance";

// Finnhub's free tier gates /stock/candle behind a paid plan ("You don't have
// access to this resource"), so price/change/market-cap come from Finnhub but
// OHLC/history/volume are backfilled from Yahoo Finance's public chart
// endpoint (see yahoofinance.ts). If that backfill fails, we fall back to
// empty arrays, which the chart components already render as "AWAITING SIGNAL...".
export async function fetchFinnhubQuote(symbol: string, rangeDays: RangeDays): Promise<AssetFeedData> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    console.warn("FINNHUB_API_KEY is not set, using fallback data");
    // Fallback: return mock data when API key is not available
    const now = Date.now();
    const limit = rangeDays === "30" ? 30 : rangeDays === "7" ? 7 : 24;
    const mockPrice = 100 + Math.random() * 200;
    const mockHistory = Array.from({ length: limit }, (_, i) => ({
      t: now - (limit - i) * 3600 * 1000,
      p: mockPrice + (Math.random() - 0.5) * 20,
    }));
    const mockOhlc = mockHistory.map((h) => ({
      t: h.t,
      o: h.p + Math.random() * 10,
      h: h.p + Math.random() * 20,
      l: h.p - Math.random() * 20,
      c: h.p,
    }));
    return {
      price: mockPrice,
      change24h: (Math.random() - 0.5) * 10,
      volume24h: 1000000 + Math.random() * 5000000,
      volumeUnit: "shares",
      marketCap: null,
      history: mockHistory,
      ohlc: mockOhlc,
    };
  }

  try {
    const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, { cache: "no-store" });
    if (!quoteRes.ok) {
      throw new Error(`Finnhub quote unavailable (${quoteRes.status})`);
    }
    const quote = await quoteRes.json();
    if (quote.c == null || quote.c === 0) {
      throw new Error("Finnhub returned no quote for this symbol");
    }

    let marketCap: number | null = null;
    try {
      const metricRes = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`, {
        cache: "no-store",
      });
      if (metricRes.ok) {
        const metricJson = await metricRes.json();
        const capInMillions = metricJson?.metric?.marketCapitalization;
        if (typeof capInMillions === "number") {
          marketCap = capInMillions * 1_000_000;
        }
      }
    } catch {
      // Market cap is best-effort; the price quote is what actually matters.
    }

    let ohlc: AssetFeedData["ohlc"] = [];
    let history: AssetFeedData["history"] = [];
    let volume24h: number | null = null;
    try {
      const yahoo = await fetchYahooOhlc(symbol, rangeDays);
      ohlc = yahoo.ohlc;
      history = yahoo.history;
      volume24h = yahoo.volume24h;
    } catch {
      // Chart backfill is best-effort; the quote above is still valid without it.
    }

    return {
      price: quote.c,
      change24h: quote.dp,
      volume24h,
      volumeUnit: "shares",
      marketCap,
      history,
      ohlc,
    };
  } catch (error) {
    console.warn(`Finnhub unavailable for ${symbol}, using mock data:`, error);
    // Fallback to mock data
    const now = Date.now();
    const limit = rangeDays === "30" ? 30 : rangeDays === "7" ? 7 : 24;
    const mockPrice = 100 + Math.random() * 200;
    const mockHistory = Array.from({ length: limit }, (_, i) => ({
      t: now - (limit - i) * 3600 * 1000,
      p: mockPrice + (Math.random() - 0.5) * 20,
    }));
    const mockOhlc = mockHistory.map((h) => ({
      t: h.t,
      o: h.p + Math.random() * 10,
      h: h.p + Math.random() * 20,
      l: h.p - Math.random() * 20,
      c: h.p,
    }));
    return {
      price: mockPrice,
      change24h: (Math.random() - 0.5) * 10,
      volume24h: 1000000 + Math.random() * 5000000,
      volumeUnit: "shares",
      marketCap: null,
      history: mockHistory,
      ohlc: mockOhlc,
    };
  }
}
