"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";

interface ArticlePreview {
  title: string;
  subtitle?: string;
  author: string;
  publishedAt: number;
  coverImage?: string;
  description: string;
  summary: string;
  url: string;
}

export default function SundayOutlookAdmin() {
  const { palette } = useTheme();
  const [substackUrl, setSubstackUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<ArticlePreview | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<ArticlePreview>>({});

  const handleFetch = async () => {
    if (!substackUrl.trim()) {
      setMessage("❌ Please enter a Substack URL");
      return;
    }

    setLoading(true);
    setMessage("Fetching article...");

    try {
      const response = await fetch("/api/sunday-outlook/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ substackUrl }),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(`❌ ${data.error || "Failed to fetch article"}`);
        setLoading(false);
        return;
      }

      setPreview(data.article);
      setEditData(data.article);
      setMessage("✓ Article loaded. Review and publish.");
    } catch (error) {
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!preview) return;

    setLoading(true);
    setMessage("Publishing...");

    try {
      const response = await fetch("/api/sunday-outlook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          ...editData,
          substackUrl: preview.url,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(`❌ ${data.error || "Failed to publish"}`);
        setLoading(false);
        return;
      }

      setMessage("✓ Sunday Outlook published!");
      setPreview(null);
      setEditData({});
      setSubstackUrl("");
      setEditMode(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2rem", marginBottom: "8px" }}>
            📰 Sunday Outlook
          </h1>
          <p style={{ color: palette.paperDim }}>
            Add your Financial Opp weekly outlook to Financial Warfare
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            style={{
              padding: "16px",
              background: message.includes("✓") ? `${palette.green}22` : `${palette.red}22`,
              color: message.includes("✓") ? palette.green : palette.red,
              borderRadius: "4px",
              marginBottom: "24px",
              fontSize: "0.95rem",
            }}
          >
            {message}
          </div>
        )}

        {!preview ? (
          // Input Section
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "40px",
              border: `1px solid ${palette.hairline}`,
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "8px", color: palette.amber }}>
                Add New Outlook
              </h2>
              <p style={{ color: palette.paperDim, fontSize: "0.95rem" }}>
                Paste your Substack article URL below
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="https://financialopp.substack.com/p/your-article-title"
                value={substackUrl}
                onChange={(e) => setSubstackUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleFetch()}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: palette.bg,
                  color: palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontFamily: "monospace",
                }}
              />
            </div>

            <button
              onClick={handleFetch}
              disabled={loading || !substackUrl.trim()}
              style={{
                padding: "12px 32px",
                background: palette.amber,
                color: palette.bg,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                opacity: loading || !substackUrl.trim() ? 0.6 : 1,
              }}
            >
              {loading ? "Fetching..." : "Fetch Article"}
            </button>

            <div style={{ marginTop: "40px", paddingTop: "40px", borderTop: `1px solid ${palette.hairline}` }}>
              <h3 style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "12px" }}>
                How it works:
              </h3>
              <ol style={{ color: palette.paperDim, fontSize: "0.85rem", textAlign: "left", display: "inline-block" }}>
                <li>Publish your article on Financial Opp/Substack</li>
                <li>Copy the article URL</li>
                <li>Paste it above and click "Fetch Article"</li>
                <li>Review the preview and edit as needed</li>
                <li>Click "Publish" to add to Financial Warfare</li>
              </ol>
            </div>
          </div>
        ) : (
          // Preview Section
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "40px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <h2 style={{ fontSize: "1.3rem", marginBottom: "32px", color: palette.amber }}>
              Review Outlook
            </h2>

            {/* Title */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: palette.paperDim, fontSize: "0.8rem", marginBottom: "4px" }}>
                TITLE
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={editData.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: palette.bg,
                    color: palette.paper,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{editData.title || preview.title}</div>
              )}
            </div>

            {/* Author & Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", color: palette.paperDim, fontSize: "0.8rem", marginBottom: "4px" }}>
                  AUTHOR
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.author || ""}
                    onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: palette.bg,
                      color: palette.paper,
                      border: `1px solid ${palette.hairline}`,
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <div style={{ fontWeight: 600 }}>{editData.author || preview.author}</div>
                )}
              </div>

              <div>
                <label style={{ display: "block", color: palette.paperDim, fontSize: "0.8rem", marginBottom: "4px" }}>
                  DATE
                </label>
                <div style={{ fontWeight: 600 }}>
                  {new Date(editData.publishedAt || preview.publishedAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Image */}
            {(editData.coverImage || preview.coverImage) && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", color: palette.paperDim, fontSize: "0.8rem", marginBottom: "4px" }}>
                  COVER IMAGE
                </label>
                <img
                  src={editData.coverImage || preview.coverImage}
                  alt="Cover"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "4px",
                    marginTop: "8px",
                  }}
                />
              </div>
            )}

            {/* Summary */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: palette.paperDim, fontSize: "0.8rem", marginBottom: "4px" }}>
                SUMMARY
              </label>
              {editMode ? (
                <textarea
                  value={editData.summary || ""}
                  onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: palette.bg,
                    color: palette.paper,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                    fontFamily: "inherit",
                  }}
                />
              ) : (
                <div style={{ color: palette.paperDim, lineHeight: 1.6 }}>
                  {editData.summary || preview.summary}
                </div>
              )}
            </div>

            {/* Original URL */}
            <div style={{ marginBottom: "32px", padding: "12px", background: palette.bg, borderRadius: "4px" }}>
              <div style={{ color: palette.paperDim, fontSize: "0.8rem", marginBottom: "4px" }}>
                SOURCE URL
              </div>
              <a
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: palette.blue,
                  textDecoration: "none",
                  wordBreak: "break-all",
                  fontSize: "0.85rem",
                }}
              >
                {preview.url}
              </a>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  padding: "10px 20px",
                  background: palette.panel,
                  color: palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {editMode ? "Done Editing" : "Edit"}
              </button>

              <button
                onClick={handlePublish}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: palette.green,
                  color: palette.bg,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                  opacity: loading ? 0.6 : 1,
                  flex: 1,
                }}
              >
                {loading ? "Publishing..." : "✓ Publish Outlook"}
              </button>

              <button
                onClick={() => {
                  setPreview(null);
                  setEditMode(false);
                  setSubstackUrl("");
                }}
                style={{
                  padding: "10px 20px",
                  background: palette.panel,
                  color: palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
