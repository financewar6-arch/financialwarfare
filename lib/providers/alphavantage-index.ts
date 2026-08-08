import type { AssetFeedData, RangeDays } from "./types";
import { fetchYahooOhlc } from "./yahoofinance";

// Nasdaq-100 uses the same data source as stocks (Yahoo Finance)
export async function fetchNasdaqIndex(rangeDays: RangeDays): Promise<AssetFeedData> {
  const range = rangeDays === "1" ? "1mo" : rangeDays === "7" ? "3mo" : "1y";
  const data = await fetchYahooOhlc("^NDX", range);

  if (!data.history.length) {
    throw new Error("No Nasdaq index data");
  }

  const latestPrice = data.history[data.history.length - 1];
  const previousPrice = data.history[data.history.length - 2] || latestPrice;
  const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;

  return {
    price: latestPrice.p,
    change24h,
    volume24h: null,
    volumeUnit: "usd",
    marketCap: null,
    ohlc: data.ohlc,
    history: data.history,
  };
}
