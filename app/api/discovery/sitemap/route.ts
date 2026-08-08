import { NextRequest, NextResponse } from "next/server";
import { getAllMarketEvents } from "@/lib/db";
import { ASSETS } from "@/lib/assets";

export async function GET(request: NextRequest) {
  try {
    const events = getAllMarketEvents();

    // Filter events with high importance score
    const highImportanceEvents = events.filter(
      (e) => (e.importanceScore || 50) >= 70 && e.expiresAt > Date.now()
    );

    // Generate XML sitemap
    const baseUrl = new URL(request.url).origin;
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add main pages
    const mainPages = [
      { path: "/", priority: "1.0" },
      { path: "/war-rooms", priority: "0.9" },
      { path: "/frontline", priority: "0.9" },
    ];

    mainPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add discovery article pages
    highImportanceEvents.forEach((event) => {
      const asset = ASSETS[event.assetSlug as keyof typeof ASSETS];
      if (!asset) return;

      const direction = event.priceChange >= 0 ? "up" : "down";
      const category = asset.category || "stocks";
      const path = `/${category}/${asset.symbol.toLowerCase()}/why-is-${asset.symbol.toLowerCase()}-${direction}`;

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${path}</loc>\n`;
      xml += `    <lastmod>${new Date(event.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `    <changefreq>never</changefreq>\n`;
      xml += `  </url>\n`;
    });

    // Add war room pages
    Object.values(ASSETS).forEach((asset) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/war-room/${asset.slug}</loc>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `  </url>\n`;
    });

    xml += "</urlset>";

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
