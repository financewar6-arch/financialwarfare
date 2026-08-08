"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/site/PageShell";
import { palette } from "@/lib/warroom/palette";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  content?: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedArticle = sessionStorage.getItem(`article-${slug}`);
    if (storedArticle) {
      try {
        setArticle(JSON.parse(storedArticle));
      } catch (e) {
        console.error("Failed to parse stored article:", e);
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <div style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
            ○ ACQUIRING SIGNAL
          </div>
        </div>
      </PageShell>
    );
  }

  if (!article) {
    return (
      <PageShell>
        <div style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.red, marginBottom: "12px" }}>
            ✕ SIGNAL LOST
          </div>
          <Link
            href="/news"
            style={{
              color: palette.amber,
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              borderBottom: `1px solid ${palette.amber}`,
            }}
          >
            ← Back to news
          </Link>
        </div>
      </PageShell>
    );
  }

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <PageShell>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/news"
          style={{
            color: palette.amber,
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            display: "inline-block",
            marginBottom: "16px",
            borderBottom: `1px solid ${palette.amber}`,
            letterSpacing: "0.05em",
          }}
        >
          ← BACK TO NEWS
        </Link>
      </div>

      {/* Article container */}
      <article
        style={{
          background: `${palette.panel}66`,
          border: `1px solid ${palette.hairline}`,
          padding: "32px",
          borderRadius: "2px",
        }}
      >
        {/* Source and date */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amberDim }}>
          <span>{article.source.name}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-header)",
            fontSize: "2rem",
            fontWeight: 700,
            color: palette.paper,
            marginBottom: "20px",
            lineHeight: 1.3,
          }}
        >
          {article.title}
        </h1>

        {/* Featured image */}
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "400px",
              objectFit: "cover",
              marginBottom: "24px",
              borderRadius: "2px",
              border: `1px solid ${palette.hairline}`,
            }}
          />
        )}

        {/* Description/Summary */}
        {article.description && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              color: palette.paperDim,
              lineHeight: 1.7,
              marginBottom: "24px",
              borderLeft: `3px solid ${palette.amber}33`,
              paddingLeft: "16px",
            }}
          >
            {article.description}
          </p>
        )}

        {/* Content body */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.95rem",
            color: palette.paper,
            lineHeight: 1.8,
            marginBottom: "24px",
          }}
        >
          {article.content ? (
            <p>{article.content}</p>
          ) : (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontStyle: "italic",
                  color: palette.paperDim,
                  marginBottom: "16px",
                }}
              >
                {article.description || "Click below to read the full article on the source site."}
              </p>
            </div>
          )}
        </div>

        {/* Read Full Article Button */}
        <div style={{ marginBottom: "24px" }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: palette.amber,
              color: palette.bg,
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              borderRadius: "2px",
              letterSpacing: "0.05em",
              transition: "all 0.2s",
              cursor: "pointer",
              border: `2px solid ${palette.amber}`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
              el.style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = palette.amber;
              el.style.color = palette.bg;
            }}
          >
            ↗ OPEN IN NEW TAB
          </a>
        </div>

        {/* Metadata footer */}
        <div
          style={{
            paddingTop: "20px",
            borderTop: `1px solid ${palette.hairline}`,
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: palette.paperDim,
          }}
        >
          Published {new Date(article.publishedAt).toLocaleString()} · {article.source.name}
        </div>
      </article>

      {/* Back to news link at bottom */}
      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <Link
          href="/news"
          style={{
            color: palette.amber,
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            display: "inline-block",
            borderBottom: `1px solid ${palette.amber}`,
            letterSpacing: "0.05em",
          }}
        >
          ← RETURN TO NEWS
        </Link>
      </div>
    </PageShell>
  );
}
