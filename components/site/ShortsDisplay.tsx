"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

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

export default function ShortsDisplay() {
  const { palette } = useTheme();
  const [shorts, setShorts] = useState<Short[]>([]);
  const [shortsLoading, setShortsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shorts/latest?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setShorts(data.videos || []);
        setShortsLoading(false);
      })
      .catch(() => setShortsLoading(false));
  }, []);

  if (shortsLoading) {
    return (
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
        ○ LOADING...
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            style={{
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              padding: "12px",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>▶</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
                Awaiting content...
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {shorts.map((short) => (
        <Link
          key={short.id}
          href={`/war-room/${short.assetSlug}`}
          style={{
            background: `${palette.panel}99`,
            border: `1px solid ${palette.hairline}`,
            padding: "0",
            overflow: "hidden",
            position: "relative",
            aspectRatio: "16/9",
            textDecoration: "none",
            transition: "all 0.2s",
            display: "block",
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
          {/* Video */}
          <video
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
            poster={short.thumbnailUrl}
          >
            <source src={short.videoUrl} type="video/mp4" />
          </video>

          {/* Overlay: Asset Info */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
              padding: "12px",
              color: palette.paper,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {short.assetSymbol}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: short.priceChange >= 0 ? palette.green : palette.red,
                    fontWeight: 600,
                  }}
                >
                  {short.priceChange >= 0 ? "+" : ""}
                  {short.priceChange.toFixed(2)}%
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
                {short.duration}s
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
