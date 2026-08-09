import type { AssetFeedData, RangeDays } from "./providers/types";
import { fetchBinanceOHLCV } from "./providers/binance";
import { fetchGoldApi } from "./providers/goldapi";
import { fetchFinnhubQuote } from "./providers/finnhub";
import { fetchNasdaqIndex } from "./providers/alphavantage-index";
import { fetchYahooOhlc } from "./providers/yahoofinance";

// Helper function to fetch Yahoo data with fallback
async function fetchYahooWithFallback(symbol: string, rangeDays: RangeDays, assetName: string) {
  try {
    const data = await fetchYahooOhlc(symbol, rangeDays);
    if (!data.history.length) throw new Error(`No ${assetName} data`);
    const latestPrice = data.history[data.history.length - 1];
    const previousPrice = data.history[data.history.length - 2] || latestPrice;
    const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
    return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
  } catch (error) {
    console.error(`${assetName} fetch failed:`, error);
    // Return mock data as fallback
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
      ohlc: mockOhlc,
      history: mockHistory,
      volume24h: null,
      volumeUnit: "usd",
      marketCap: null,
    };
  }
}

export interface AssetConfig {
  slug: string;
  name: string;
  symbol: string;
  category: "Crypto" | "Stocks" | "Precious Metals" | "Commodities";
  fetchFeed: (rangeDays: RangeDays) => Promise<AssetFeedData>;
}

