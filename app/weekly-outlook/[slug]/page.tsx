"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

interface Outlook {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  publishedAt: number;
  coverImage?: string;
  summary: string;
  substackUrl: string;
  featured: boolean;
}

export default function OutlookArticle() {
  const { palette } = useTheme();
  const params = useParams();
  const slug = params.slug as string;

  const [outlook, setOutlook] = useState<Outlook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOutlook = async () => {
      try {
        const response = await fetch(`/api/sunday-outlook?slug=${slug}`);
        const data = await response.json();

        if (data.success) {
          setOutlook(data.outlook);
          // Track the click when the page loads
          if (data.outlook) {
            fetch(`/api/sunday-outlook`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "track_click",
                id: data.outlook.id,
              }),
            }).catch(() => {});
          }
        } else {
          setError("Outlook not found");
        }
      } catch (err) {
        setError("Failed to load outlook");
      } finally {
        setLoading(false);
      }
    };

    fetchOutlook();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "40px" }}>
        <div style={{ textAlign: "center", color: palette.paperDim }}>Loading...</div>
      </div>
    );
  }

  if (error || !outlook) {
    return (
      <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1>Outlook not found</h1>
          <Link href="/sunday-outlook" style={{ color: palette.blue }}>
            ← Back to all outlooks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Back Link */}
      <div style={{ padding: "20px", background: palette.panel, borderBottom: `1px solid ${palette.hairline}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link href="/sunday-outlook" style={{ color: palette.blue, textDecoration: "none", fontSize: "0.95rem" }}>
            ← Back to all outlooks
          </Link>
        </div>
      </div>

      {/* Article */}
      <div style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ color: palette.amber, fontSize: "0.85rem", fontWeight: 600, marginBottom: "12px" }}>
              SUNDAY OUTLOOK
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 600,
                marginBottom: "16px",
                lineHeight: 1.2,
                fontFamily: "var(--font-header)",
              }}
            >
              {outlook.title}
            </h1>

            <div
              style={{
                display: "flex",
                gap: "24px",
                color: palette.paperDim,
                fontSize: "0.95rem",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontWeight: 600 }}>{outlook.author}</span>
              <span>
                {new Date(outlook.publishedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Image */}
          {outlook.coverImage && (
            <img
              src={outlook.coverImage}
              alt={outlook.title}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "40px",
              }}
            />
          )}

          {/* Summary */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.2rem", color: palette.amber, marginBottom: "16px", fontWeight: 600 }}>
              This Week's Outlook
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: palette.paperDim,
                marginBottom: "20px",
              }}
            >
              {outlook.summary}
            </p>
          </div>

          {/* CTA */}
          <div
            style={{
              background: palette.panel,
              padding: "40px",
              borderRadius: "8px",
              textAlign: "center",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", color: palette.amber }}>
              Read the Full Analysis
            </h3>
            <p style={{ color: palette.paperDim, marginBottom: "20px" }}>
              This week's complete market outlook is published on Financial Opp
            </p>
            <a
              href={outlook.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                background: palette.blue,
                color: palette.bg,
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              Read on Financial Opp →
            </a>
          </div>

          {/* Meta Info */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "40px",
              borderTop: `1px solid ${palette.hairline}`,
              fontSize: "0.85rem",
              color: palette.paperDim,
            }}
          >
            <p>
              <strong>Original URL:</strong>{" "}
              <a href={outlook.substackUrl} target="_blank" rel="noopener noreferrer" style={{ color: palette.blue }}>
                {outlook.substackUrl}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
