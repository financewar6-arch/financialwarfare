import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol") || "ASSET";
    const direction = searchParams.get("direction") || "up";
    const change = searchParams.get("change") || "0";

    // Generate a simple SVG image for OpenGraph
    // In production, use a library like satori or sharp for more sophisticated images
    const svg = generateSVG(symbol, direction, change);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("OG image generation error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}

function generateSVG(symbol: string, direction: string, change: string): string {
  const isUp = direction === "up";
  const bgColor = isUp ? "#1a3d1a" : "#3d1a1a";
  const accentColor = isUp ? "#4ade80" : "#ff4444";
  const changeNum = parseFloat(change);
  const changeText = `${isUp ? "+" : ""}${changeNum.toFixed(2)}%`;

  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="1200" height="630" fill="#0a0a0a"/>

      <!-- Accent background -->
      <rect width="1200" height="630" fill="${bgColor}" opacity="0.3"/>

      <!-- Top accent bar -->
      <rect width="1200" height="8" fill="${accentColor}"/>

      <!-- Content -->
      <text x="60" y="120" font-size="72" font-weight="bold" fill="#ffffff" font-family="system-ui">
        Why is ${symbol} ${isUp ? "up" : "down"}?
      </text>

      <!-- Price change badge -->
      <g>
        <rect x="60" y="200" width="300" height="120" rx="8" fill="${accentColor}" opacity="0.1" stroke="${accentColor}" stroke-width="2"/>
        <text x="210" y="260" font-size="64" font-weight="bold" fill="${accentColor}" text-anchor="middle" font-family="monospace">
          ${changeText}
        </text>
      </g>

      <!-- Footer -->
      <text x="60" y="600" font-size="28" fill="#888888" font-family="system-ui">
        Financial Warfare — Market Analysis
      </text>
    </svg>
  `;
}
