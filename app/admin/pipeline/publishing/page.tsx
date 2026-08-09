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
}

export default function PublishingPage() {
  const { palette } = useTheme();
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [publishingPlatforms, setPublishingPlatforms] = useState<string[]>([
    "youtube",
    "tiktok",
    "instagram",
    "linkedin",
    "twitter",
  ]);

  // Simulate loading content queue
  const loadQueue = async () => {
    setLoading(true);
    setMessage("Loading content queue...");

    // Mock data
    const mockQueue: ContentItem[] = [
      {
        id: "pkg-001",
        title: "Bitcoin Surge + Fed Signals = Market Rally",
        asset: "BTC, SPY, GOLD",
        storyCount: 4,
        status: "videos_ready",
        createdAt: Date.now() - 2 * 60 * 60 * 1000,
        videoIds: {
          youtube: "mock-yt-123",
          tiktok: "mock-tt-456",
          instagram: "mock-ig-789",
        },
      },
      {
        id: "pkg-002",
        title: "Tech Earnings Beat Expectations",
        asset: "AAPL, MSFT, NVDA",
        storyCount: 3,
        status: "videos_ready",
        createdAt: Date.now() - 1 * 60 * 60 * 1000,
        videoIds: {
          youtube: "mock-yt-111",
          tiktok: "mock-tt-222",
          instagram: "mock-ig-333",
        },
      },
    ];

    setContentQueue(mockQueue);
    setMessage(`✓ Loaded ${mockQueue.length} items in queue`);
    setLoading(false);
  };

  const publishContent = async (packageId: string) => {
    setLoading(true);
    setMessage("Publishing to platforms...");

    try {
      const content = contentQueue.find((c) => c.id === packageId);
      if (!content) return;

      const response = await fetch("/api/pipeline/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: "https://example.com/video.mp4",
          title: content.title,
          description: `Daily market update: ${content.asset}`,
          hashtags: ["#Markets", "#Trading", "#FinancialWarfare"],
          platforms: publishingPlatforms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContentQueue(
          contentQueue.map((c) =>
            c.id === packageId
              ? {
                  ...c,
                  status: "published",
                  publishedUrls: Object.fromEntries(
                    Object.entries(data.results).map(([platform, result]: any) => [
                      platform,
                      result.url || "",
                    ])
                  ),
                }
              : c
          )
        );
        setMessage(
          `✓ Published to ${data.summary.successful}/${publishingPlatforms.length} platforms`
        );
      } else {
        setMessage(`❌ ${data.error}`);
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
                      {item.status === "published" ? "✓ Published" : "📹 Videos Ready"}
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
                        currentItem.status === "published" ? `${palette.green}22` : `${palette.blue}22`,
                      color: currentItem.status === "published" ? palette.green : palette.blue,
                      borderRadius: "4px",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    {currentItem.status === "published" ? "✓ Published" : "📹 Ready for Publishing"}
                  </div>
                </div>

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
                    disabled={loading}
                    style={{
                      marginTop: "auto",
                      padding: "12px",
                      background: palette.green,
                      color: palette.bg,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: 600,
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? "Publishing..." : `Publish to ${publishingPlatforms.length} Platforms`}
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
            <li>Select which platforms to publish to (all 5 platforms selected by default)</li>
            <li>Load your content queue - shows all videos ready for publishing</li>
            <li>Select a package to review title, assets, and story count</li>
            <li>Click "Publish to X Platforms" to instantly post to YouTube, TikTok, Instagram, LinkedIn, and Twitter</li>
            <li>Once published, links appear in the detail view</li>
            <li>One-click publishing saves hours of manual cross-platform uploading!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
