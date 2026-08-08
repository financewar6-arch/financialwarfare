// Binance API Provider - Free, reliable, professional-grade crypto data
// No API key required, rate limit: 1200 requests/minute (vs CoinGecko's 10-50)
// Used by professional traders worldwide

import type { AssetFeedData, OhlcPoint } from "./types";

const BASE_URL = "https://api.binance.com/api/v3";

// Map asset symbols to Binance trading pairs
const SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BTCUSDT",
  ethereum: "ETHUSDT",
  solana: "SOLUSDT",
  ripple: "XRPUSDT",
  xrp: "XRPUSDT",
  cardano: "ADAUSDT",
  litecoin: "LTCUSDT",
  dogecoin: "DOGEUSDT",
  polkadot: "DOTUSDT",
  bnb: "BNBUSDT",
  bitcoincash: "BCHUSDT",
};

interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
}

interface BinanceKline {
  [0]: number; // Open time
  [1]: string; // Open
  [2]: string; // High
  [3]: string; // Low
  [4]: string; // Close
  [5]: string; // Volume
  [6]: number; // Close time
  [7]: string; // Quote asset volume
  [8]: number; // Number of trades
  [9]: string; // Taker buy base asset volume
  [10]: string; // Taker buy quote asset volume
  [11]: string; // Ignore
}

export async function fetchBinancePrice(assetSymbol: string): Promise<{ price: number; change24h: number; volume: number }> {
  // Normalize symbol: remove suffixes like -USD
  const normalizedSymbol = assetSymbol.split(/[-=]/)[0].toLowerCase();
  const pair = SYMBOL_MAP[normalizedSymbol];
  if (!pair) {
    throw new Error(`No Binance pair for ${assetSymbol}`);
  }

  try {
    const response = await fetch(`${BASE_URL}/ticker/24hr?symbol=${pair}`, {
      headers: { "User-Agent": "financial-warfare/1.0" },
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data: BinanceTicker = await response.json();

    return {
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
    };
  } catch (error) {
    console.error(`Binance fetch failed for ${pair}:`, error);
    throw error;
  }
}

export async function fetchBinanceOHLCV(assetSymbol: string, rangeDays: string): Promise<AssetFeedData> {
  // Normalize symbol: remove suffixes like -USD
  const normalizedSymbol = assetSymbol.split(/[-=]/)[0].toLowerCase();
  const pair = SYMBOL_MAP[normalizedSymbol];
  if (!pair) {
    throw new Error(`No Binance pair for ${assetSymbol}`);
  }

  // Map range to Binance interval
  const intervalMap: Record<string, { interval: string; limit: number }> = {
    "1": { interval: "1h", limit: 24 }, // 24 hours
    "7": { interval: "1d", limit: 7 }, // 7 days
    "30": { interval: "1d", limit: 30 }, // 30 days
  };

  const { interval, limit } = intervalMap[rangeDays] || { interval: "1d", limit: 30 };

  try {
    const response = await fetch(
      `${BASE_URL}/klines?symbol=${pair}&interval=${interval}&limit=${limit}`,
      {
        headers: { "User-Agent": "financial-warfare/1.0" },
      }
    );

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const klines: BinanceKline[] = await response.json();

    if (klines.length === 0) {
      throw new Error(`No data for ${pair}`);
    }

    // Convert to OHLC points
    const ohlcPoints: OhlcPoint[] = klines.map((k) => ({
      o: parseFloat(k[1]), // Open
      h: parseFloat(k[2]), // High
      l: parseFloat(k[3]), // Low
      c: parseFloat(k[4]), // Close
      v: parseFloat(k[5]), // Volume
    }));

    // Get current price (latest close)
    const latestPrice = parseFloat(klines[klines.length - 1][4]);

    // Calculate 24h change
    const oldestClose = parseFloat(klines[0][4]);
    const change24h = ((latestPrice - oldestClose) / oldestClose) * 100;

    // Build history array for sparklines
    const history = klines.map((k) => ({
      t: k[0], // timestamp
      p: parseFloat(k[4]), // close price
    }));

    return {
      price: latestPrice,
      change24h,
      ohlc: ohlcPoints,
      history,
      volume24h: parseFloat(klines[klines.length - 1][7]), // Quote asset volume
      volumeUnit: "USD",
      marketCap: null, // Binance doesn't provide market cap in OHLC endpoint
    };
  } catch (error) {
    console.error(`Binance OHLCV fetch failed for ${pair}:`, error);
    throw error;
  }
}
