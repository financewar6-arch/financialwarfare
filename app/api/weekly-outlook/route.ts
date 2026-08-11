import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");

    // Get specific outlook by slug
    if (slug) {
      const outlook = await prisma.weeklyOutlook.findUnique({
        where: { slug },
      });

      if (!outlook) {
        return NextResponse.json(
          { error: "Outlook not found" },
          { status: 404 }
        );
      }

      // Increment view count
      await prisma.weeklyOutlook.update({
        where: { id: outlook.id },
        data: { viewCount: { increment: 1 } },
      });

      return NextResponse.json({ success: true, outlook });
    }

    // Get featured outlook
    if (featured === "true") {
      const featuredOutlook = await prisma.weeklyOutlook.findFirst({
        where: {
          status: "published",
          featured: true,
        },
      });

      return NextResponse.json({
        success: true,
        outlook: featuredOutlook || null,
      });
    }

    // Get all published outlooks (for archive)
    const outlooks = await prisma.weeklyOutlook.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      outlooks,
      total: outlooks.length,
    });
  } catch (error) {
    console.error("Error in GET /api/weekly-outlook:", error);
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
      // Generate slug from title
      const slug =
        data.slug ||
        data.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 50);

      const outlook = await prisma.weeklyOutlook.create({
        data: {
          slug,
          title: data.title,
          subtitle: data.subtitle,
          author: data.author || "Financial Opp",
          publishedAt: new Date(data.publishedAt || Date.now()),
          coverImage: data.coverImage,
          summary: data.summary,
          substackUrl: data.substackUrl,
          category: data.category || "Market Outlook",
          seoTitle: `${data.title} — Financial Opp`,
          seoDescription: data.summary,
          status: "published",
          featured: data.featured !== false,
        },
      });

      // If featured, unfeature all others
      if (data.featured !== false) {
        await prisma.weeklyOutlook.updateMany({
          where: { id: { not: outlook.id }, featured: true },
          data: { featured: false },
        });
      }

      return NextResponse.json({
        success: true,
        outlook,
        message: "Weekly Outlook published successfully",
      });
    }

    // UPDATE outlook
    if (action === "update") {
      const { id, ...updates } = data;

      const outlook = await prisma.weeklyOutlook.update({
        where: { id },
        data: {
          title: updates.title,
          subtitle: updates.subtitle,
          summary: updates.summary,
          coverImage: updates.coverImage,
          status: updates.status,
        },
      });

      return NextResponse.json({
        success: true,
        outlook,
      });
    }

    // SET featured
    if (action === "set_featured") {
      const { id } = data;

      // Unfeature all others
      await prisma.weeklyOutlook.updateMany({
        where: { featured: true },
        data: { featured: false },
      });

      // Feature this one
      const outlook = await prisma.weeklyOutlook.update({
        where: { id },
        data: { featured: true },
      });

      return NextResponse.json({
        success: true,
        outlook,
      });
    }

    // TRACK click to Substack
    if (action === "track_click") {
      const { id } = data;

      await prisma.weeklyOutlook.update({
        where: { id },
        data: { clicksToSubstack: { increment: 1 } },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST /api/weekly-outlook:", error);
    return NextResponse.json(
      { error: "Failed to process outlook", details: String(error) },
      { status: 500 }
    );
  }
}
