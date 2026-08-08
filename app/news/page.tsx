"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news?category=market")
      .then((res) => res.json())
      .then((data) => {
        const fetchedArticles = data.articles || [];
        setArticles(fetchedArticles);

        // Store articles in sessionStorage for detail pages
        fetchedArticles.forEach((article: NewsArticle) => {
          const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          sessionStorage.setItem(`article-${slug}`, JSON.stringify(article));
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("News fetch failed:", err);
        setLoading(false);
      });
  }, []);

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
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.6rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "4px" }}>
          MARKET NEWS
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim }}>
          Breaking stories that move markets · Curated from global sources
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
            ○ ACQUIRING SIGNAL
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div style={{ padding: "48px", textAlign: "center", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}`, borderRadius: "2px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim, marginBottom: "12px" }}>
            ○ NO SIGNAL
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.6, color: palette.paperDim }}>
            Add your NewsAPI key to .env.local to enable live market news.
          </div>
        </div>
      ) : (
        <div>
          {/* Featured article (first one) */}
          {articles.length > 0 && (
            <Link
              href={`/news/${encodeURIComponent(articles[0].title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`}
              style={{
                display: "block",
                padding: "20px",
                background: `linear-gradient(135deg, ${palette.panel}dd, ${palette.panel}99)`,
                border: `2px solid ${palette.amber}44`,
                marginBottom: "24px",
                textDecoration: "none",
                transition: "all 0.2s",
                borderRadius: "2px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = palette.amber;
                el.style.boxShadow = `0 0 12px ${palette.amber}33`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${palette.amber}44`;
                el.style.boxShadow = "none";
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amber, letterSpacing: "0.1em", marginBottom: "8px", textTransform: "uppercase" }}>
                ⚡ FEATURED
              </div>
              <div style={{ fontFamily: "var(--font-header)", fontSize: "1.3rem", fontWeight: 700, color: palette.paper, marginBottom: "12px", lineHeight: 1.3 }}>
                {articles[0].title}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: palette.paperDim, lineHeight: 1.6, marginBottom: "12px" }}>
                {articles[0].description || "Read full story →"}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amberDim }}>
                {articles[0].source.name} · {timeAgo(articles[0].publishedAt)}
              </div>
            </Link>
          )}

          {/* Grid of remaining articles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {articles.slice(1).map((article, idx) => (
              <Link
                key={idx}
                href={`/news/${encodeURIComponent(article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`}
                style={{
                  padding: "16px",
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = palette.amber;
                  el.style.background = `${palette.panel}dd`;
                  el.style.boxShadow = `0 0 8px ${palette.amber}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = palette.hairline;
                  el.style.background = `${palette.panel}99`;
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: palette.amberDim, marginBottom: "6px" }}>
                  {article.source.name}
                </div>
                <div style={{ fontFamily: "var(--font-header)", fontSize: "0.95rem", fontWeight: 600, color: palette.paper, marginBottom: "8px", lineHeight: 1.3, flex: 1 }}>
                  {article.title}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: palette.paperDim, lineHeight: 1.4, marginBottom: "10px", flex: 1 }}>
                  {article.description ? article.description.substring(0, 100) + "..." : "Read story →"}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, borderTop: `1px solid ${palette.hairline}`, paddingTop: "8px" }}>
                  {timeAgo(article.publishedAt)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
