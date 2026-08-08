import type { AssetFeedData, RangeDays } from "./providers/types";
import { fetchBinanceOHLCV } from "./providers/binance";
import { fetchGoldApi } from "./providers/goldapi";
import { fetchFinnhubQuote } from "./providers/finnhub";
import { fetchNasdaqIndex } from "./providers/alphavantage-index";
import { fetchYahooOhlc } from "./providers/yahoofinance";

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
    symbol: "GC=F",
    category: "Precious Metals",
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("GC=F", rangeDays);
      if (!data.history.length) throw new Error("No gold data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
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
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("SI=F", rangeDays);
      if (!data.history.length) throw new Error("No silver data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
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
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("^GSPC", rangeDays);
      if (!data.history.length) throw new Error("No S&P data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
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
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("CL=F", rangeDays);
      if (!data.history.length) throw new Error("No crude oil data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
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
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("^GDAXI", rangeDays);
      if (!data.history.length) throw new Error("No DAX data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
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
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("PL=F", rangeDays);
      if (!data.history.length) throw new Error("No platinum data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
  },
  palladium: {
    slug: "palladium",
    name: "PALLADIUM",
    symbol: "PA=F",
    category: "Precious Metals",
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("PA=F", rangeDays);
      if (!data.history.length) throw new Error("No palladium data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
  },
  copper: {
    slug: "copper",
    name: "COPPER",
    symbol: "HG=F",
    category: "Commodities",
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("HG=F", rangeDays);
      if (!data.history.length) throw new Error("No copper data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
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
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("^TNX", rangeDays);
      if (!data.history.length) throw new Error("No treasury data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
  },
  usdollar: {
    slug: "usdollar",
    name: "US DOLLAR INDEX",
    symbol: "DXY",
    category: "Commodities",
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("^DXY", rangeDays);
      if (!data.history.length) throw new Error("No dollar index data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
  },
  // Commodities
  naturalgas: {
    slug: "naturalgas",
    name: "NATURAL GAS",
    symbol: "NG",
    category: "Commodities",
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("NG=F", rangeDays);
      if (!data.history.length) throw new Error("No natural gas data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
  },
  brentcrudeoil: {
    slug: "brentcrudeoil",
    name: "BRENT CRUDE OIL",
    symbol: "BRENT",
    category: "Commodities",
    fetchFeed: async (rangeDays) => {
      const data = await fetchYahooOhlc("BZ=F", rangeDays);
      if (!data.history.length) throw new Error("No brent crude data");
      const latestPrice = data.history[data.history.length - 1];
      const previousPrice = data.history[data.history.length - 2] || latestPrice;
      const change24h = ((latestPrice.p - previousPrice.p) / previousPrice.p) * 100;
      return { ...data, price: latestPrice.p, change24h, volumeUnit: "usd", marketCap: null };
    },
  },
};

export function getAssetConfig(slug: string): AssetConfig | undefined {
  return ASSETS[slug];
}
