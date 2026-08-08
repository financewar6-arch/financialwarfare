"use client";

import Link from "next/link";
import { palette, fmtUSD } from "@/lib/warroom/palette";
import { useAssetFeed } from "../warroom/useAssetFeed";

interface AssetCardProps {
  slug: string;
  name: string;
  symbol: string;
}

export function WarRoomCard({ slug, name, symbol }: AssetCardProps) {
  const feed = useAssetFeed(slug, "1");
  const change = feed.data?.change24h ?? 0;
  const isUp = change >= 0;
  const color = isUp ? palette.green : palette.red;

  return (
    <Link href={`/war-room/${slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: palette.panel,
          border: `1px solid ${palette.hairline}`,
          padding: "16px",
          cursor: "pointer",
          transition: "all 0.2s",
          borderColor: palette.amberDim,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = palette.amber;
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 8px ${palette.amber}44`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = palette.amberDim;
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: palette.amber, letterSpacing: "0.05em", marginBottom: "8px" }}>
          {name} · {symbol}
        </div>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 700, fontSize: "1.4rem", color: palette.paper, lineHeight: 1, marginBottom: "4px" }}>
          {feed.data ? fmtUSD(feed.data.price) : "—"}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color, marginBottom: "12px" }}>
          {feed.data ? `${isUp ? "+" : ""}${change.toFixed(2)}% / 24H` : "Loading..."}
        </div>
        <div
          style={{
            height: "6px",
            background: palette.grid,
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${50 + Math.min(50, Math.abs(change) * 2.5)}%`,
              background: color,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>
    </Link>
  );
}
