import { NextRequest, NextResponse } from "next/server";
import { getContentQueueItem, updateContentQueueItem } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { contentQueueId, action, approvalNotes } = await request.json();

    if (!contentQueueId || !action) {
      return NextResponse.json({ error: "contentQueueId and action required" }, { status: 400 });
    }

    if (!["approve", "reject", "regenerate"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const item = getContentQueueItem(contentQueueId);
    if (!item) {
      return NextResponse.json({ error: "Content queue item not found" }, { status: 404 });
    }

    if (action === "approve") {
      // Move to APPROVED - triggers video generation
      updateContentQueueItem(contentQueueId, {
        status: "APPROVED",
        reviewedAt: Date.now(),
        approvalNotes,
      });

      return NextResponse.json({
        success: true,
        status: "APPROVED",
        message: "Script approved. Video generation queued.",
      });
    }

    if (action === "reject") {
      // Move to REJECTED - discarded
      updateContentQueueItem(contentQueueId, {
        status: "REJECTED",
        reviewedAt: Date.now(),
        rejectionReason: approvalNotes,
      });

      return NextResponse.json({
        success: true,
        status: "REJECTED",
        message: "Script rejected.",
      });
    }

    if (action === "regenerate") {
      // Reset to DRAFT - can regenerate script
      updateContentQueueItem(contentQueueId, {
        status: "DRAFT",
        reviewedAt: Date.now(),
        approvalNotes: `Regenerate requested: ${approvalNotes || ""}`,
      });

      return NextResponse.json({
        success: true,
        status: "DRAFT",
        message: "Script reset for regeneration.",
      });
    }
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
