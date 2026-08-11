"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { palette } from "@/lib/warroom/palette";
import { useTheme } from "@/lib/theme-context";
import { TrendingTickerSparkline } from "./TrendingTickerSparkline";
import { Skeleton } from "./Skeleton";
import { Badge } from "./Badge";

interface TrendingTickerCardProps {
  slug: string;
  symbol: string;
  name: string;
}

export function TrendingTickerCard({ slug, symbol, name }: TrendingTickerCardProps) {
  const { palette: themePalette } = useTheme();
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/warroom/${slug}?range=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.price && typeof data.change24h === "number") {
          setPrice(data.price);
          setChange24h(data.change24h);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const isPositive = change24h !== null && change24h >= 0;
  const priceColor = isPositive ? themePalette.green : themePalette.red;

  return (
    <Link
      href={`/war-room/${slug}`}
      style={{
        padding: "12px 14px",
        background: themePalette.panel,
        border: `1px solid ${themePalette.hairline}`,
        textDecoration: "none",
        display: "grid",
        gridTemplateColumns: "85px 70px 1fr",
        gap: "10px",
        alignItems: "center",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        borderRadius: "6px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = themePalette.amber;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${themePalette.amber}22`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = themePalette.hairline;
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "0.75rem", color: themePalette.amber, marginBottom: "3px" }}>
          {symbol}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: themePalette.paperDim }}>
          {name}
        </div>
      </div>

      <TrendingTickerSparkline assetSlug={slug} width={70} height={22} isPositive={isPositive} />

      <div style={{ textAlign: "right" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
            <Skeleton width="50px" height="16px" />
            <Skeleton width="40px" height="14px" />
          </div>
        ) : (
          <>
            {price !== null && (
              <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "0.7rem", color: priceColor, marginBottom: "2px" }}>
                {symbol.includes("-") ? `$${price.toFixed(2)}` : price.toFixed(4)}
              </div>
            )}
            {change24h !== null && (
              <Badge variant={isPositive ? "bullish" : "bearish"} size="sm">
                {isPositive ? "+" : ""}{change24h.toFixed(2)}%
              </Badge>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
