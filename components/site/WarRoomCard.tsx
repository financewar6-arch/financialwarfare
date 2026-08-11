"use client";

import Link from "next/link";
import { palette, fmtUSD } from "@/lib/warroom/palette";
import { useAssetFeed } from "../warroom/useAssetFeed";
import { useTheme } from "@/lib/theme-context";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Skeleton } from "./Skeleton";

interface AssetCardProps {
  slug: string;
  name: string;
  symbol: string;
}

export function WarRoomCard({ slug, name, symbol }: AssetCardProps) {
  const { palette: themePalette } = useTheme();
  const feed = useAssetFeed(slug, "1");
  const change = feed.data?.change24h ?? 0;
  const isUp = change >= 0;
  const color = isUp ? themePalette.green : themePalette.red;

  return (
    <Link href={`/war-room/${slug}`} style={{ textDecoration: "none" }}>
      <Card hoverable>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: themePalette.amber, letterSpacing: "0.05em", marginBottom: "8px" }}>
          {name} · {symbol}
        </div>
        {feed.loading ? (
          <>
            <Skeleton width="70%" height="28px" style={{ marginBottom: "4px" }} />
            <Skeleton width="60%" height="20px" style={{ marginBottom: "12px" }} />
          </>
        ) : (
          <>
            <div style={{ fontFamily: "var(--font-header)", fontWeight: 700, fontSize: "1.4rem", color: themePalette.paper, lineHeight: 1, marginBottom: "4px" }}>
              {feed.data ? fmtUSD(feed.data.price) : "—"}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{feed.data ? `${isUp ? "+" : ""}${change.toFixed(2)}%` : "—"}</span>
              <Badge variant={isUp ? "bullish" : "bearish"} size="sm">
                {isUp ? "▲" : "▼"} 24H
              </Badge>
            </div>
          </>
        )}
        <div
          style={{
            height: "6px",
            background: themePalette.grid,
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: feed.loading ? "0%" : `${50 + Math.min(50, Math.abs(change) * 2.5)}%`,
              background: color,
              transition: "width 0.3s",
            }}
          />
        </div>
      </Card>
    </Link>
  );
}
