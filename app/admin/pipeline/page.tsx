"use client";

import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

export default function PipelineDashboard() {
  const { palette } = useTheme();

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2.5rem", marginBottom: "8px" }}>
            🎬 Pipeline Control Center
          </h1>
          <p style={{ color: palette.paperDim, fontSize: "1.1rem" }}>
            Automated news → script → video → social publishing system
          </p>
        </div>

        {/* Status Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "20px",
              border: `2px solid ${palette.blue}`,
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📰</div>
            <div style={{ fontSize: "0.85rem", color: palette.paperDim, marginBottom: "4px" }}>
              NEXT RUN
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "12px" }}>
              Tomorrow 6 AM
            </div>
            <p style={{ fontSize: "0.85rem", color: palette.paperDim, lineHeight: 1.6 }}>
              Automated story selection and script generation
            </p>
          </div>

          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "20px",
              border: `2px solid ${palette.amber}`,
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>⏱️</div>
            <div style={{ fontSize: "0.85rem", color: palette.paperDim, marginBottom: "4px" }}>
              DAILY WORKFLOW
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "12px" }}>
              1-1.5 hours
            </div>
            <p style={{ fontSize: "0.85rem", color: palette.paperDim, lineHeight: 1.6 }}>
              Review scripts, make videos, publish
            </p>
          </div>

          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "20px",
              border: `2px solid ${palette.green}`,
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📊</div>
            <div style={{ fontSize: "0.85rem", color: palette.paperDim, marginBottom: "4px" }}>
              PLATFORMS
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "12px" }}>
              6 Total
            </div>
            <p style={{ fontSize: "0.85rem", color: palette.paperDim, lineHeight: 1.6 }}>
              YouTube, TikTok, Instagram, LinkedIn, Twitter, Snapchat
            </p>
          </div>
        </div>

        {/* Main Pipeline Steps */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "20px", color: palette.amber }}>
            📍 Pipeline Workflow
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Step 1 */}
            <Link href="/admin/pipeline/review-scripts">
              <div
                style={{
                  background: palette.panel,
                  borderRadius: "8px",
                  padding: "20px",
                  border: `1px solid ${palette.hairline}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
                  (e.currentTarget as HTMLElement).style.backgroundColor = palette.bg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
                  (e.currentTarget as HTMLElement).style.backgroundColor = palette.panel;
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>1️⃣</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>
                  Review Scripts
                </h3>
                <p style={{ color: palette.paperDim, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  See top 5 stories, review platform-specific scripts for YouTube, TikTok, Instagram,
                  LinkedIn, Twitter
                </p>
                <div style={{ marginTop: "12px", fontSize: "0.8rem", color: palette.blue }}>
                  → Open Dashboard
                </div>
              </div>
            </Link>

            {/* Step 2 */}
            <div
              style={{
                background: palette.panel,
                borderRadius: "8px",
                padding: "20px",
                border: `1px solid ${palette.hairline}`,
                opacity: 0.7,
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>2️⃣</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>
                Make Videos
              </h3>
              <p style={{ color: palette.paperDim, fontSize: "0.85rem", lineHeight: 1.6 }}>
                Use CapCut (or any video editor) to create professional videos using the generated
                scripts
              </p>
              <div style={{ marginTop: "12px", fontSize: "0.8rem", color: palette.paperDim }}>
                Manual step (45-90 min)
              </div>
            </div>

            {/* Step 3 */}
            <Link href="/admin/pipeline/publishing">
              <div
                style={{
                  background: palette.panel,
                  borderRadius: "8px",
                  padding: "20px",
                  border: `1px solid ${palette.hairline}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.green;
                  (e.currentTarget as HTMLElement).style.backgroundColor = palette.bg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
                  (e.currentTarget as HTMLElement).style.backgroundColor = palette.panel;
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>3️⃣</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>
                  Publish Videos
                </h3>
                <p style={{ color: palette.paperDim, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Upload videos and click "Publish" to instantly distribute to all 6 platforms
                </p>
                <div style={{ marginTop: "12px", fontSize: "0.8rem", color: palette.green }}>
                  → Open Publishing
                </div>
              </div>
            </Link>

            {/* Step 4 */}
            <Link href="/admin/pipeline/analytics">
              <div
                style={{
                  background: palette.panel,
                  borderRadius: "8px",
                  padding: "20px",
                  border: `1px solid ${palette.hairline}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.red;
                  (e.currentTarget as HTMLElement).style.backgroundColor = palette.bg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
                  (e.currentTarget as HTMLElement).style.backgroundColor = palette.panel;
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>4️⃣</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>
                  Track Analytics
                </h3>
                <p style={{ color: palette.paperDim, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Monitor performance across platforms, identify top assets, optimize content strategy
                </p>
                <div style={{ marginTop: "12px", fontSize: "0.8rem", color: palette.red }}>
                  → View Analytics
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* API Endpoints */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "20px", color: palette.amber }}>
            🔌 API Endpoints
          </h2>

          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "20px",
              border: `1px solid ${palette.hairline}`,
              fontFamily: "monospace",
              fontSize: "0.85rem",
              overflowX: "auto",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: palette.blue, fontWeight: 600 }}>GET /api/pipeline/stories</div>
              <div style={{ color: palette.paperDim }}>Get top stories for the day</div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: palette.blue, fontWeight: 600 }}>POST /api/pipeline/generate-scripts</div>
              <div style={{ color: palette.paperDim }}>Generate platform-specific scripts</div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: palette.blue, fontWeight: 600 }}>POST /api/pipeline/publish</div>
              <div style={{ color: palette.paperDim }}>Publish to multiple platforms</div>
            </div>

            <div>
              <div style={{ color: palette.blue, fontWeight: 600 }}>GET /api/pipeline/analytics</div>
              <div style={{ color: palette.paperDim }}>Get performance metrics</div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div
          style={{
            background: palette.panel,
            borderRadius: "8px",
            padding: "20px",
            border: `1px solid ${palette.hairline}`,
          }}
        >
          <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: palette.amber }}>
            🚀 Quick Start
          </h2>
          <ol style={{ color: palette.paperDim, lineHeight: 2, paddingLeft: "20px" }}>
            <li>
              <strong>Daily at 6 AM ET:</strong> Top stories are selected and scripts generated automatically
            </li>
            <li>
              <strong>9-10 AM:</strong> Open "Review Scripts" → approve all 5 platform variants
            </li>
            <li>
              <strong>10-11:30 AM:</strong> Create 3-6 videos in CapCut using the generated scripts
            </li>
            <li>
              <strong>12 PM:</strong> Go to "Publish Videos" → upload → click "Publish to All Platforms"
            </li>
            <li>
              <strong>All day:</strong> Videos live and generating engagement across YouTube, TikTok, IG, LinkedIn, Twitter
            </li>
            <li>
              <strong>Track performance</strong> in "Analytics" to optimize future content
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: `1px solid ${palette.hairline}`,
            color: palette.paperDim,
            fontSize: "0.85rem",
            textAlign: "center",
          }}
        >
          <p>
            📚 See <strong>PIPELINE_SETUP.md</strong> for complete documentation and API key setup
          </p>
          <p style={{ marginTop: "8px" }}>
            🔗 For help with platform integrations, visit platform-specific developer docs
          </p>
        </div>
      </div>
    </div>
  );
}
