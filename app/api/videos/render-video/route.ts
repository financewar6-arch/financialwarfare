import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side video rendering using Remotion
 * NOTE: Remotion server-side rendering not yet configured
 * Videos currently generated via HTML templates
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Server-side video rendering not yet configured. Use HTML template videos instead." },
    { status: 501 }
  );
}
