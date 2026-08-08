"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { palette } from "@/lib/warroom/palette";

interface Short {
  id: string;
  title: string;
  assetSymbol: string;
  assetName: string;
  priceChange: number;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  generatedAt: number;
  assetSlug: string;
}

interface MarketShortsProps {
  limit?: number;
}

export function MarketShorts({ limit = 3 }: MarketShortsProps) {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const response = await fetch("/api/shorts/latest");
        const data = await response.json();
        setShorts(data.videos?.slice(0, limit) || []);
      } catch (error) {
        console.error("Failed to fetch shorts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [limit]);

  if (loading) {
    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
          ○ LOADING MARKET SHORTS
        </div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return null;
  }

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontFamily: "var(--font-header)",
            fontWeight: 600,
            fontSize: "1.3rem",
            color: palette.amber,
            letterSpacing: "0.08em",
            marginBottom: "8px",
          }}
        >
          📹 LATEST MARKET SHORTS
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim }}>
          Breaking market moves in 30-60 seconds
        </div>
      </div>

      {/* Shorts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {shorts.map((short) => (
          <div
            key={short.id}
            style={{
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "2px",
              overflow: "hidden",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = palette.amber;
              el.style.background = `${palette.panel}dd`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = palette.hairline;
              el.style.background = `${palette.panel}99`;
            }}
          >
            {/* Video Player */}
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "177.78%",
                background: palette.bg,
                overflow: "hidden",
              }}
            >
              <video
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                controls
                poster={short.thumbnailUrl}
                preload="none"
              >
                <source src={short.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Metadata */}
            <div style={{ padding: "16px" }}>
              {/* Asset Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <Link
                  href={`/war-room/${short.assetSlug}`}
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: palette.paper,
                    textDecoration: "none",
                  }}
                >
                  {short.assetSymbol}
                </Link>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: short.priceChange >= 0 ? palette.green : palette.red,
                    fontWeight: 600,
                  }}
                >
                  {short.priceChange >= 0 ? "+" : ""}
                  {short.priceChange.toFixed(2)}%
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: palette.paperDim,
                  lineHeight: 1.4,
                  marginBottom: "12px",
                }}
              >
                {short.title}
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: palette.amberDim,
                  borderTop: `1px solid ${palette.hairline}`,
                  paddingTop: "12px",
                }}
              >
                <span>{timeAgo(short.generatedAt)}</span>
                <span>{short.duration}s</span>
              </div>

              {/* War Room Link */}
              <Link
                href={`/war-room/${short.assetSlug}`}
                style={{
                  display: "block",
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: `${palette.amber}11`,
                  border: `1px solid ${palette.amber}44`,
                  color: palette.amber,
                  textDecoration: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  textAlign: "center",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = `${palette.amber}22`;
                  el.style.borderColor = palette.amber;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = `${palette.amber}11`;
                  el.style.borderColor = `${palette.amber}44`;
                }}
              >
                OPEN WAR ROOM →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {shorts.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link
            href="/shorts"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: palette.amber,
              textDecoration: "none",
              borderBottom: `1px solid ${palette.amber}44`,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.borderBottomColor = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.borderBottomColor = `${palette.amber}44`;
            }}
          >
            VIEW ALL SHORTS →
          </Link>
        </div>
      )}
    </div>
  );
}
