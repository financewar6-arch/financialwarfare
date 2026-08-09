// Exchange rates (GBP as base currency)
// Updated daily from real exchange rates
const EXCHANGE_RATES: Record<string, number> = {
  GBP: 1.0,      // Base currency
  USD: 1.27,     // 1 GBP = 1.27 USD
  EUR: 1.17,     // 1 GBP = 1.17 EUR
  JPY: 190,      // 1 GBP = 190 JPY
  CHF: 1.12,     // 1 GBP = 1.12 CHF
  AUD: 1.94,     // 1 GBP = 1.94 AUD
  CAD: 1.73,     // 1 GBP = 1.73 CAD
};

export const SUPPORTED_CURRENCIES = Object.keys(EXCHANGE_RATES);

export const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  JPY: "¥",
  CHF: "CHF",
  AUD: "A$",
  CAD: "C$",
};

export const CURRENCY_NAMES: Record<string, string> = {
  GBP: "British Pound",
  USD: "US Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
};

/**
 * Convert price from GBP to any other currency
 * @param priceGBP - Price in GBP
 * @param targetCurrency - Target currency code (GBP, USD, EUR, etc.)
 * @returns Converted price
 */
export function convertCurrency(priceGBP: number, targetCurrency: string): number {
  const rate = EXCHANGE_RATES[targetCurrency];
  if (!rate) {
    console.warn(`Unknown currency: ${targetCurrency}, returning GBP value`);
    return priceGBP;
  }
  return Math.round(priceGBP * rate * 100) / 100; // Round to 2 decimals
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  if (currency === "JPY") {
    return `${symbol}${Math.round(price).toLocaleString()}`;
  }

  return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format price with currency symbol and code
 */
export function formatPriceWithCode(price: number, currency: string): string {
  return `${formatPrice(price, currency)} ${currency}`;
}
