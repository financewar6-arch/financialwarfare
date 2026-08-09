#!/usr/bin/env python3
"""
Production-ready gold price fetcher using yfinance
Handles XAU/USD with fallback to futures, includes caching and error handling
"""

import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, Optional, List, Tuple
import time


class GoldPriceFetcher:
    """Fetch and cache gold prices from Yahoo Finance"""

    # Cache configuration
    CACHE_DURATION_SECONDS = 60
    PRIMARY_TICKER = "XAUUSD=X"
    FALLBACK_TICKER = "GC=F"

    def __init__(self):
        """Initialize price cache"""
        self._price_cache: Dict[str, Tuple[float, float]] = {}
        self._cache_timestamps: Dict[str, float] = {}

    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still fresh"""
        if cache_key not in self._cache_timestamps:
            return False
        age = time.time() - self._cache_timestamps[cache_key]
        return age < self.CACHE_DURATION_SECONDS

    def get_live_price(self) -> Dict[str, Optional[float]]:
        """
        Fetch current gold price with caching

        Returns:
            dict: {price, high, low, change_percent} or None values if fetch fails
        """
        cache_key = "live_price"

        # Return cached data if available
        if self._is_cache_valid(cache_key):
            cached_data = self._price_cache.get(cache_key)
            if cached_data:
                price, change = cached_data
                return {
                    "price": price,
                    "change_percent": change,
                    "source": "cache",
                    "cached_for_seconds": int(
                        time.time() - self._cache_timestamps[cache_key]
                    ),
                }

        result = {
            "price": None,
            "high": None,
            "low": None,
            "change_percent": None,
            "source": None,
        }

        # Try primary ticker
        try:
            ticker = yf.Ticker(self.PRIMARY_TICKER)
            data = ticker.history(period="1d")

            if not data.empty:
                latest = data.iloc[-1]
                result["price"] = float(latest["Close"])
                result["high"] = float(latest["High"])
                result["low"] = float(latest["Low"])
                result["source"] = self.PRIMARY_TICKER

                # Calculate 24h change
                if len(data) > 1:
                    previous = data.iloc[-2]
                    prev_close = float(previous["Close"])
                    change = ((result["price"] - prev_close) / prev_close) * 100
                    result["change_percent"] = round(change, 2)

                # Cache the result
                self._price_cache[cache_key] = (result["price"], result["change_percent"])
                self._cache_timestamps[cache_key] = time.time()

                return result

        except Exception as e:
            print(f"Primary ticker {self.PRIMARY_TICKER} failed: {e}")

        # Fallback to futures
        try:
            ticker = yf.Ticker(self.FALLBACK_TICKER)
            data = ticker.history(period="1d")

            if not data.empty:
                latest = data.iloc[-1]
                result["price"] = float(latest["Close"])
                result["high"] = float(latest["High"])
                result["low"] = float(latest["Low"])
                result["source"] = self.FALLBACK_TICKER
                result["is_futures"] = True

                # Calculate 24h change
                if len(data) > 1:
                    previous = data.iloc[-2]
                    prev_close = float(previous["Close"])
                    change = ((result["price"] - prev_close) / prev_close) * 100
                    result["change_percent"] = round(change, 2)

                # Cache the result
                self._price_cache[cache_key] = (result["price"], result["change_percent"])
                self._cache_timestamps[cache_key] = time.time()

                return result

        except Exception as e:
            print(f"Fallback ticker {self.FALLBACK_TICKER} failed: {e}")

        return result

    def get_historical_prices(
        self, days: int = 30
    ) -> Optional[List[Dict[str, any]]]:
        """
        Fetch historical daily closing prices

        Args:
            days: Number of days of history to fetch (default 30)

        Returns:
            List of dicts with date and closing price, or None if fetch fails
        """
        try:
            ticker = yf.Ticker(self.PRIMARY_TICKER)
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days + 5)  # Buffer for weekends

            data = ticker.history(start=start_date, end=end_date)

            if data.empty:
                raise ValueError(f"No data for {self.PRIMARY_TICKER}")

            history = []
            for date, row in data.iterrows():
                history.append(
                    {
                        "date": date.strftime("%Y-%m-%d"),
                        "close": float(row["Close"]),
                        "high": float(row["High"]),
                        "low": float(row["Low"]),
                        "volume": int(row["Volume"]) if row["Volume"] > 0 else None,
                    }
                )

            return history[:days]  # Return exactly requested days

        except Exception as e:
            print(f"Historical fetch for {self.PRIMARY_TICKER} failed: {e}")

        # Fallback to futures
        try:
            ticker = yf.Ticker(self.FALLBACK_TICKER)
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days + 5)

            data = ticker.history(start=start_date, end=end_date)

            if data.empty:
                raise ValueError(f"No data for {self.FALLBACK_TICKER}")

            history = []
            for date, row in data.iterrows():
                history.append(
                    {
                        "date": date.strftime("%Y-%m-%d"),
                        "close": float(row["Close"]),
                        "high": float(row["High"]),
                        "low": float(row["Low"]),
                        "volume": int(row["Volume"]) if row["Volume"] > 0 else None,
                        "is_futures": True,
                    }
                )

            return history[:days]

        except Exception as e:
            print(f"Historical fallback fetch failed: {e}")
            return None

    def get_price_stats(self) -> Dict[str, Optional[float]]:
        """Get current price with full statistics"""
        price_data = self.get_live_price()
        historical = self.get_historical_prices(days=30)

        if not historical or len(historical) < 2:
            return price_data

        closes = [h["close"] for h in historical]
        highs = [h["high"] for h in historical]
        lows = [h["low"] for h in historical]

        return {
            **price_data,
            "52week_high": max(closes) if closes else None,
            "52week_low": min(closes) if closes else None,
            "30day_avg": round(sum(closes) / len(closes), 2) if closes else None,
            "monthly_high": max(highs) if highs else None,
            "monthly_low": min(lows) if lows else None,
            "volatility": round(
                (max(closes) - min(closes)) / (sum(closes) / len(closes)) * 100, 2
            )
            if closes
            else None,
        }


def main():
    """Example usage"""
    fetcher = GoldPriceFetcher()

    # Get live price
    print("=== LIVE GOLD PRICE ===")
    price = fetcher.get_live_price()
    print(f"Price: ${price['price']}")
    print(f"High: ${price['high']}")
    print(f"Low: ${price['low']}")
    print(f"Change: {price['change_percent']}%")
    print(f"Source: {price['source']}")

    # Get historical prices
    print("\n=== HISTORICAL PRICES (Last 7 Days) ===")
    history = fetcher.get_historical_prices(days=7)
    if history:
        for day in history[-7:]:
            print(f"{day['date']}: ${day['close']}")

    # Get statistics
    print("\n=== STATISTICS ===")
    stats = fetcher.get_price_stats()
    print(f"30-Day Average: ${stats.get('30day_avg')}")
    print(f"Monthly High: ${stats.get('monthly_high')}")
    print(f"Monthly Low: ${stats.get('monthly_low')}")
    print(f"Volatility: {stats.get('volatility')}%")

    # Test caching
    print("\n=== CACHE TEST (Should return cached data) ===")
    price2 = fetcher.get_live_price()
    print(f"Source: {price2['source']}")
    print(f"Cached for: {price2.get('cached_for_seconds')} seconds")


if __name__ == "__main__":
    main()
