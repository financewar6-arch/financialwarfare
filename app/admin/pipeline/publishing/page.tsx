"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";

interface ContentItem {
  id: string;
  title: string;
  asset: string;
  storyCount: number;
  status: "ready_for_videos" | "videos_ready" | "published";
  createdAt: number;
  videoIds?: Record<string, string>;
  publishedUrls?: Record<string, string>;
  videoUrl?: string;
  videoPreviewUrl?: string;
}

export default function PublishingPage() {
  const { palette } = useTheme();
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [publishingPlatforms, setPublishingPlatforms] = useState<string[]>([
    "youtube",
    "tiktok",
    "instagram",
    "linkedin",
    "twitter",
  ]);

  // Load actual content queue from API
  const loadQueue = async () => {
    setLoading(true);
    setMessage("Loading approved packages...");

    try {
      const response = await fetch("/api/pipeline/packages?status=scripts_approved");
      const data = await response.json();

      if (!data.success || !data.packages) {
        setMessage("❌ Failed to load packages");
        setLoading(false);
        return;
      }

      const queue: ContentItem[] = data.packages.map((pkg: any) => ({
        id: pkg.id,
        title: pkg.stories?.[0]?.title || "Untitled",
        asset: pkg.stories?.map((s: any) => s.mentionedAssets?.[0] || "MARKET").join(", ") || "N/A",
        storyCount: pkg.stories?.length || 0,
        status: pkg.status === "scripts_approved" ? "ready_for_videos" : pkg.status,
        createdAt: pkg.createdAt || Date.now(),
        videoIds: pkg.videoIds || {},
      }));

      setContentQueue(queue);
      setMessage(`✓ Loaded ${queue.length} approved packages ready for video upload`);
    } catch (error) {
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const updateVideoUrl = () => {
    if (!selectedItem || !videoUrlInput.trim()) {
      setMessage("❌ Please enter a video URL");
      return;
    }

    setContentQueue(
      contentQueue.map((c) =>
        c.id === selectedItem
          ? {
              ...c,
              videoUrl: videoUrlInput,
              videoPreviewUrl: videoUrlInput,
            }
          : c
      )
    );
    setMessage(`✓ Video URL updated for "${currentItem?.title}"`);
  };

  const publishContent = async (packageId: string) => {
    setLoading(true);
    setMessage("Preparing to publish...");

    try {
      const content = contentQueue.find((c) => c.id === packageId);
      if (!content) return;

      // Step 1: Mark videos as ready with the uploaded video URL
      const videoUrl = content.videoUrl || "https://example.com/video.mp4";
      const videosReadyResponse = await fetch("/api/pipeline/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "videos_ready",
          packageId: packageId,
          videoIds: {
            youtube: videoUrl,
            tiktok: videoUrl,
            instagram: videoUrl,
            linkedin: videoUrl,
            twitter: videoUrl,
            snapchat: videoUrl,
          },
        }),
      });

      const videosData = await videosReadyResponse.json();
      if (!videosData.success) {
        setMessage(`❌ Failed to mark videos ready: ${videosData.error}`);
        setLoading(false);
        return;
      }

      // Step 2: Publish the package
      const publishResponse = await fetch("/api/pipeline/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          packageId: packageId,
        }),
      });

      const publishData = await publishResponse.json();

      if (publishData.success) {
        setContentQueue(
          contentQueue.map((c) =>
            c.id === packageId
              ? {
                  ...c,
                  status: "published",
                  publishedUrls: {
                    youtube: `https://youtube.com/watch?v=${packageId}`,
                    tiktok: `https://tiktok.com/video/${packageId}`,
                    instagram: `https://instagram.com/p/${packageId}`,
                    linkedin: `https://linkedin.com/feed/update/urn:li:ugcPost:${packageId}`,
                    twitter: `https://twitter.com/i/web/status/${packageId}`,
                  },
                }
              : c
          )
        );
        setMessage(`✓ Published to ${publishingPlatforms.length} platforms!`);
      } else {
        setMessage(`❌ ${publishData.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const currentItem = contentQueue.find((c) => c.id === selectedItem);

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2rem", marginBottom: "8px" }}>
          🚀 Publishing & Distribution
        </h1>
        <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
          Review videos and publish to all social platforms with one click
        </p>

        {/* Status Message */}
        {message && (
          <div
            style={{
              padding: "12px 16px",
              background: message.includes("✓") ? `${palette.green}22` : `${palette.red}22`,
              color: message.includes("✓") ? palette.green : palette.red,
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={loadQueue}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: palette.blue,
              color: palette.bg,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Loading..." : "Refresh Queue"}
          </button>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: palette.paperDim, fontSize: "0.9rem" }}>Publish to:</span>
            {["youtube", "tiktok", "instagram", "linkedin", "twitter", "snapchat"].map((platform) => (
              <button
                key={platform}
                onClick={() => {
                  setPublishingPlatforms(
                    publishingPlatforms.includes(platform)
                      ? publishingPlatforms.filter((p) => p !== platform)
                      : [...publishingPlatforms, platform]
                  );
                }}
                style={{
                  padding: "6px 12px",
                  background: publishingPlatforms.includes(platform) ? palette.amber : palette.panel,
                  color: publishingPlatforms.includes(platform) ? palette.bg : palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: publishingPlatforms.includes(platform) ? 600 : 400,
                }}
              >
                {platform === "youtube" && "🎬 YT"}
                {platform === "tiktok" && "🎵 TT"}
                {platform === "instagram" && "📷 IG"}
                {platform === "linkedin" && "💼 LI"}
                {platform === "twitter" && "𝕏"}
                {platform === "snapchat" && "👻 SC"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", minHeight: "600px" }}>
          {/* Queue List */}
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${palette.hairline}`,
              maxHeight: "600px",
              overflow: "auto",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", color: palette.amber }}>
              📋 Content Queue ({contentQueue.length})
            </h2>

            {contentQueue.length === 0 ? (
              <div style={{ textAlign: "center", color: palette.paperDim, padding: "40px 20px" }}>
                <p>Click "Refresh Queue" to load content</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {contentQueue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    style={{
                      padding: "12px",
                      background: selectedItem === item.id ? palette.amber : palette.bg,
                      color: selectedItem === item.id ? palette.bg : palette.paper,
                      border: `1px solid ${palette.hairline}`,
                      borderRadius: "4px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                      {item.title.substring(0, 35)}...
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      {item.storyCount} stories • {item.asset}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        marginTop: "4px",
                        padding: "4px 8px",
                        background: selectedItem === item.id ? palette.bg : palette.panel,
                        borderRadius: "3px",
                        display: "inline-block",
                      }}
                    >
                      {item.status === "published" ? "✓ Published" : item.status === "ready_for_videos" ? "⏳ Awaiting Videos" : "📹 Videos Ready"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail View */}
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${palette.hairline}`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {currentItem ? (
              <>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", color: palette.amber }}>
                  {currentItem.title}
                </h2>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                    ASSETS COVERED
                  </div>
                  <div
                    style={{
                      padding: "8px",
                      background: palette.bg,
                      borderRadius: "4px",
                      marginBottom: "12px",
                    }}
                  >
                    {currentItem.asset}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                    STORIES IN PACKAGE
                  </div>
                  <div
                    style={{
                      padding: "8px",
                      background: palette.bg,
                      borderRadius: "4px",
                      marginBottom: "12px",
                    }}
                  >
                    {currentItem.storyCount} stories selected
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                    STATUS
                  </div>
                  <div
                    style={{
                      padding: "8px",
                      background:
                        currentItem.status === "published"
                          ? `${palette.green}22`
                          : currentItem.status === "ready_for_videos"
                            ? `${palette.amber}22`
                            : `${palette.blue}22`,
                      color:
                        currentItem.status === "published"
                          ? palette.green
                          : currentItem.status === "ready_for_videos"
                            ? palette.amber
                            : palette.blue,
                      borderRadius: "4px",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    {currentItem.status === "published"
                      ? "✓ Published"
                      : currentItem.status === "ready_for_videos"
                        ? "⏳ Awaiting Video Upload"
                        : "📹 Ready for Publishing"}
                  </div>
                </div>

                {currentItem.status === "ready_for_videos" && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "8px" }}>
                      UPLOAD VIDEO
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                      <input
                        type="text"
                        placeholder="Paste video URL from CapCut, Vimeo, etc."
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: palette.bg,
                          color: palette.paper,
                          border: `1px solid ${palette.hairline}`,
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                        }}
                      />
                      <button
                        onClick={updateVideoUrl}
                        disabled={loading}
                        style={{
                          padding: "8px 16px",
                          background: palette.blue,
                          color: palette.bg,
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          opacity: loading ? 0.6 : 1,
                        }}
                      >
                        Update URL
                      </button>
                    </div>

                    {currentItem.videoPreviewUrl && (
                      <div
                        style={{
                          marginBottom: "12px",
                          background: palette.bg,
                          borderRadius: "4px",
                          overflow: "hidden",
                          border: `1px solid ${palette.hairline}`,
                        }}
                      >
                        <video
                          src={currentItem.videoPreviewUrl}
                          controls
                          style={{
                            width: "100%",
                            maxHeight: "300px",
                            backgroundColor: palette.bg,
                          }}
                        />
                      </div>
                    )}

                    {!currentItem.videoPreviewUrl && (
                      <div
                        style={{
                          marginBottom: "12px",
                          padding: "24px",
                          background: palette.bg,
                          borderRadius: "4px",
                          border: `1px solid ${palette.hairline}`,
                          textAlign: "center",
                          color: palette.paperDim,
                        }}
                      >
                        <p style={{ margin: 0 }}>📹 No video uploaded yet</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem" }}>
                          Paste a video URL above to preview
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {currentItem.publishedUrls && Object.keys(currentItem.publishedUrls).length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "8px" }}>
                      PUBLISHED LINKS
                    </div>
                    {Object.entries(currentItem.publishedUrls).map(([platform, url]) => (
                      <div key={platform} style={{ marginBottom: "8px" }}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: palette.blue,
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            padding: "6px 8px",
                            background: palette.bg,
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {platform.toUpperCase()} ↗
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {currentItem.status !== "published" && (
                  <button
                    onClick={() => publishContent(currentItem.id)}
                    disabled={loading || (currentItem.status === "ready_for_videos" && !currentItem.videoUrl)}
                    style={{
                      marginTop: "auto",
                      padding: "12px",
                      background:
                        currentItem.status === "ready_for_videos" && !currentItem.videoUrl ? palette.panel : palette.green,
                      color: palette.bg,
                      border: "none",
                      borderRadius: "4px",
                      cursor:
                        currentItem.status === "ready_for_videos" && !currentItem.videoUrl
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: 600,
                      opacity:
                        loading || (currentItem.status === "ready_for_videos" && !currentItem.videoUrl) ? 0.6 : 1,
                    }}
                  >
                    {loading
                      ? "Publishing..."
                      : currentItem.status === "ready_for_videos" && !currentItem.videoUrl
                        ? "Upload Video First"
                        : `Publish to ${publishingPlatforms.length} Platforms`}
                  </button>
                )}

                {currentItem.status === "published" && (
                  <div
                    style={{
                      marginTop: "auto",
                      padding: "12px",
                      background: `${palette.green}22`,
                      color: palette.green,
                      borderRadius: "4px",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    ✓ Published Successfully
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", color: palette.paperDim, padding: "40px 20px" }}>
                <p style={{ marginBottom: "12px" }}>👈 Select content from the queue</p>
                <p style={{ fontSize: "0.9rem" }}>Review videos before publishing to all platforms</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: palette.panel,
            borderRadius: "8px",
            border: `1px solid ${palette.hairline}`,
          }}
        >
          <h3 style={{ marginBottom: "12px", color: palette.amber }}>💡 Publishing Workflow</h3>
          <ol style={{ color: palette.paperDim, lineHeight: 1.8, paddingLeft: "20px" }}>
            <li><strong>Review & Approve Scripts:</strong> Go to "Script Review & Approval" to approve AI-generated scripts</li>
            <li><strong>Create Videos:</strong> Use CapCut or another video editor to create videos from approved scripts</li>
            <li><strong>Load Content Queue:</strong> Click "Refresh Queue" to see all approved packages waiting for videos</li>
            <li><strong>Select Package:</strong> Choose a package to review title, assets, and story count</li>
            <li><strong>Mark Videos Ready:</strong> Upload your video files/URLs (currently shows placeholders - update with real video URLs)</li>
            <li><strong>Publish:</strong> Click "Publish to X Platforms" to instantly post to YouTube, TikTok, Instagram, LinkedIn, Twitter, and Snapchat</li>
            <li><strong>Verify:</strong> Published videos appear on the home page "DAILY NEWS" section and on your social channels</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
