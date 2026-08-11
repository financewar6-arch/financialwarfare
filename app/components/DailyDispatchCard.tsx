"use client";

import { useTheme } from "@/lib/theme-context";
import { Badge } from "@/components/site/Badge";
import { Card } from "@/components/site/Card";

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

interface DailyDispatchCardProps {
  article: Article;
  compact?: boolean;
}

export function DailyDispatchCard({ article, compact = false }: DailyDispatchCardProps) {
  const { palette } = useTheme();

  const publishDate = new Date(article.publishedAt);
  const timeAgo = getTimeAgo(publishDate);

  const getSourceColor = (source: string) => {
    switch (source.toUpperCase()) {
      case "BLOOMBERG":
        return palette.amber;
      case "REUTERS":
        return palette.blue;
      case "CNBC":
        return palette.red;
      case "FINNHUB":
        return palette.green;
      default:
        return palette.paperDim;
    }
  };

  const sourceColor = getSourceColor(article.source);

  if (compact) {
    return (
      <div
        style={{
          padding: "20px",
          background: `${palette.panel}66`,
          border: `1px solid ${palette.hairline}`,
          borderRadius: "4px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
          (e.currentTarget as HTMLElement).style.background = `${palette.panel}99`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
          (e.currentTarget as HTMLElement).style.background = `${palette.panel}66`;
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              padding: "4px 8px",
              background: `${sourceColor}22`,
              border: `1px solid ${sourceColor}44`,
              borderRadius: "2px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: sourceColor,
              fontWeight: 700,
            }}
          >
            {article.source}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim }}>
            {timeAgo}
          </div>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-header)",
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "8px",
            color: palette.paper,
            lineHeight: 1.4,
          }}
        >
          {article.headline}
        </h3>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: palette.paperDim, lineHeight: 1.5 }}>
          {article.body.substring(0, 100)}...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "32px",
        background: `linear-gradient(135deg, ${palette.panel}99 0%, ${palette.panel}66 100%)`,
        border: `1px solid ${palette.hairline}`,
        borderRadius: "4px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              padding: "6px 12px",
              background: `${sourceColor}22`,
              border: `1px solid ${sourceColor}44`,
              borderRadius: "2px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: sourceColor,
              fontWeight: 700,
              display: "inline-block",
              marginBottom: "12px",
            }}
          >
            ● {article.source}
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
          {publishDate.toLocaleDateString()} {publishDate.toLocaleTimeString()}
        </div>
      </div>

      {/* Headline */}
      <h2
        style={{
          fontFamily: "var(--font-header)",
          fontSize: "1.6rem",
          fontWeight: 700,
          marginBottom: "20px",
          color: palette.paper,
          lineHeight: 1.3,
        }}
      >
        {article.headline}
      </h2>

      {/* Body */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          lineHeight: 1.7,
          color: palette.paper,
          marginBottom: "32px",
        }}
      >
        {article.body}
      </div>

      {/* Two-column layout for impact & tactical */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Market Impact */}
        <div
          style={{
            padding: "20px",
            background: `${palette.amber}11`,
            border: `1px solid ${palette.amber}33`,
            borderRadius: "4px",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: palette.amber,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            📊 Market Impact
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paper, lineHeight: 1.6 }}>
            {article.marketImpact}
          </p>
        </div>

        {/* Tactical Position */}
        <div
          style={{
            padding: "20px",
            background: `${palette.green}11`,
            border: `1px solid ${palette.green}33`,
            borderRadius: "4px",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: palette.green,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            ⚔️ Tactical Position
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paper, lineHeight: 1.6 }}>
            {article.tactical}
          </p>
        </div>
      </div>

      {/* Key Numbers */}
      {article.keyNumbers && article.keyNumbers.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: palette.blue,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
              fontWeight: 700,
            }}
          >
            Key Numbers
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {article.keyNumbers.map((num, idx) => (
              <div
                key={idx}
                style={{
                  padding: "6px 12px",
                  background: `${palette.blue}22`,
                  border: `1px solid ${palette.blue}44`,
                  borderRadius: "2px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  color: palette.blue,
                  fontWeight: 600,
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          paddingTop: "24px",
          borderTop: `1px solid ${palette.hairline}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: palette.paperDim, fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
          {timeAgo}
        </div>
        <a
          href={article.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: palette.amber,
            textDecoration: "none",
            padding: "8px 16px",
            border: `1px solid ${palette.amber}`,
            borderRadius: "2px",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = palette.amber;
            (e.currentTarget as HTMLElement).style.color = palette.bg;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = palette.amber;
          }}
        >
          Read Original →
        </a>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
