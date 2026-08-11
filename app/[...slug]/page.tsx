"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { ASSETS } from "@/lib/assets";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

interface ArticleData {
  symbol: string;
  name: string;
  direction: "up" | "down";
  priceChange: number;
  headline: string;
  whyItMoved: string;
  whyItMatters: string;
  relatedAssets: Array<{ symbol: string; name: string; priceChange: number }>;
  whatToWatch: string[];
  sources: Array<{ title: string; source: string; timeAgo: string }>;
  warRoomUrl: string;
  timestamp: number;
}

export default function ArticlePage({ params }: { params: { slug: string[] } }) {
  const { palette } = useTheme();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Parse URL: /stocks/nvda/why-is-nvda-up
    // slug = ['stocks', 'nvda', 'why-is-nvda-up']
    const fetchArticle = async () => {
      try {
        // Check if slug has the required segments
        if (!params.slug || params.slug.length < 3) {
          setNotFound(true);
          return;
        }

        const [category, symbol, actionSlug] = params.slug;
        const direction = actionSlug?.includes("up") ? "up" : "down";

        // Fetch from discovery API
        const response = await fetch(
          `/api/discovery/article?symbol=${symbol}&direction=${direction}&category=${category}`
        );

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Failed to load article:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params]);

  if (loading) {
    return (
      <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "40px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", color: palette.paperDim }}>
            Loading article...
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "40px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2rem", marginBottom: "16px" }}>
            Article Not Found
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: palette.paperDim, marginBottom: "24px" }}>
            This asset hasn't made a significant move recently, or isn't in our coverage universe.
          </p>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              color: palette.amber,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const directionEmoji = article.direction === "up" ? "📈" : "📉";
  const priceColor = article.direction === "up" ? palette.green : palette.red;

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Navigation */}
      <div style={{ borderBottom: `1px solid ${palette.hairline}`, padding: "16px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: palette.amber,
              textDecoration: "none",
            }}
          >
            ← Financial Warfare
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: article.symbol, href: `/war-room/${article.symbol.toLowerCase()}` },
            { label: `Why is ${article.symbol} ${article.direction}?` },
          ]}
        />

        {/* Headline Section */}
        <header style={{ marginBottom: "40px" }}>
          <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>{directionEmoji}</span>
            <h1
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "2.2rem",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Why is {article.symbol} {article.direction === "up" ? "up" : "down"} today?
            </h1>
          </div>

          {/* Quick Stat */}
          <div style={{ marginTop: "16px", display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: priceColor,
              }}
            >
              {article.direction === "up" ? "+" : "-"}
              {Math.abs(article.priceChange).toFixed(2)}%
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: palette.paperDim,
              }}
            >
              {article.name} ({article.symbol}) is {article.direction === "up" ? "gaining" : "losing"}{" "}
              {Math.abs(article.priceChange).toFixed(2)}% today.
            </span>
          </div>

          <div
            style={{
              marginTop: "12px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: palette.paperDim,
            }}
          >
            Updated: {new Date(article.timestamp).toLocaleTimeString()}
          </div>
        </header>

        {/* Content Sections */}
        <article style={{ marginBottom: "60px" }}>
          {/* Why It Moved */}
          <section style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.3rem",
                fontWeight: 600,
                color: palette.amber,
                marginBottom: "12px",
                borderBottom: `2px solid ${palette.amber}`,
                paddingBottom: "8px",
              }}
            >
              Why It Moved
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.7, color: palette.paper }}>
              {article.whyItMoved}
            </p>
          </section>

          {/* Why It Matters */}
          <section style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.3rem",
                fontWeight: 600,
                color: palette.green,
                marginBottom: "12px",
                borderBottom: `2px solid ${palette.green}`,
                paddingBottom: "8px",
              }}
            >
              Why It Matters
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.7, color: palette.paper }}>
              {article.whyItMatters}
            </p>
          </section>

          {/* Market Context */}
          {article.relatedAssets.length > 0 && (
            <section style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: palette.paper,
                  marginBottom: "12px",
                  borderBottom: `2px solid ${palette.hairline}`,
                  paddingBottom: "8px",
                }}
              >
                Market Context
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                <div
                  style={{
                    padding: "16px",
                    background: `${palette.panel}99`,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.amber }}>
                    {article.symbol}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-header)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: priceColor,
                      marginTop: "4px",
                    }}
                  >
                    {article.direction === "up" ? "+" : "-"}
                    {Math.abs(article.priceChange).toFixed(2)}%
                  </div>
                </div>

                {article.relatedAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    style={{
                      padding: "16px",
                      background: `${palette.panel}99`,
                      border: `1px solid ${palette.hairline}`,
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim }}>
                      {asset.symbol}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-header)",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: asset.priceChange >= 0 ? palette.green : palette.red,
                        marginTop: "4px",
                      }}
                    >
                      {asset.priceChange >= 0 ? "+" : ""}
                      {asset.priceChange.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What to Watch */}
          {article.whatToWatch.length > 0 && (
            <section style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: palette.paper,
                  marginBottom: "12px",
                  borderBottom: `2px solid ${palette.hairline}`,
                  paddingBottom: "8px",
                }}
              >
                What Traders Are Watching
              </h2>
              <ul style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.8, color: palette.paper, paddingLeft: "20px" }}>
                {article.whatToWatch.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "8px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sources */}
          {article.sources.length > 0 && (
            <section style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: palette.paper,
                  marginBottom: "12px",
                  borderBottom: `2px solid ${palette.hairline}`,
                  paddingBottom: "8px",
                }}
              >
                Sources
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {article.sources.map((source, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      background: `${palette.panel}66`,
                      borderLeft: `3px solid ${palette.amber}`,
                      borderRadius: "2px",
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.amber }}>
                      {source.source} — {source.timeAgo}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paper, marginTop: "4px" }}>
                      {source.title}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* CTA Section */}
        <div
          style={{
            padding: "32px",
            background: `linear-gradient(135deg, ${palette.amber}11 0%, transparent 100%)`,
            border: `1px solid ${palette.amber}33`,
            borderRadius: "4px",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Want the full intelligence briefing?
          </div>
          <Link
            href={article.warRoomUrl}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: palette.bg,
              background: palette.amber,
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "2px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = palette.amberDim;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = palette.amber;
            }}
          >
            Open {article.symbol} War Room →
          </Link>
        </div>

        {/* Footer */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: palette.paperDim,
            borderTop: `1px solid ${palette.hairline}`,
            paddingTop: "24px",
            textAlign: "center",
          }}
        >
          Updated: {new Date(article.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
