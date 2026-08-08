"use client";

import { palette } from "@/lib/warroom/palette";
import type { OhlcPoint } from "@/lib/providers/types";
import { useState } from "react";

export function CandlestickChart({ ohlc }: { ohlc: OhlcPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!ohlc || ohlc.length < 2) {
    return (
      <div
        style={{
          height: "140px",
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

  const w = 640,
    h = 140,
    padTop = 8,
    padBottom = 8;
  const highs = ohlc.map((d) => d.h);
  const lows = ohlc.map((d) => d.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;
  const slot = w / ohlc.length;
  const bodyWidth = Math.max(1.5, slot * 0.55);

  const y = (v: number) => padTop + (1 - (v - min) / range) * (h - padTop - padBottom);

  return (
    <div style={{ height: `${h}px`, width: "100%", position: "relative" }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ cursor: "crosshair" }}>
        {ohlc.map((d, i) => {
          const up = d.c >= d.o;
          const baseColor = up ? palette.green : palette.red;
          const isHovered = i === hoveredIndex;
          const color = isHovered ? palette.amber : baseColor;
          const opacity = isHovered ? 1 : 0.85;
          const cx = i * slot + slot / 2;
          const yOpen = y(d.o);
          const yClose = y(d.c);
          const yHigh = y(d.h);
          const yLow = y(d.l);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyH = Math.max(1, Math.abs(yClose - yOpen));

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Hover highlight background */}
              {isHovered && (
                <rect
                  x={cx - slot / 2 + 2}
                  y={padTop}
                  width={slot - 4}
                  height={h - padTop - padBottom}
                  fill={palette.amber}
                  opacity="0.08"
                  pointerEvents="none"
                />
              )}
              {/* Wick */}
              <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={color} strokeWidth="1" opacity={opacity} />
              {/* Body */}
              <rect x={cx - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bodyH} fill={color} opacity={opacity} />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredIndex !== null && (
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: `calc(${(hoveredIndex / ohlc.length) * 100}% + 8px)`,
            background: palette.panel,
            border: `1px solid ${palette.amber}`,
            padding: "6px 8px",
            borderRadius: "2px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: palette.paper,
            whiteSpace: "nowrap",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ color: palette.amber, fontWeight: "bold", marginBottom: "2px" }}>
            O: ${ohlc[hoveredIndex].o.toFixed(2)}
          </div>
          <div>H: ${ohlc[hoveredIndex].h.toFixed(2)}</div>
          <div>L: ${ohlc[hoveredIndex].l.toFixed(2)}</div>
          <div style={{ color: ohlc[hoveredIndex].c >= ohlc[hoveredIndex].o ? palette.green : palette.red }}>
            C: ${ohlc[hoveredIndex].c.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
