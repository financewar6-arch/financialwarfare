"use client";

import { palette } from "@/lib/warroom/palette";
import type { OhlcPoint } from "@/lib/providers/types";
import { useState, useMemo } from "react";

export function CandlestickChart({ ohlc }: { ohlc: OhlcPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!ohlc || ohlc.length < 2) {
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

  const w = 640, h = 160, padTop = 12, padBottom = 24;
  const highs = ohlc.map((d) => d.h);
  const lows = ohlc.map((d) => d.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;
  const slot = w / ohlc.length;
  const bodyWidth = Math.max(2, slot * 0.5);

  // Calculate moving averages (20-period and 50-period where available)
  const calculateMA = (period: number) => {
    return ohlc.map((_, i) => {
      if (i < period - 1) return null;
      const sum = ohlc.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.c, 0);
      return sum / period;
    });
  };

  const ma20 = calculateMA(20);
  const ma50 = calculateMA(50);

  const y = (v: number) => padTop + (1 - (v - min) / range) * (h - padTop - padBottom);

  return (
    <div style={{ height: `${h}px`, width: "100%", position: "relative", marginBottom: "8px" }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ cursor: "crosshair" }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.amber} stopOpacity="0.08" />
            <stop offset="100%" stopColor={palette.amber} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={`grid-${i}`}
            x1="0"
            y1={padTop + pct * (h - padTop - padBottom)}
            x2={w}
            y2={padTop + pct * (h - padTop - padBottom)}
            stroke={palette.grid}
            strokeWidth="0.5"
            opacity={i === 0.5 ? 0.3 : 0.15}
            strokeDasharray="2,2"
          />
        ))}

        {/* 50-period MA */}
        {ma50.some((v) => v !== null) && (
          <polyline
            points={ma50
              .map((v, i) => (v !== null ? `${i * slot + slot / 2},${y(v)}` : null))
              .filter(Boolean)
              .join(" ")}
            fill="none"
            stroke={palette.amber}
            strokeWidth="1"
            opacity="0.4"
            strokeDasharray="3,3"
          />
        )}

        {/* 20-period MA */}
        {ma20.some((v) => v !== null) && (
          <polyline
            points={ma20
              .map((v, i) => (v !== null ? `${i * slot + slot / 2},${y(v)}` : null))
              .filter(Boolean)
              .join(" ")}
            fill="none"
            stroke={palette.amber}
            strokeWidth="1.5"
            opacity="0.7"
          />
        )}

        {/* Candles */}
        {ohlc.map((d, i) => {
          const up = d.c >= d.o;
          const baseColor = up ? palette.green : palette.red;
          const isHovered = i === hoveredIndex;
          const color = isHovered ? palette.amber : baseColor;
          const opacity = isHovered ? 1 : 0.8;
          const cx = i * slot + slot / 2;
          const yOpen = y(d.o);
          const yClose = y(d.c);
          const yHigh = y(d.h);
          const yLow = y(d.l);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));

          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} style={{ cursor: "pointer" }}>
              {isHovered && (
                <>
                  <rect x={cx - slot / 2 + 1} y={padTop} width={slot - 2} height={h - padTop - padBottom} fill={palette.amber} opacity="0.06" />
                  <line x1={cx} y1={padTop} x2={cx} y2={h - padBottom} stroke={color} strokeWidth="1" opacity="0.3" strokeDasharray="2,2" />
                </>
              )}
              <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={color} strokeWidth="1.5" opacity={opacity} filter="url(#glow)" />
              <rect
                x={cx - bodyWidth / 2}
                y={bodyTop}
                width={bodyWidth}
                height={bodyH}
                fill={color}
                opacity={opacity}
                filter={isHovered ? "url(#glow)" : "none"}
                style={{ transition: "all 0.15s ease" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredIndex !== null && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: `calc(${(hoveredIndex / ohlc.length) * 100}% + 12px)`,
            background: palette.panel,
            border: `2px solid ${palette.amber}`,
            padding: "8px 10px",
            borderRadius: "4px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: palette.paper,
            whiteSpace: "nowrap",
            zIndex: 20,
            pointerEvents: "none",
            boxShadow: `0 0 8px ${palette.amber}40`,
          }}
        >
          <div style={{ color: palette.amber, fontWeight: "bold", marginBottom: "3px", fontSize: "0.7rem" }}>
            OHLC
          </div>
          <div>O: <span style={{ color: palette.blue }}>${ohlc[hoveredIndex].o.toFixed(2)}</span></div>
          <div>H: <span style={{ color: palette.blue }}>${ohlc[hoveredIndex].h.toFixed(2)}</span></div>
          <div>L: <span style={{ color: palette.blue }}>${ohlc[hoveredIndex].l.toFixed(2)}</span></div>
          <div>
            C: <span style={{ color: ohlc[hoveredIndex].c >= ohlc[hoveredIndex].o ? palette.green : palette.red }}>
              ${ohlc[hoveredIndex].c.toFixed(2)}
            </span>
          </div>
        </div>
      )}

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
        <span>MA(20): <span style={{ color: palette.amber }}>━</span></span>
        <span>MA(50): <span style={{ color: palette.amber }}>┄</span></span>
      </div>
    </div>
  );
}
