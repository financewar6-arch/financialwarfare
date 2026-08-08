import type { OhlcPoint, RangeDays } from "./types";

// Unofficial but widely-used public endpoint, no key required. Used only to
// backfill OHLC/history/volume for symbols whose "real" provider (Finnhub)
// gates candles behind a paid plan. Cached in-memory since this endpoint has
// no published rate limit and being a good citizen matters more than freshness.
const INTRADAY_TTL_MS = 5 * 60 * 1000;
const DAILY_TTL_MS = 15 * 60 * 1000;

interface CacheEntry {
  fetchedAt: number;
  points: OhlcPoint[];
  latestVolume: number | null;
}

const cache = new Map<string, CacheEntry>();

async function fetchChart(symbol: string, range: string, interval: string): Promise<CacheEntry> {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`,
    { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0" } }
  );
  if (!res.ok) {
    throw new Error(`Yahoo Finance chart unavailable (${res.status})`);
  }
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) {
    throw new Error("Yahoo Finance returned no chart data");
  }

  const timestamps: number[] = result.timestamp ?? [];
  const quote = result.indicators?.quote?.[0] ?? {};
  const { open = [], high = [], low = [], close = [] } = quote as Record<string, (number | null)[]>;

  const points: OhlcPoint[] = timestamps
    .map((t, i) => ({ t: t * 1000, o: open[i], h: high[i], l: low[i], c: close[i] }))
    .filter((p): p is OhlcPoint => [p.o, p.h, p.l, p.c].every((v) => typeof v === "number"));

  // Use the day's cumulative regular-market volume, not a single bar's volume.
  const latestVolume: number | null = result.meta?.regularMarketVolume ?? null;

  return { fetchedAt: Date.now(), points, latestVolume };
}

async function getCached(symbol: string, bucket: "intraday" | "daily", range: string, interval: string, ttl: number) {
  const cacheKey = `${symbol}:${bucket}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < ttl) {
    return cached;
  }
  try {
    const fresh = await fetchChart(symbol, range, interval);
    cache.set(cacheKey, fresh);
    return fresh;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

export async function fetchYahooOhlc(symbol: string, rangeDays: RangeDays) {
  const entry =
    rangeDays === "1"
      ? await getCached(symbol, "intraday", "1d", "5m", INTRADAY_TTL_MS)
      : await getCached(symbol, "daily", "3mo", "1d", DAILY_TTL_MS);

  const points = rangeDays === "30" ? entry.points.slice(-30) : rangeDays === "7" ? entry.points.slice(-7) : entry.points;

  return {
    ohlc: points,
    history: points.map((p) => ({ t: p.t, p: p.c })),
    volume24h: entry.latestVolume,
  };
}
