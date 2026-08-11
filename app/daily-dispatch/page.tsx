"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { DailyDispatchCard } from "@/components/DailyDispatchCard";

interface Article {
  id: string;
  headline: string;
  source: string;
  body: string;
  marketImpact: string;
  tactical: string;
  keyNumbers: string[];
  originalUrl: string;
  publishedAt: string;
  createdAt: string;
}

export default function DailyDispatchPage() {
  const { palette } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles-list");
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: palette.bg,
          color: palette.paper,
          minHeight: "100vh",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: palette.paperDim }}>Loading battle reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "60px 20px 40px",
          borderBottom: `2px solid ${palette.amber}`,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            color: palette.amber,
            textDecoration: "none",
            marginBottom: "24px",
            display: "inline-block",
          }}
        >
          ← Back to Home
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-header)",
            fontSize: "2.8rem",
            fontWeight: 700,
            marginBottom: "12px",
            color: palette.amber,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Daily Dispatch
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: palette.paperDim }}>
          Your daily battle briefing. Market intelligence rewritten for tactical advantage.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          <div
            style={{
              padding: "16px",
              background: `${palette.amber}11`,
              border: `1px solid ${palette.amber}33`,
              borderRadius: "4px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.amber }}>
              TOTAL BRIEFS
            </div>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.8rem",
                fontWeight: 700,
                color: palette.amber,
                marginTop: "8px",
              }}
            >
              {articles.length}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: `${palette.blue}11`,
              border: `1px solid ${palette.blue}33`,
              borderRadius: "4px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.blue }}>
              TODAY
            </div>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.8rem",
                fontWeight: 700,
                color: palette.blue,
                marginTop: "8px",
              }}
            >
              {articles.filter(
                (a) => new Date(a.publishedAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: `${palette.green}11`,
              border: `1px solid ${palette.green}33`,
              borderRadius: "4px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.green }}>
              LAST 7 DAYS
            </div>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.8rem",
                fontWeight: 700,
                color: palette.green,
                marginTop: "8px",
              }}
            >
              {
                articles.filter(
                  (a) =>
                    new Date(a.publishedAt).getTime() >
                    new Date().getTime() - 7 * 24 * 60 * 60 * 1000
                ).length
              }
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {error && (
          <div
            style={{
              padding: "16px",
              background: `${palette.red}11`,
              border: `1px solid ${palette.red}`,
              borderRadius: "4px",
              color: palette.red,
              marginBottom: "24px",
            }}
          >
            {error}
          </div>
        )}

        {articles.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: palette.paperDim,
            }}
          >
            <div style={{ fontFamily: "var(--font-header)", fontSize: "1.3rem", marginBottom: "12px" }}>
              No Battle Reports Yet
            </div>
            <p>Daily Dispatch updates will appear here at 8 AM each trading day.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "32px" }}>
            {articles.map((article) => (
              <DailyDispatchCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
