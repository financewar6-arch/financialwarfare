"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { palette } from "@/lib/warroom/palette";
import { TrendingTickerSparkline } from "./TrendingTickerSparkline";

interface TrendingTickerCardProps {
  slug: string;
  symbol: string;
  name: string;
}

export function TrendingTickerCard({ slug, symbol, name }: TrendingTickerCardProps) {
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
  const priceColor = isPositive ? palette.green : palette.red;

  return (
    <Link
      href={`/war-room/${slug}`}
      style={{
        padding: "12px 14px",
        background: `${palette.panel}99`,
        border: `1px solid ${palette.hairline}`,
        textDecoration: "none",
        display: "grid",
        gridTemplateColumns: "85px 70px 1fr",
        gap: "10px",
        alignItems: "center",
        transition: "all 0.2s",
        cursor: "pointer",
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
      <div>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "0.75rem", color: palette.amber, marginBottom: "3px" }}>
          {symbol}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: palette.paperDim }}>
          {name}
        </div>
      </div>

      <TrendingTickerSparkline assetSlug={slug} width={70} height={22} isPositive={isPositive} />

      <div style={{ textAlign: "right" }}>
        {loading ? (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
            ○ Loading
          </div>
        ) : (
          <>
            {price !== null && (
              <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "0.7rem", color: priceColor, marginBottom: "2px" }}>
                {symbol.includes("-") ? `$${price.toFixed(2)}` : price.toFixed(4)}
              </div>
            )}
            {change24h !== null && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: priceColor }}>
                {isPositive ? "+" : ""}{change24h.toFixed(2)}%
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