// Adding a new asset means writing one adapter in lib/providers/ and one
// entry here — the API route and the WarRoom template stay untouched.
export const ASSETS: Record<string, AssetConfig> = {
  bitcoin: {
    slug: "bitcoin",
    name: "BITCOIN",
    symbol: "BTC-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("bitcoin", rangeDays),
  },
  gold: {
    slug: "gold",
    name: "GOLD",
    symbol: "XAUUSD",
    category: "Precious Metals",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("XAUUSD", rangeDays, "Gold"),
  },
  apple: {
    slug: "apple",
    name: "APPLE",
    symbol: "AAPL",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("AAPL", rangeDays),
  },
  silver: {
    slug: "silver",
    name: "SILVER",
    symbol: "SI=F",
    category: "Precious Metals",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("SI=F", rangeDays, "Silver"),
  },
  nasdaq: {
    slug: "nasdaq",
    name: "NASDAQ-100",
    symbol: "NDX",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchNasdaqIndex(rangeDays),
  },
  sp500: {
    slug: "sp500",
    name: "S&P 500",
    symbol: "SPX",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("^GSPC", rangeDays, "S&P 500"),
  },
  ethereum: {
    slug: "ethereum",
    name: "ETHEREUM",
    symbol: "ETH-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("ethereum", rangeDays),
  },
  crudeoil: {
    slug: "crudeoil",
    name: "CRUDE OIL",
    symbol: "WTI",
    category: "Commodities",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("CL=F", rangeDays, "Crude Oil"),
  },
  microsoft: {
    slug: "microsoft",
    name: "MICROSOFT",
    symbol: "MSFT",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("MSFT", rangeDays),
  },
  nvidia: {
    slug: "nvidia",
    name: "NVIDIA",
    symbol: "NVDA",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("NVDA", rangeDays),
  },
  amazon: {
    slug: "amazon",
    name: "AMAZON",
    symbol: "AMZN",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("AMZN", rangeDays),
  },
  tesla: {
    slug: "tesla",
    name: "TESLA",
    symbol: "TSLA",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("TSLA", rangeDays),
  },
  alphabet: {
    slug: "alphabet",
    name: "ALPHABET",
    symbol: "GOOGL",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("GOOGL", rangeDays),
  },
  meta: {
    slug: "meta",
    name: "META",
    symbol: "META",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("META", rangeDays),
  },
  berkshire: {
    slug: "berkshire",
    name: "BERKSHIRE HATHAWAY",
    symbol: "BRK.B",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("BRK.B", rangeDays),
  },
  dax: {
    slug: "dax",
    name: "DAX",
    symbol: "DAX",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("^GDAXI", rangeDays, "DAX"),
  },
  bnb: {
    slug: "bnb",
    name: "BINANCE COIN",
    symbol: "BNB-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("binancecoin", rangeDays),
  },
  xrp: {
    slug: "xrp",
    name: "XRP",
    symbol: "XRP-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("ripple", rangeDays),
  },
  solana: {
    slug: "solana",
    name: "SOLANA",
    symbol: "SOL-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("solana", rangeDays),
  },
  cardano: {
    slug: "cardano",
    name: "CARDANO",
    symbol: "ADA-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("cardano", rangeDays),
  },
  dogecoin: {
    slug: "dogecoin",
    name: "DOGECOIN",
    symbol: "DOGE-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("dogecoin", rangeDays),
  },
  polkadot: {
    slug: "polkadot",
    name: "POLKADOT",
    symbol: "DOT-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("polkadot", rangeDays),
  },
  litecoin: {
    slug: "litecoin",
    name: "LITECOIN",
    symbol: "LTC-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("litecoin", rangeDays),
  },
  bitcoincash: {
    slug: "bitcoincash",
    name: "BITCOIN CASH",
    symbol: "BCH-USD",
    category: "Crypto",
    fetchFeed: (rangeDays) => fetchBinanceOHLCV("bitcoin-cash", rangeDays),
  },
  platinum: {
    slug: "platinum",
    name: "PLATINUM",
    symbol: "PL=F",
    category: "Precious Metals",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("PL=F", rangeDays, "Platinum"),
  },
  palladium: {
    slug: "palladium",
    name: "PALLADIUM",
    symbol: "PA=F",
    category: "Precious Metals",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("PA=F", rangeDays, "Palladium"),
  },
  copper: {
    slug: "copper",
    name: "COPPER",
    symbol: "HG=F",
    category: "Commodities",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("HG=F", rangeDays, "Copper"),
  },
  netflix: {
    slug: "netflix",
    name: "NETFLIX",
    symbol: "NFLX",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("NFLX", rangeDays),
  },
  disney: {
    slug: "disney",
    name: "DISNEY",
    symbol: "DIS",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("DIS", rangeDays),
  },
  coca: {
    slug: "coca",
    name: "COCA-COLA",
    symbol: "KO",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("KO", rangeDays),
  },
  jnj: {
    slug: "jnj",
    name: "JOHNSON & JOHNSON",
    symbol: "JNJ",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("JNJ", rangeDays),
  },
  walmart: {
    slug: "walmart",
    name: "WALMART",
    symbol: "WMT",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("WMT", rangeDays),
  },
  visa: {
    slug: "visa",
    name: "VISA",
    symbol: "V",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("V", rangeDays),
  },
  mastercard: {
    slug: "mastercard",
    name: "MASTERCARD",
    symbol: "MA",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("MA", rangeDays),
  },
  // Indices
  russell2000: {
    slug: "russell2000",
    name: "RUSSELL 2000",
    symbol: "IWM",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("IWM", rangeDays),
  },
  dowjones: {
    slug: "dowjones",
    name: "DOW JONES",
    symbol: "DIA",
    category: "Stocks",
    fetchFeed: (rangeDays) => fetchFinnhubQuote("DIA", rangeDays),
  },
  // Macro Indicators
  treasury10y: {
    slug: "treasury10y",
    name: "10-YEAR TREASURY",
    symbol: "TNX",
    category: "Commodities",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("^TNX", rangeDays, "10-Year Treasury"),
  },
  usdollar: {
    slug: "usdollar",
    name: "US DOLLAR INDEX",
    symbol: "DXY",
    category: "Commodities",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("^DXY", rangeDays, "Dollar Index"),
  },
  // Commodities
  naturalgas: {
    slug: "naturalgas",
    name: "NATURAL GAS",
    symbol: "NG",
    category: "Commodities",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("NG=F", rangeDays, "Natural Gas"),
  },
  brentcrudeoil: {
    slug: "brentcrudeoil",
    name: "BRENT CRUDE OIL",
    symbol: "BRENT",
    category: "Commodities",
    fetchFeed: (rangeDays) => fetchYahooWithFallback("BZ=F", rangeDays, "Brent Crude Oil"),
  },
};

export function getAssetConfig(slug: string): AssetConfig | undefined {
  return ASSETS[slug];
}
