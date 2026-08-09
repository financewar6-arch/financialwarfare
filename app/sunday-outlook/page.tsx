"use client";

import { useState, useEffect } from "react";
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
  featured: boolean;
}

export default function SundayOutlookPage() {
  const { palette } = useTheme();
  const [outlooks, setOutlooks] = useState<Outlook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutlooks = async () => {
      try {
        const response = await fetch("/api/sunday-outlook");
        const data = await response.json();
        if (data.success) {
          setOutlooks(data.outlooks);
        }
      } catch (error) {
        console.error("Failed to fetch outlooks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutlooks();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: `linear-gradient(135deg, ${palette.panel} 0%, ${palette.bg} 100%)`,
          padding: "60px 20px",
          textAlign: "center",
          borderBottom: `1px solid ${palette.hairline}`,
        }}
      >
        <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2.5rem", marginBottom: "12px" }}>
          The Sunday Outlook
        </h1>
        <p style={{ fontSize: "1.1rem", color: palette.paperDim, maxWidth: "600px", margin: "0 auto" }}>
          Weekly market perspectives and analysis from Financial Opp
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: palette.paperDim }}>Loading outlooks...</div>
        ) : outlooks.length === 0 ? (
          <div style={{ textAlign: "center", color: palette.paperDim, padding: "60px 20px" }}>
            <p>No outlooks published yet.</p>
          </div>
        ) : (
          <div>
            {/* Featured/Latest Article */}
            {outlooks[0] && (
              <div style={{ marginBottom: "80px" }}>
                <Link href={`/sunday-outlook/${outlooks[0].slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ cursor: "pointer" }}>
                    {outlooks[0].coverImage && (
                      <img
                        src={outlooks[0].coverImage}
                        alt={outlooks[0].title}
                        style={{
                          width: "100%",
                          maxHeight: "500px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "32px",
                        }}
                      />
                    )}

                    <div style={{ maxWidth: "800px" }}>
                      <div style={{ color: palette.amber, fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                        LATEST
                      </div>
                      <h2
                        style={{
                          fontSize: "2rem",
                          fontWeight: 600,
                          marginBottom: "12px",
                          lineHeight: 1.3,
                        }}
                      >
                        {outlooks[0].title}
                      </h2>
                      <div style={{ display: "flex", gap: "20px", marginBottom: "16px", color: palette.paperDim }}>
                        <span>{outlooks[0].author}</span>
                        <span>{formatDate(outlooks[0].publishedAt)}</span>
                      </div>
                      <p style={{ fontSize: "1.05rem", color: palette.paperDim, lineHeight: 1.7, marginBottom: "20px" }}>
                        {outlooks[0].summary}
                      </p>
                      <div style={{ color: palette.blue, fontWeight: 600 }}>
                        Read Full Outlook →
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Divider */}
            {outlooks.length > 1 && (
              <div style={{ borderTop: `1px solid ${palette.hairline}`, marginBottom: "60px" }} />
            )}

            {/* Previous Editions */}
            {outlooks.length > 1 && (
              <div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    marginBottom: "32px",
                    color: palette.amber,
                  }}
                >
                  Previous Editions
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "32px" }}>
                  {outlooks.slice(1).map((outlook) => (
                    <Link
                      key={outlook.id}
                      href={`/sunday-outlook/${outlook.slug}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = "1";
                        }}
                      >
                        {outlook.coverImage && (
                          <img
                            src={outlook.coverImage}
                            alt={outlook.title}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              marginBottom: "16px",
                            }}
                          />
                        )}

                        <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "8px" }}>
                          {formatDate(outlook.publishedAt)}
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px", lineHeight: 1.3 }}>
                          {outlook.title}
                        </h4>
                        <p style={{ fontSize: "0.95rem", color: palette.paperDim, lineHeight: 1.6, marginBottom: "12px" }}>
                          {outlook.summary.substring(0, 120)}...
                        </p>
                        <div style={{ color: palette.blue, fontSize: "0.9rem", fontWeight: 600 }}>
                          Read Outlook →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div
        style={{
          background: palette.panel,
          padding: "60px 20px",
          textAlign: "center",
          borderTop: `1px solid ${palette.hairline}`,
        }}
      >
        <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Get the Sunday Outlook</h3>
        <p style={{ color: palette.paperDim, marginBottom: "20px", maxWidth: "500px", margin: "0 auto" }}>
          Subscribe to Financial Opp for the latest market perspectives every Sunday
        </p>
        <a
          href="https://financialopp.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: palette.amber,
            color: palette.bg,
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: 600,
          }}
        >
          Subscribe on Substack
        </a>
      </div>
    </div>
  );
}
