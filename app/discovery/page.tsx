"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

interface DiscoveryArticle {
  symbol: string;
  name: string;
  direction: "up" | "down";
  priceChange: number;
  headline: string;
  category: string;
  timestamp: number;
}

export default function DiscoveryPage() {
  const { palette } = useTheme();
  const [articles, setArticles] = useState<DiscoveryArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/discovery/articles");
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const gainers = articles.filter((a) => a.direction === "up");
  const losers = articles.filter((a) => a.direction === "down");

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${palette.hairline}`, padding: "24px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "12px" }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: palette.amber,
                textDecoration: "none",
              }}
            >
              ← Back to homepage
            </Link>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "2rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Market Discovery
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: palette.paperDim,
              marginTop: "8px",
            }}
          >
            Explore in-depth analysis of today's biggest market moves.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {loading ? (
          <div style={{ fontFamily: "var(--font-mono)", color: palette.paperDim }}>
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: `${palette.panel}99`,
              borderRadius: "4px",
            }}
          >
            <p style={{ fontFamily: "var(--font-body)", color: palette.paperDim }}>
              No significant market moves today. Check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* Gainers */}
            {gainers.length > 0 && (
              <section style={{ marginBottom: "60px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: palette.green,
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>📈</span> Market Gainers
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                  {gainers.map((article) => (
                    <ArticleCard key={`${article.symbol}-${article.timestamp}`} article={article} palette={palette} />
                  ))}
                </div>
              </section>
            )}

            {/* Losers */}
            {losers.length > 0 && (
              <section>
                <h2
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: palette.red,
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>📉</span> Market Losers
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                  {losers.map((article) => (
                    <ArticleCard key={`${article.symbol}-${article.timestamp}`} article={article} palette={palette} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article, palette }: { article: DiscoveryArticle; palette: any }) {
  const priceColor = article.direction === "up" ? palette.green : palette.red;
  const category = article.category || "stocks";
  const articleUrl = `/${category}/${article.symbol.toLowerCase()}/why-is-${article.symbol.toLowerCase()}-${article.direction}`;

  return (
    <Link
      href={articleUrl}
      style={{
        padding: "20px",
        background: `${palette.panel}99`,
        border: `1px solid ${palette.hairline}`,
        borderRadius: "4px",
        textDecoration: "none",
        display: "block",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
        (e.currentTarget as HTMLElement).style.background = `${palette.panel}dd`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
        (e.currentTarget as HTMLElement).style.background = `${palette.panel}99`;
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.amber, fontWeight: 700 }}>
            {article.symbol}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paper, marginTop: "2px" }}>
            {article.name}
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: priceColor,
          }}
        >
          {article.direction === "up" ? "+" : ""}
          {article.priceChange.toFixed(2)}%
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: palette.paper,
          lineHeight: 1.5,
          marginBottom: "12px",
        }}
      >
        {article.headline}
      </div>

      {/* Footer */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: palette.paperDim,
          paddingTop: "12px",
          borderTop: `1px solid ${palette.hairline}`,
        }}
      >
        Read full analysis →
      </div>
    </Link>
  );
}
