import { ping } from "@/lib/db";

// GET /api/health
// Comprehensive health check endpoint
// Checks database and external API services
export async function GET(request: Request) {
  // Verify authorization header
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.HEALTH_CHECK_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return Response.json(
      {
        status: "unauthorized",
        error: "Invalid or missing authorization header",
      },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const checks: Record<
    string,
    { ok: boolean; latencyMs: number; cached?: boolean; error?: string }
  > = {};

  // 1. Check database
  try {
    const dbStart = Date.now();
    const dbHealthy = await ping();
    checks.database = {
      ok: dbHealthy,
      latencyMs: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      ok: false,
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // 2. Check CoinGecko
  try {
    const coinStart = Date.now();
    const coinRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { cache: "no-store" }
    );
    checks.coingecko = {
      ok: coinRes.ok,
      latencyMs: Date.now() - coinStart,
    };
  } catch (error) {
    checks.coingecko = {
      ok: false,
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }

  // 3. Check Finnhub
  try {
    const finnStart = Date.now();
    const finnRes = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${process.env.FINNHUB_API_KEY || "demo"}`,
      { cache: "no-store" }
    );
    checks.finnhub = {
      ok: finnRes.ok,
      latencyMs: Date.now() - finnStart,
      cached: false,
    };
  } catch (error) {
    checks.finnhub = {
      ok: false,
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }

  // 4. Check Gold API
  try {
    const goldStart = Date.now();
    const goldRes = await fetch(
      `https://api.metals.live/v1/spot/gold?currency=USD`,
      { cache: "no-store" }
    );
    checks.goldApi = {
      ok: goldRes.ok,
      latencyMs: Date.now() - goldStart,
      cached: false,
    };
  } catch (error) {
    checks.goldApi = {
      ok: false,
      latencyMs: Date.now() - goldStart,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }

  // 5. Check Alpha Vantage
  try {
    const alphaStart = Date.now();
    const alphaRes = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${process.env.ALPHAVANTAGE_API_KEY || "demo"}`,
      { cache: "no-store" }
    );
    checks.alphaVantage = {
      ok: alphaRes.ok,
      latencyMs: Date.now() - alphaStart,
      cached: false,
    };
  } catch (error) {
    checks.alphaVantage = {
      ok: false,
      latencyMs: Date.now() - alphaStart,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }

  const totalLatencyMs = Date.now() - startTime;

  // Determine overall status
  const allOk = Object.values(checks).every((check) => check.ok);
  const status = allOk ? "ok" : "degraded";

  return Response.json(
    {
      status,
      timestamp: new Date().toISOString(),
      totalLatencyMs,
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
