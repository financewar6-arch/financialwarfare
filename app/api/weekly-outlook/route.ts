import { NextRequest, NextResponse } from "next/server";
import { createSundayOutlook, updateSundayOutlook, type SundayOutlook } from "@/lib/models/sunday-outlook";

// In-memory storage (in production, use database)
const outlookStore = new Map<string, SundayOutlook>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");

    // Get specific outlook by slug
    if (slug) {
      const outlook = Array.from(outlookStore.values()).find((o) => o.slug === slug);
      if (!outlook) {
        return NextResponse.json({ error: "Outlook not found" }, { status: 404 });
      }

      // Increment view count
      outlook.viewCount++;
      outlookStore.set(outlook.id, outlook);

      return NextResponse.json({ success: true, outlook });
    }

    // Get featured outlook
    if (featured === "true") {
      const featuredOutlook = Array.from(outlookStore.values())
        .filter((o) => o.status === "published")
        .find((o) => o.featured);

      return NextResponse.json({
        success: true,
        outlook: featuredOutlook || null,
      });
    }

    // Get all published outlooks (for archive)
    const outlooks = Array.from(outlookStore.values())
      .filter((o) => o.status === "published")
      .sort((a, b) => b.publishedAt - a.publishedAt);

    return NextResponse.json({
      success: true,
      outlooks,
      total: outlooks.length,
    });
  } catch (error) {
    console.error("Error in GET /api/sunday-outlook:", error);
    return NextResponse.json(
      { error: "Failed to get outlooks", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    // CREATE new outlook
    if (action === "create") {
      const outlook = createSundayOutlook({
        substackUrl: data.substackUrl,
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
        publishedAt: data.publishedAt,
        coverImage: data.coverImage,
        summary: data.summary,
        category: data.category || "Market Outlook",
      });

      // If featured is true, unfeature all other outlooks
      if (data.featured !== false) {
        Array.from(outlookStore.values()).forEach((o) => {
          o.featured = false;
          outlookStore.set(o.id, o);
        });
        outlook.featured = true;
      }

      // Publish immediately
      outlook.status = "published";

      outlookStore.set(outlook.id, outlook);

      return NextResponse.json({
        success: true,
        outlook,
        message: "Sunday Outlook published successfully",
      });
    }

    // UPDATE outlook
    if (action === "update") {
      const { id, ...updates } = data;
      const outlook = outlookStore.get(id);

      if (!outlook) {
        return NextResponse.json({ error: "Outlook not found" }, { status: 404 });
      }

      const updated = updateSundayOutlook(outlook, updates);
      outlookStore.set(id, updated);

      return NextResponse.json({
        success: true,
        outlook: updated,
      });
    }

    // SET featured
    if (action === "set_featured") {
      const { id } = data;
      const outlook = outlookStore.get(id);

      if (!outlook) {
        return NextResponse.json({ error: "Outlook not found" }, { status: 404 });
      }

      // Unfeature all others
      Array.from(outlookStore.values()).forEach((o) => {
        o.featured = false;
        outlookStore.set(o.id, o);
      });

      // Feature this one
      outlook.featured = true;
      outlookStore.set(id, outlook);

      return NextResponse.json({
        success: true,
        outlook,
      });
    }

    // TRACK click to Substack
    if (action === "track_click") {
      const { id } = data;
      const outlook = outlookStore.get(id);

      if (!outlook) {
        return NextResponse.json({ error: "Outlook not found" }, { status: 404 });
      }

      outlook.clicksToSubstack++;
      outlookStore.set(id, outlook);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST /api/sunday-outlook:", error);
    return NextResponse.json(
      { error: "Failed to process outlook", details: String(error) },
      { status: 500 }
    );
  }
}
