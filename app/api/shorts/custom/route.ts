import { NextRequest, NextResponse } from "next/server";

interface CustomShort {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  publishedAt: number;
  assetSymbol: string;
  assetName: string;
}

// Store your custom videos here - update as you create new ones
const customShorts: CustomShort[] = [
  {
    id: "custom-1",
    title: "Bitcoin Market Surge",
    videoUrl: "/videos/market-news-bitcoin.mp4",
    thumbnailUrl: "/images/thumbs/bitcoin-thumb.jpg",
    duration: 60,
    publishedAt: Date.now(),
    assetSymbol: "BTC",
    assetName: "Bitcoin",
  },
  // Add more as you create them:
  // {
  //   id: "custom-2",
  //   title: "Gold Rally on Tensions",
  //   videoUrl: "/videos/market-news-gold.mp4",
  //   duration: 60,
  //   publishedAt: Date.now() - 24*60*60*1000,
  //   assetSymbol: "GC",
  //   assetName: "Gold",
  // },
];

export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get("limit") || "3";
  return NextResponse.json({
    videos: customShorts.slice(0, parseInt(limit)),
  });
}
