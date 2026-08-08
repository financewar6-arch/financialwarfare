export interface OhlcPoint {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface HistoryPoint {
  t: number;
  p: number;
}

export interface AssetFeedData {
  price: number;
  change24h: number;
  // Not every provider has these (forex/commodities have no volume or market
  // cap; Finnhub's free tier doesn't expose either for stocks) — null means
  // "not applicable for this asset", rendered as "--" rather than "$--".
  volume24h: number | null;
  // Crypto volume is dollar-denominated; equity volume is share count. The
  // unit changes how the readout row labels it ("$21.72B" vs "34.33M SH").
  volumeUnit: "usd" | "shares";
  marketCap: number | null;
  history: HistoryPoint[];
  ohlc: OhlcPoint[];
}

export type RangeDays = "1" | "7" | "30";
