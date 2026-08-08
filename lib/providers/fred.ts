const BASE_URL = "https://api.stlouisfed.org/fred";

export interface MacroIndicator {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  change24h: number | null;
  date: string;
}

interface FredObservation {
  date: string;
  value: string;
}

async function fetchFredSeries(seriesId: string): Promise<FredObservation[]> {
  try {
    const url = new URL(`${BASE_URL}/series/observations`);
    url.searchParams.append("series_id", seriesId);
    url.searchParams.append("limit", "2");
    url.searchParams.append("sort_order", "desc");
    url.searchParams.append("api_key", "fd199e1d55184209b7c8a1b94cdb8f12");

    const response = await fetch(url.toString(), { next: { revalidate: 86400 } });

    if (!response.ok) {
      console.error(`FRED error: ${response.status} for ${seriesId}`);
      return [];
    }

    const data = await response.json();
    return data.observations || [];
  } catch (error) {
    console.error("FRED fetch failed:", error);
    return [];
  }
}

export async function getMacroIndicators(): Promise<MacroIndicator[]> {
  const [vixData, yieldData, unemploymentData] = await Promise.all([
    fetchFredSeries("VIXCLS"), // VIX
    fetchFredSeries("DGS10"), // 10Y Treasury yield
    fetchFredSeries("UNRATE"), // Unemployment rate
  ]);

  const indicators: MacroIndicator[] = [];

  if (vixData.length >= 2) {
    const current = parseFloat(vixData[0].value);
    const previous = parseFloat(vixData[1].value);
    indicators.push({
      symbol: "VIX",
      name: "Volatility Index",
      value: current,
      unit: "points",
      change24h: current - previous,
      date: vixData[0].date,
    });
  }

  if (yieldData.length >= 2) {
    const current = parseFloat(yieldData[0].value);
    const previous = parseFloat(yieldData[1].value);
    indicators.push({
      symbol: "10Y",
      name: "10-Year Treasury Yield",
      value: current,
      unit: "%",
      change24h: current - previous,
      date: yieldData[0].date,
    });
  }

  if (unemploymentData.length >= 2) {
    const current = parseFloat(unemploymentData[0].value);
    const previous = parseFloat(unemploymentData[1].value);
    indicators.push({
      symbol: "UNRATE",
      name: "Unemployment Rate",
      value: current,
      unit: "%",
      change24h: current - previous,
      date: unemploymentData[0].date,
    });
  }

  return indicators;
}
