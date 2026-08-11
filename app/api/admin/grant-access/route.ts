import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { grantFeature, PremiumFeature } from "@/lib/entitlements";
import { authOptions } from "@/lib/auth";

// Simple admin check - in production, verify against a database/env list
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if user is admin
  if (
    !session?.user?.email ||
    !ADMIN_EMAILS.includes(session.user.email)
  ) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const { userId, feature } = await req.json();

  if (!userId || !feature) {
    return NextResponse.json(
      { error: "userId and feature required" },
      { status: 400 }
    );
  }

  await grantFeature(userId, feature as PremiumFeature);

  return NextResponse.json({
    success: true,
    message: `Granted ${feature} to user ${userId}`,
  });
}
