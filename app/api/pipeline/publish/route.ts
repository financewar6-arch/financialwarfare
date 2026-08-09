import { NextRequest, NextResponse } from "next/server";
import { MultiPlatformPublisher } from "@/lib/publishers/multi-publisher";
import type { MultiPlatformPublishRequest } from "@/lib/publishers/multi-publisher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      videoPath,
      videoUrl,
      title,
      description,
      hashtags,
      platforms,
      thumbnail,
      metadata,
    } = body as MultiPlatformPublishRequest;

    // Validate required fields
    if (!title || !description || !hashtags || !platforms) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, description, hashtags, platforms",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "Platforms array required and must not be empty" },
        { status: 400 }
      );
    }

    if (!videoPath && !videoUrl) {
      return NextResponse.json(
        { error: "Either videoPath or videoUrl required" },
        { status: 400 }
      );
    }

    const publisher = new MultiPlatformPublisher();
    const result = await publisher.publishToMultiplePlatforms({
      videoPath: videoPath || "",
      videoUrl,
      title,
      description,
      hashtags,
      platforms: platforms as any,
      thumbnail,
      metadata,
    });

    return NextResponse.json({
      success: result.success,
      timestamp: Date.now(),
      results: result.results,
      summary: result.summary,
    });
  } catch (error) {
    console.error("Error in /api/pipeline/publish:", error);
    return NextResponse.json(
      {
        error: "Failed to publish to platforms",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const publisher = new MultiPlatformPublisher();

    return NextResponse.json({
      success: true,
      allPlatforms: publisher.getAllPlatforms(),
      configured: publisher.getConfiguredPlatforms(),
      message: "Use POST with videoPath/videoUrl, title, description, hashtags, and platforms array",
      example: {
        platforms: ["youtube", "tiktok", "instagram", "linkedin", "twitter", "snapchat"],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
