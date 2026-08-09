import { NextRequest, NextResponse } from "next/server";
import { updateEditorial, getEditorialStatus } from "@/lib/editorial-cache";
import type { EditorialContent } from "@/lib/warroom/types";

export async function POST(request: NextRequest) {
  // Security: Check admin token
  const adminToken = request.headers.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN || "default-change-me";

  if (adminToken !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { slug, content } = body;

    if (!slug || !content) {
      return NextResponse.json(
        { error: "Missing slug or content" },
        { status: 400 }
      );
    }

    // Validate content structure
    if (
      !content.photoLabel ||
      !content.whyItMoved ||
      !content.whyYouShouldCare ||
      !content.risk ||
      !content.watchNext
    ) {
      return NextResponse.json(
        { error: "Content missing required fields" },
        { status: 400 }
      );
    }

    // Update editorial content
    updateEditorial(slug, content as EditorialContent);
    const status = getEditorialStatus(slug);

    return NextResponse.json({
      success: true,
      message: `Editorial updated for ${slug}`,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update editorial:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update editorial",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check status of all editorial content
export async function GET(request: NextRequest) {
  const adminToken = request.headers.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN || "default-change-me";

  if (adminToken !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const status = getEditorialStatus(slug);
    return NextResponse.json({
      slug,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  // Return all editorial statuses
  const allSlugs = ["bitcoin", "gold", "apple", "ethereum", "sp500", "nasdaq"];
  const statuses = allSlugs
    .map((s) => getEditorialStatus(s))
    .filter((s) => s !== null);

  return NextResponse.json({
    editorials: statuses,
    timestamp: new Date().toISOString(),
  });
}
