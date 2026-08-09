import { NextRequest, NextResponse } from "next/server";
import { fetchSubstackMetadata, generateOutlookSummary } from "@/lib/services/substack-fetcher";

export async function POST(request: NextRequest) {
  try {
    const { substackUrl } = await request.json();

    if (!substackUrl) {
      return NextResponse.json(
        { error: "Substack URL is required" },
        { status: 400 }
      );
    }

    // Fetch metadata
    const metadata = await fetchSubstackMetadata(substackUrl);

    if (!metadata.success) {
      return NextResponse.json(
        {
          error: metadata.error || "Failed to fetch article metadata",
          success: false,
        },
        { status: 400 }
      );
    }

    // Generate summary
    const summary = await generateOutlookSummary(
      metadata.title,
      metadata.description
    );

    return NextResponse.json({
      success: true,
      article: {
        title: metadata.title,
        subtitle: metadata.subtitle,
        author: metadata.author,
        publishedAt: metadata.publishedAt,
        coverImage: metadata.coverImage,
        description: metadata.description,
        summary: summary,
        url: substackUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching article metadata:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch article",
        details: String(error),
        success: false,
      },
      { status: 500 }
    );
  }
}
