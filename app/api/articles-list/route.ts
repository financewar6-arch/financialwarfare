import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get("limit");
    const days = request.nextUrl.searchParams.get("days");

    const take = limit ? parseInt(limit) : 50;
    const daysBack = days ? parseInt(days) : 7;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - daysBack);

    const articles = await prisma.dailyDispatchArticle.findMany({
      where: {
        publishedAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take,
    });

    return NextResponse.json({
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles", articles: [] },
      { status: 500 }
    );
  }
}
