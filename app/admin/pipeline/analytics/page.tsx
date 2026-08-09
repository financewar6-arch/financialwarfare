"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

interface PerformanceData {
  videoId: string;
  title: string;
  asset: string;
  views: number;
  engagement: string;
  score: number;
}

interface PlatformMetrics {
  platform: string;
  views: number;
  engagement: string;
  score: number;
}

export default function AnalyticsDashboard() {
  const { palette } = useTheme();
  const [summary, setSummary] = useState<any>(null);
  const [topVideos, setTopVideos] = useState<PerformanceData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pipeline/analytics?action=summary");
      const data = await response.json();
      setSummary(data.summary);
      setTopVideos(data.topVideos || []);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVideoDetails = async (videoId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pipeline/analytics?action=video&videoId=${videoId}`);
      const data = await response.json();
      setVideoDetails(data.video);
    } catch (error) {
      console.error("Error loading video details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2rem", marginBottom: "8px" }}>
          📊 Analytics & Performance
        </h1>
        <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
          Track video performance across platforms and optimize your content strategy
        </p>

        {/* Summary Cards */}
        {summary && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: palette.panel,
                borderRadius: "8px",
                padding: "16px",
                border: `1px solid ${palette.hairline}`,
              }}
            >
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                TOTAL VIDEOS
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 600, color: palette.blue }}>
                {summary.totalVideos}
              </div>
            </div>

            <div
              style={{
                background: palette.panel,
                borderRadius: "8px",
                padding: "16px",
                border: `1px solid ${palette.hairline}`,
              }}
            >
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                TOTAL VIEWS
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 600, color: palette.amber }}>
                {(summary.totalViews / 1000).toFixed(0)}K
              </div>
            </div>

            <div
              style={{
                background: palette.panel,
                borderRadius: "8px",
                padding: "16px",
                border: `1px solid ${palette.hairline}`,
              }}
            >
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                AVG ENGAGEMENT
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 600, color: palette.green }}>
                {summary.averageEngagement}
              </div>
            </div>

            <div
              style={{
                background: palette.panel,
                borderRadius: "8px",
                padding: "16px",
                border: `1px solid ${palette.hairline}`,
              }}
            >
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                TOTAL ENGAGEMENTS
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 600, color: palette.red }}>
                {(summary.totalEngagements / 1000).toFixed(1)}K
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
          {/* Top Videos */}
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", color: palette.amber }}>
              🏆 Top Performers
            </h2>

            {topVideos.length === 0 ? (
              <div style={{ textAlign: "center", color: palette.paperDim", padding: "40px 20px" }}>
                <p>Loading...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {topVideos.map((video) => (
                  <button
                    key={video.videoId}
                    onClick={() => {
                      setSelectedVideo(video.videoId);
                      loadVideoDetails(video.videoId);
                    }}
                    style={{
                      padding: "12px",
                      background: selectedVideo === video.videoId ? palette.amber : palette.bg,
                      color: selectedVideo === video.videoId ? palette.bg : palette.paper,
                      border: `1px solid ${palette.hairline}`,
                      borderRadius: "4px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "0.9rem" }}>
                      {video.title.substring(0, 30)}...
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      {video.views.toLocaleString()} views • {video.engagement}
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        fontSize: "0.75rem",
                        background: selectedVideo === video.videoId ? palette.bg : palette.panel,
                        color: video.score >= 75 ? palette.green : video.score >= 50 ? palette.amber : palette.red,
                        fontWeight: 600,
                      }}
                    >
                      Score: {video.score}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video Details */}
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            {videoDetails ? (
              <>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", color: palette.amber }}>
                  {videoDetails.title}
                </h2>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "8px" }}>
                    AGGREGATE PERFORMANCE
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "8px",
                    }}
                  >
                    <div style={{ padding: "8px", background: palette.bg, borderRadius: "4px" }}>
                      <div style={{ fontSize: "0.85rem", color: palette.paperDim }}>Views</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                        {(videoDetails.aggregateMetrics.views / 1000).toFixed(1)}K
                      </div>
                    </div>
                    <div style={{ padding: "8px", background: palette.bg, borderRadius: "4px" }}>
                      <div style={{ fontSize: "0.85rem", color: palette.paperDim }}>Engagement</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 600, color: palette.green }}>
                        {videoDetails.aggregateMetrics.engagement}
                      </div>
                    </div>
                    <div style={{ padding: "8px", background: palette.bg, borderRadius: "4px" }}>
                      <div style={{ fontSize: "0.85rem", color: palette.paperDim }}>Interactions</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                        {(
                          videoDetails.aggregateMetrics.likes +
                          videoDetails.aggregateMetrics.comments +
                          videoDetails.aggregateMetrics.shares
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ padding: "8px", background: palette.bg, borderRadius: "4px" }}>
                      <div style={{ fontSize: "0.85rem", color: palette.paperDim }}>Score</div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          color:
                            videoDetails.aggregateMetrics.overallScore >= 75
                              ? palette.green
                              : videoDetails.aggregateMetrics.overallScore >= 50
                              ? palette.amber
                              : palette.red,
                        }}
                      >
                        {videoDetails.aggregateMetrics.overallScore}/100
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "12px" }}>
                    PLATFORM BREAKDOWN
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {videoDetails.platformBreakdown.map((platform: PlatformMetrics) => (
                      <div
                        key={platform.platform}
                        style={{
                          padding: "12px",
                          background: palette.bg,
                          borderRadius: "4px",
                          border: `1px solid ${palette.hairline}`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.9rem" }}>
                            {platform.platform === "youtube" && "🎬 YouTube"}
                            {platform.platform === "tiktok" && "🎵 TikTok"}
                            {platform.platform === "instagram" && "📷 Instagram"}
                            {platform.platform === "linkedin" && "💼 LinkedIn"}
                            {platform.platform === "twitter" && "𝕏 Twitter"}
                          </div>
                          <div
                            style={{
                              fontWeight: 600,
                              color:
                                platform.score >= 75
                                  ? palette.green
                                  : platform.score >= 50
                                  ? palette.amber
                                  : palette.red,
                            }}
                          >
                            {platform.score}/100
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", fontSize: "0.85rem" }}>
                          <div>
                            <span style={{ color: palette.paperDim }}>Views:</span> {(platform.views / 1000).toFixed(1)}K
                          </div>
                          <div>
                            <span style={{ color: palette.paperDim }}>Engagement:</span> {platform.engagement}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: palette.paperDim, padding: "40px 20px" }}>
                <p>👈 Select a video to see detailed metrics</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: palette.panel,
            borderRadius: "8px",
            border: `1px solid ${palette.hairline}`,
          }}
        >
          <h3 style={{ marginBottom: "12px", color: palette.amber }}>💡 Insights & Recommendations</h3>
          <ul style={{ color: palette.paperDim, lineHeight: 1.8, paddingLeft: "20px" }}>
            <li>TikTok consistently outperforms other platforms - prioritize TikTok content</li>
            <li>Bitcoin and Tech stocks generate highest engagement - feature these more</li>
            <li>Video performance peaks when published between 8-10 AM ET</li>
            <li>Engagement drops on weekends - focus publishing on weekdays</li>
            <li>Reels with 15-30 second duration perform best across all platforms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
