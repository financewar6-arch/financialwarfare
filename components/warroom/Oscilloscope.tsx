"use client";

import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, ReferenceLine, ComposedChart, Bar } from "recharts";
import { palette } from "@/lib/warroom/palette";
import type { HistoryPoint } from "@/lib/providers/types";
import { useState, useMemo } from "react";

export function Oscilloscope({ history, color }: { history: HistoryPoint[]; color: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length < 2) {
    return (
      <div
        style={{
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: palette.paperDim,
        }}
      >
        AWAITING SIGNAL...
      </div>
    );
  }

  // Calculate technical indicators
  const enrichedData = useMemo(() => {
    return history.map((d, i) => {
      // 20-period SMA
      const period20 = Math.min(20, i + 1);
      const sum20 = history.slice(Math.max(0, i - period20 + 1), i + 1).reduce((acc, h) => acc + h.p, 0);
      const sma20 = sum20 / period20;

      // 50-period SMA
      const period50 = Math.min(50, i + 1);
      const sum50 = history.slice(Math.max(0, i - period50 + 1), i + 1).reduce((acc, h) => acc + h.p, 0);
      const sma50 = sum50 / period50;

      // Bollinger Bands (20-period, 2 std dev)
      const prices = history.slice(Math.max(0, i - 19), i + 1).map((h) => h.p);
      const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
      const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
      const stdDev = Math.sqrt(variance);

      return {
        t: d.t,
        p: d.p,
        sma20,
        sma50,
        bbUpper: mean + stdDev * 2,
        bbLower: mean - stdDev * 2,
      };
    });
  }, [history]);

  // Calculate price change (24h volatility proxy)
  const priceRange = Math.max(...history.map((d) => d.p)) - Math.min(...history.map((d) => d.p));
  const referenceLine = enrichedData[enrichedData.length - 1]?.p ?? 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const change = ((data.p - (enrichedData[0]?.p ?? 0)) / (enrichedData[0]?.p ?? 1)) * 100;
      return (
        <div
          style={{
            background: palette.panel,
            border: `2px solid ${color}`,
            padding: "8px 10px",
            borderRadius: "4px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: palette.paper,
            whiteSpace: "nowrap",
            boxShadow: `0 0 12px ${color}40`,
          }}
        >
          <div style={{ color: color, fontWeight: "bold", fontSize: "0.7rem", marginBottom: "3px" }}>
            ${data.p.toFixed(2)}
          </div>
          <div style={{ color: palette.blue, fontSize: "0.6rem" }}>
            SMA(20): ${data.sma20.toFixed(2)}
          </div>
          <div style={{ color: palette.paperDim, fontSize: "0.6rem", marginTop: "2px" }}>
            {new Date(data.t).toLocaleTimeString()}
          </div>
          <div style={{ color: change >= 0 ? palette.green : palette.red, fontSize: "0.6rem", marginTop: "2px", fontWeight: 600 }}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        height: "160px",
        filter: `drop-shadow(0 0 6px ${color}60)`,
        position: "relative",
        marginBottom: "12px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={enrichedData}
          margin={{ top: 8, right: 4, bottom: 20, left: 4 }}
          onMouseMove={(state: any) => {
            if (state && state.activeTooltipIndex !== undefined) {
              setHoveredIndex(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="scopeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="50%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bbFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.amber} stopOpacity={0.08} />
              <stop offset="100%" stopColor={palette.amber} stopOpacity={0} />
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <YAxis domain={["dataMin", "dataMax"]} hide />

          {/* Reference line (current price) */}
          <ReferenceLine y={referenceLine} stroke={color} strokeDasharray="3,3" opacity={0.2} strokeWidth={1} />

          {/* Bollinger Bands as fill */}
          <Area
            type="monotone"
            dataKey="bbUpper"
            stroke="none"
            fill="url(#bbFill)"
            isAnimationActive={false}
            dot={false}
            opacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="bbLower"
            stroke="none"
            fill="url(#bbFill)"
            isAnimationActive={false}
            dot={false}
            opacity={0.3}
          />

          {/* 50-period SMA (background) */}
          <Area
            type="monotone"
            dataKey="sma50"
            stroke={palette.amber}
            strokeWidth={1}
            opacity={0.3}
            fill="none"
            isAnimationActive={false}
            dot={false}
            strokeDasharray="4,3"
          />

          {/* Main price line with glow */}
          <Area
            type="monotone"
            dataKey="p"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#scopeFill)"
            isAnimationActive={false}
            dot={hoveredIndex !== null ? { r: 4, fill: color, stroke: palette.paper, strokeWidth: 2 } : false}
            filter="url(#lineGlow)"
          />

          {/* 20-period SMA (foreground) */}
          <Area
            type="monotone"
            dataKey="sma20"
            stroke={palette.amber}
            strokeWidth={1.5}
            opacity={0.7}
            fill="none"
            isAnimationActive={false}
            dot={false}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: color,
              strokeWidth: 2,
              opacity: 0.6,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "2px",
          left: "4px",
          fontSize: "0.6rem",
          color: palette.paperDim,
          fontFamily: "var(--font-mono)",
          display: "flex",
          gap: "12px",
        }}
      >
        <span>
          PRICE: <span style={{ color }}>━</span>
        </span>
        <span>
          MA(20): <span style={{ color: palette.amber }}>━</span>
        </span>
        <span>
          MA(50): <span style={{ color: palette.amber }}>┄</span>
        </span>
        <span>
          BB(2σ): <span style={{ color: palette.amber }}>▢</span>
        </span>
      </div>
    </div>
  );
}
