"use client";

import { palette, fmtUSD } from "@/lib/warroom/palette";
import { ASSETS } from "@/lib/assets";
import { useAssetFeed } from "./useAssetFeed";

interface ComparisonAssetCardProps {
  slug: string;
  onRemove: (slug: string) => void;
}

export function ComparisonAssetCard({ slug, onRemove }: ComparisonAssetCardProps) {
  const feed = useAssetFeed(slug, "7");
  const asset = ASSETS[slug as keyof typeof ASSETS];

  if (!asset || !feed.data) {
    return null;
  }

  const isUp = (feed.data?.change24h ?? 0) >= 0;

  return (
    <div
      style={{
        padding: "8px 12px",
        background: `${palette.bg}99`,
        border: `1px solid ${isUp ? palette.green : palette.red}`,
        borderRadius: "2px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim }}>
          {asset.symbol}
        </div>
        <div style={{ fontFamily: "var(--font-header)", fontSize: "0.8rem", color: palette.paper }}>
          {fmtUSD(feed.data.price)}
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: isUp ? palette.green : palette.red }}>
        {isUp ? "+" : ""}
        {feed.data.change24h.toFixed(2)}%
      </div>
      <button
        onClick={() => onRemove(slug)}
        style={{
          background: "transparent",
          border: "none",
          color: palette.paperDim,
          cursor: "pointer",
          fontSize: "1rem",
          padding: "0",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = palette.red;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = palette.paperDim;
        }}
      >
        ✕
      </button>
    </div>
  );
}
