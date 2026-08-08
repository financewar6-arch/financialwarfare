"use client";

import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { palette } from "@/lib/warroom/palette";
import type { HistoryPoint } from "@/lib/providers/types";

interface ComparisonData {
  timestamp: number;
  [key: string]: number;
}

interface ComparisonChartProps {
  assets: Array<{
    slug: string;
    symbol: string;
    color: string;
    history: HistoryPoint[];
  }>;
}

export function ComparisonChart({ assets }: ComparisonChartProps) {
  if (assets.length === 0) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: palette.paperDim,
        }}
      >
        NO ASSETS SELECTED
      </div>
    );
  }

  // Normalize all histories to same timestamps and scale to 0-100 for easy comparison
  const allTimestamps = new Set<number>();
  assets.forEach((asset) => {
    asset.history.forEach((point) => {
      allTimestamps.add(point.t);
    });
  });

  const sortedTimestamps = Array.from(allTimestamps).sort();

  // Build normalized data with original prices for tooltip
  const data = sortedTimestamps.map((timestamp) => {
    const point: ComparisonData = { timestamp };

    assets.forEach((asset) => {
      const historyPoint = asset.history.find((h) => h.t === timestamp);
      if (historyPoint) {
        // Find min/max for this asset's history to normalize to 0-100
        const prices = asset.history.map((h) => h.p);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice || 1;
        const normalized = ((historyPoint.p - minPrice) / priceRange) * 100;
        point[asset.slug] = normalized;
        // Store original price for tooltip
        point[`${asset.slug}_price`] = historyPoint.p;
      }
    });

    return point;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const timestamp = payload[0].payload.timestamp;

      return (
        <div
          style={{
            background: palette.panel,
            border: `1px solid ${palette.amber}`,
            padding: "12px",
            borderRadius: "2px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: palette.paper,
          }}
        >
          <div style={{ color: palette.amberDim, marginBottom: "8px", fontSize: "0.65rem" }}>
            {new Date(timestamp).toLocaleTimeString()}
          </div>
          {assets.map((asset, idx) => {
            const normalized = payload.find((p: any) => p.dataKey === asset.slug)?.value;
            const originalPrice = payload[0].payload[`${asset.slug}_price`];

            return (
              <div
                key={asset.slug}
                style={{
                  color: asset.color,
                  marginBottom: idx < assets.length - 1 ? "6px" : 0,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <span>{asset.symbol}:</span>
                <span style={{ fontWeight: 600 }}>
                  ${originalPrice?.toFixed(2) || "—"} ({normalized?.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ height: "300px", filter: `drop-shadow(0 0 6px ${palette.amber}44)` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <YAxis domain={[0, 100]} hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: palette.amber, strokeDasharray: "5 5", strokeOpacity: 0.6 }} />
            {assets.map((asset) => (
              <Line
                key={asset.slug}
                type="monotone"
                dataKey={asset.slug}
                stroke={asset.color}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          padding: "8px 0",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          flexWrap: "wrap",
        }}
      >
        {assets.map((asset) => (
          <div key={asset.slug} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "2px",
                background: asset.color,
              }}
            />
            <span style={{ color: palette.paper }}>{asset.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
