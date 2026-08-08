import { ping } from "@/lib/db";

// GET /api/health
// Health check endpoint
// Ensures database is initialized and responding
export async function GET() {
  try {
    const dbHealthy = ping();

    if (!dbHealthy) {
      return Response.json(
        {
          status: "unhealthy",
          database: "unreachable",
        },
        { status: 503 }
      );
    }

    return Response.json({
      status: "healthy",
      database: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
