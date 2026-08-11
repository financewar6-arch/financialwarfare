import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify authorization header
  const authHeader = request.headers.get("Authorization");
  const expectedSecret = process.env.HEALTH_CHECK_SECRET;

  if (!expectedSecret || !authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { status: "unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  if (token !== expectedSecret) {
    return NextResponse.json(
      { status: "unauthorized" },
      { status: 401 }
    );
  }

  const startTime = Date.now();
  const checks: Record<string, { ok: boolean; latencyMs: number; error?: string }> = {};

  // Check database
  const dbStart = Date.now();
  try {
    const prisma = await import("@prisma/client").then(m => new m.PrismaClient());
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    checks.database = { ok: true, latencyMs: Date.now() - dbStart };
  } catch (error) {
    checks.database = {
      ok: false,
      latencyMs: Date.now() - dbStart,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  const totalLatencyMs = Date.now() - startTime;
  const allOk = Object.values(checks).every(c => c.ok);

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      totalLatencyMs,
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
