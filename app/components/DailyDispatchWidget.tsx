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

export function DailyDispatchWidget() {
  const { palette } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles-list?limit=3");
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    // Refresh every 5 minutes
    const interval = setInterval(fetchArticles, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "32px",
          background: `linear-gradient(135deg, ${palette.amber}11 0%, transparent 100%)`,
          border: `1px solid ${palette.amber}33`,
          borderRadius: "4px",
        }}
      >
        <div style={{ color: palette.paperDim, fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
          Loading battle briefs...
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "60px",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: `2px solid ${palette.amber}`,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-header)",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: palette.amber,
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          🔥 Daily Dispatch
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: palette.paperDim }}>
          Today's battle briefing — market intelligence rewritten for tactical advantage.
        </p>
      </div>

      {/* Article Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/daily-dispatch?focus=${article.id}`}
            style={{ textDecoration: "none" }}
          >
            <DailyDispatchCard article={article} compact={true} />
          </Link>
        ))}
      </div>

      {/* View All CTA */}
      <Link
        href="/daily-dispatch"
        style={{
          display: "inline-block",
          padding: "12px 32px",
          background: palette.amber,
          color: palette.bg,
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          fontSize: "0.9rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = palette.amberDim;
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = palette.amber;
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        View All Briefs →
      </Link>
    </div>
  );
}
