import { NextRequest, NextResponse } from "next/server";
import {
  createContentPackage,
  approvePackage,
  rejectPackage,
  markVideosReady,
  publishPackage,
  updatePackageStatus,
} from "@/lib/models/content-package";
import type { ContentPackage } from "@/lib/models/content-package";

// In-memory storage for demo - in production use database
const packageStore = new Map<string, ContentPackage>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const id = searchParams.get("id");

    if (id) {
      const pkg = packageStore.get(id);
      if (!pkg) {
        return NextResponse.json({ error: "Package not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, package: pkg });
    }

    // List all packages, optionally filtered by status
    const packages = Array.from(packageStore.values())
      .filter((pkg) => !status || pkg.status === status)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      packages,
      total: packages.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error in GET /api/pipeline/packages:", error);
    return NextResponse.json(
      { error: "Failed to get packages", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, stories, scripts, lookbackHours, packageId, ...metadata } = body;

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    // CREATE new package
    if (action === "create") {
      if (!stories || !Array.isArray(stories)) {
        return NextResponse.json({ error: "Stories array required" }, { status: 400 });
      }

      const pkg = createContentPackage(
        stories,
        scripts || [],
        lookbackHours || 16
      );

      packageStore.set(pkg.id, pkg);

      return NextResponse.json({
        success: true,
        package: pkg,
        message: "Content package created successfully",
      });
    }

    if (!packageId) {
      return NextResponse.json({ error: "PackageId required for this action" }, { status: 400 });
    }

    const pkg = packageStore.get(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // APPROVE package
    if (action === "approve") {
      const { reviewedBy, notes } = metadata;
      const updated = approvePackage(pkg, reviewedBy || "admin", notes);
      packageStore.set(packageId, updated);
      return NextResponse.json({
        success: true,
        package: updated,
        message: "Package approved for video generation",
      });
    }

    // REJECT package
    if (action === "reject") {
      const { reason, reviewedBy } = metadata;
      const updated = rejectPackage(pkg, reason || "No reason provided", reviewedBy);
      packageStore.set(packageId, updated);
      return NextResponse.json({
        success: true,
        package: updated,
        message: "Package rejected",
      });
    }

    // MARK VIDEOS READY
    if (action === "videos_ready") {
      const { videoIds } = metadata;
      if (!videoIds || typeof videoIds !== "object") {
        return NextResponse.json({ error: "VideoIds object required" }, { status: 400 });
      }
      const updated = markVideosReady(pkg, videoIds);
      packageStore.set(packageId, updated);
      return NextResponse.json({
        success: true,
        package: updated,
        message: "Videos marked as ready for publishing",
      });
    }

    // PUBLISH package
    if (action === "publish") {
      if (pkg.status !== "videos_ready") {
        return NextResponse.json(
          { error: "Videos must be ready before publishing", status: pkg.status },
          { status: 400 }
        );
      }
      const updated = publishPackage(pkg);
      packageStore.set(packageId, updated);
      return NextResponse.json({
        success: true,
        package: updated,
        message: "Package published to all platforms",
      });
    }

    // UPDATE status
    if (action === "update_status") {
      const { status } = metadata;
      if (!status) {
        return NextResponse.json({ error: "Status required" }, { status: 400 });
      }
      const updated = updatePackageStatus(pkg, status, metadata);
      packageStore.set(packageId, updated);
      return NextResponse.json({
        success: true,
        package: updated,
        message: `Package status updated to ${status}`,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST /api/pipeline/packages:", error);
    return NextResponse.json(
      { error: "Failed to process package", details: String(error) },
      { status: 500 }
    );
  }
}
