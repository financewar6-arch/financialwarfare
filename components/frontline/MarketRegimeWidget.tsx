"use client";

import { palette } from "@/lib/warroom/palette";
import type { MarketRegimeSnapshot } from "@/lib/frontline";

interface MarketRegimeWidgetProps {
  regime: MarketRegimeSnapshot;
}

export function MarketRegimeWidget({ regime }: MarketRegimeWidgetProps) {
  const regimeColor = regime.regime === "bullish" ? palette.green : regime.regime === "bearish" ? palette.red : palette.amber;
  const regimeEmoji = regime.regime === "bullish" ? "▲" : regime.regime === "bearish" ? "▼" : "—";

  return (
    <div
      style={{
        padding: "20px",
        background: palette.panel,
        border: `1px solid ${palette.hairline}`,
        borderLeft: `3px solid ${regimeColor}`,
        borderRadius: "2px",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "12px" }}>
        MARKET REGIME
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
        {/* VIX */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, marginBottom: "4px" }}>
            VIX (VOLATILITY)
          </div>
          <div
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: regime.vixLevel > 25 ? palette.red : regime.vixLevel > 15 ? palette.amber : palette.green,
            }}
          >
            {regime.vixLevel.toFixed(1)}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, marginTop: "2px" }}>
            {regime.vixLevel > 25 ? "HIGH" : regime.vixLevel > 15 ? "MODERATE" : "LOW"}
          </div>
        </div>

        {/* 10Y Yield */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, marginBottom: "4px" }}>
            10Y TREASURY YIELD
          </div>
          <div
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: regime.treasuryYield > 4 ? palette.red : regime.treasuryYield > 3 ? palette.amber : palette.green,
            }}
          >
            {regime.treasuryYield.toFixed(2)}%
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, marginTop: "2px" }}>
            {regime.treasuryYield > 4 ? "HIGH" : regime.treasuryYield > 3 ? "MODERATE" : "LOW"}
          </div>
        </div>
      </div>

      {/* Regime Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: `${regimeColor}22`, borderRadius: "2px", marginBottom: "12px" }}>
        <div style={{ fontSize: "1.4rem", color: regimeColor }}>{regimeEmoji}</div>
        <div>
          <div style={{ fontFamily: "var(--font-header)", fontSize: "0.9rem", fontWeight: 600, color: regimeColor }}>
            {regime.regime.toUpperCase()} SENTIMENT
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
            {regime.regime === "bullish"
              ? "Risk-on, high appetite"
              : regime.regime === "bearish"
                ? "Risk-off, defensive positioning"
                : "Mixed signals, cautious"}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.paperDim, lineHeight: 1.5 }}>
        {regime.reasoning}
      </div>
    </div>
  );
}
