"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

interface Story {
  id: string;
  title: string;
  description: string;
  mentionedAssets: string[];
  score: number;
}

interface Script {
  platform: "youtube" | "tiktok" | "instagram" | "linkedin" | "snapchat";
  title: string;
  script: string;
  duration: number;
  hashtags: string[];
  hook: string;
  cta: string;
}

interface GeneratedContent {
  storyId: string;
  storyTitle: string;
  asset: string;
  scripts: Script[];
  status: string;
}

export default function ReviewScriptsPage() {
  const { palette } = useTheme();
  const [stories, setStories] = useState<Story[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [viewingPlatform, setViewingPlatform] = useState<"youtube" | "tiktok" | "instagram" | "linkedin" | "snapchat" | null>(null);

  // Fetch top stories
  const fetchTopStories = async () => {
    setLoading(true);
    setMessage("Loading top stories...");
    try {
      const response = await fetch("/api/pipeline/stories?topCount=5&lookbackHours=16");
      const data = await response.json();
      if (data.success) {
        setStories(data.stories);
        setMessage(`✓ Loaded ${data.stories.length} top stories`);
      } else {
        setMessage("❌ Failed to load stories");
      }
    } catch (error) {
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate scripts for stories
  const generateScripts = async () => {
    if (stories.length === 0) {
      setMessage("❌ No stories selected");
      return;
    }

    setLoading(true);
    setMessage("Generating scripts for all stories...");
    try {
      const response = await fetch("/api/pipeline/generate-scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stories }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data.scripts);
        setMessage(`✓ Generated scripts for ${data.successful} stories`);
      } else {
        setMessage("❌ Failed to generate scripts");
      }
    } catch (error) {
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopStories();
  }, []);

  const currentContent = generatedContent.find((g) => g.storyId === selectedStory);
  const currentScript = currentContent?.scripts.find((s) => s.platform === viewingPlatform);

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2rem", marginBottom: "8px" }}>
          🎬 Script Review & Approval
        </h1>
        <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
          Review AI-generated scripts for each platform before publishing
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
              fontFamily: "var(--font-body)",
            }}
          >
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={fetchTopStories}
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
            {loading ? "Loading..." : "Refresh Stories"}
          </button>
          <button
            onClick={generateScripts}
            disabled={loading || stories.length === 0}
            style={{
              padding: "10px 20px",
              background: palette.amber,
              color: palette.bg,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: loading || stories.length === 0 ? 0.6 : 1,
            }}
          >
            {loading ? "Generating..." : `Generate Scripts for ${stories.length} Stories`}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", minHeight: "600px" }}>
          {/* Left: Stories List */}
          <div
            style={{
              background: palette.panel,
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", color: palette.amber }}>
              📰 Top Stories ({stories.length})
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story.id);
                    setViewingPlatform(null);
                  }}
                  style={{
                    padding: "12px",
                    background: selectedStory === story.id ? palette.amber : palette.bg,
                    color: selectedStory === story.id ? palette.bg : palette.paper,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px" }}>
                    {story.title.substring(0, 40)}...
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    Score: {story.score}/100 • Assets: {story.mentionedAssets?.join(", ")}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Script Viewer */}
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
            {currentContent ? (
              <>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "16px", color: palette.amber }}>
                  {currentContent.storyTitle}
                </h2>

                {/* Platform Tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  {currentContent.scripts.map((script) => (
                    <button
                      key={script.platform}
                      onClick={() => setViewingPlatform(script.platform)}
                      style={{
                        padding: "8px 12px",
                        background: viewingPlatform === script.platform ? palette.amber : palette.bg,
                        color: viewingPlatform === script.platform ? palette.bg : palette.paper,
                        border: `1px solid ${palette.hairline}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: viewingPlatform === script.platform ? 600 : 400,
                      }}
                    >
                      {script.platform.toUpperCase()} ({script.duration}s)
                    </button>
                  ))}
                </div>

                {/* Script Display */}
                {currentScript ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                        TITLE
                      </div>
                      <div
                        style={{
                          padding: "8px",
                          background: palette.bg,
                          borderRadius: "4px",
                          fontWeight: 500,
                          marginBottom: "12px",
                        }}
                      >
                        {currentScript.title}
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                        HOOK
                      </div>
                      <div
                        style={{
                          padding: "8px",
                          background: palette.bg,
                          borderRadius: "4px",
                          fontStyle: "italic",
                          marginBottom: "12px",
                        }}
                      >
                        "{currentScript.hook}"
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                        SCRIPT ({currentScript.duration}s)
                      </div>
                      <textarea
                        defaultValue={currentScript.script}
                        readOnly
                        rows={8}
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: palette.bg,
                          color: palette.paper,
                          border: `1px solid ${palette.hairline}`,
                          borderRadius: "4px",
                          fontFamily: "monospace",
                          fontSize: "0.85rem",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                        HASHTAGS
                      </div>
                      <div
                        style={{
                          padding: "8px",
                          background: palette.bg,
                          borderRadius: "4px",
                          wordBreak: "break-word",
                          fontSize: "0.9rem",
                        }}
                      >
                        {currentScript.hashtags.join(" ")}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                        CTA
                      </div>
                      <div
                        style={{
                          padding: "8px",
                          background: palette.bg,
                          borderRadius: "4px",
                          fontWeight: 500,
                        }}
                      >
                        {currentScript.cta}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: palette.paperDim, padding: "40px 20px" }}>
                    Select a platform to view script
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: palette.green,
                      color: palette.bg,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ✓ Approve All
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: palette.red,
                      color: palette.bg,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ✗ Reject
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: palette.paperDim, padding: "40px 20px" }}>
                <p style={{ marginBottom: "12px" }}>👈 Select a story from the left to review scripts</p>
                <p style={{ fontSize: "0.9rem" }}>First, click "Generate Scripts" to create all platform variants</p>
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
          <h3 style={{ marginBottom: "12px", color: palette.amber }}>💡 Workflow</h3>
          <ol style={{ color: palette.paperDim, lineHeight: 1.8, paddingLeft: "20px" }}>
            <li>Click "Refresh Stories" to load the top stories from the last 16 hours</li>
            <li>Click "Generate Scripts" to create platform-specific scripts for all stories</li>
            <li>Review each story and its scripts for all 5 platforms</li>
            <li>Approve stories you want to publish or reject those needing edits</li>
            <li>Approved scripts feed into the video generation pipeline</li>
            <li>You can edit video content in CapCut, then publish with one click</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
