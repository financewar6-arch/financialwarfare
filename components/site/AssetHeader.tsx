"use client";

import { useTheme } from "@/lib/theme-context";
import { Badge } from "./Badge";
import { Skeleton } from "./Skeleton";

interface AssetHeaderProps {
  name: string;
  symbol: string;
  exchange?: string;
  price: number | null;
  change24h: number | null;
  updateTime?: Date | string;
  isLive?: boolean;
  loading?: boolean;
}

export function AssetHeader({ name, symbol, exchange, price, change24h, updateTime, isLive = false, loading = false }: AssetHeaderProps) {
  const { palette } = useTheme();

  const isPositive = change24h !== null && change24h >= 0;
  const priceColor = isPositive ? palette.green : palette.red;

  const formatTime = (date: Date | string) => {
    if (typeof date === "string") return date;
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${palette.panel}99 0%, ${palette.panel}44 100%)`,
        border: `1px solid ${palette.hairline}`,
        borderRadius: "8px",
        padding: "32px 24px",
        marginBottom: "24px",
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "2rem",
                fontWeight: 700,
                color: palette.paper,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {name}
            </h1>
          </div>
          {isLive && <Badge variant="live">LIVE</Badge>}
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            color: palette.paperDim,
            letterSpacing: "0.05em",
          }}
        >
          {symbol.toUpperCase()}
          {exchange && <span style={{ marginLeft: "8px", color: palette.amberDim }}>· {exchange}</span>}
        </div>
      </div>

      {/* Price Section */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "20px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {loading ? (
          <>
            <Skeleton width="200px" height="48px" />
            <Skeleton width="120px" height="28px" />
          </>
        ) : (
          <>
            {price !== null && (
              <div
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: palette.paper,
                  lineHeight: 1,
                }}
              >
                ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}

            {change24h !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: priceColor,
                  }}
                >
                  {isPositive ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
                </div>
                <Badge variant={isPositive ? "bullish" : "bearish"}>
                  {isPositive ? "UP" : "DOWN"} 24H
                </Badge>
              </div>
            )}
          </>
        )}
      </div>

      {/* Metadata Footer */}
      {updateTime && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: palette.paperDim,
            paddingTop: "12px",
            borderTop: `1px solid ${palette.hairline}`,
            marginTop: "16px",
          }}
        >
          Updated {formatTime(updateTime)}
        </div>
      )}
    </div>
  );
}
