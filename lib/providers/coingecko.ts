import type { AssetFeedData, RangeDays } from "./types";

// CoinGecko's public endpoint is free and CORS-friendly, but this still runs
// server-side (called from our route handler) so every provider follows the
// same "keys and fetch logic never reach the client" shape.
const BASE = "https://api.coingecko.com/api/v3";

export async function fetchCoinGecko(coinId: string, rangeDays: RangeDays): Promise<AssetFeedData> {
  const [priceRes, chartRes, ohlcRes] = await Promise.all([
    fetch(
      `${BASE}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      { cache: "no-store" }
    ),
    fetch(`${BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${rangeDays}`, { cache: "no-store" }),
    fetch(`${BASE}/coins/${coinId}/ohlc?vs_currency=usd&days=${rangeDays}`, { cache: "no-store" }),
  ]);

  if (!priceRes.ok) {
    throw new Error(`CoinGecko price feed unavailable (${priceRes.status})`);
  }
  const priceJson = await priceRes.json();
  const coin = priceJson[coinId];
  if (!coin) {
    throw new Error("CoinGecko returned no data for this asset");
  }

  let history: AssetFeedData["history"] = [];
  if (chartRes.ok) {
    const chartJson = await chartRes.json();
    history = ((chartJson.prices ?? []) as [number, number][]).map(([t, p]) => ({ t, p }));
  }

  let ohlc: AssetFeedData["ohlc"] = [];
  if (ohlcRes.ok) {
    const ohlcJson = await ohlcRes.json();
    ohlc = ((ohlcJson ?? []) as [number, number, number, number, number][]).map(([t, o, h, l, c]) => ({
      t,
      o,
      h,
      l,
      c,
    }));
  }

  return {
    price: coin.usd,
    change24h: coin.usd_24h_change,
    volume24h: coin.usd_24h_vol,
    volumeUnit: "usd",
    marketCap: coin.usd_market_cap,
    history,
    ohlc,
  };
}
