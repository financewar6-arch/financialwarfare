"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { palette } from "@/lib/warroom/palette";

interface MacroIndicator {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  change24h: number | null;
  date: string;
}

const SAMPLE_INDICATORS: MacroIndicator[] = [
  { symbol: "VIX", name: "Volatility Index", value: 18.45, unit: "", change24h: -2.3, date: new Date().toISOString() },
  { symbol: "10Y", name: "10Y Treasury Yield", value: 4.25, unit: "%", change24h: 0.15, date: new Date().toISOString() },
  { symbol: "UNRATE", name: "US Unemployment", value: 3.8, unit: "%", change24h: 0, date: new Date().toISOString() },
  { symbol: "USD/EUR", name: "Dollar Index", value: 104.2, unit: "", change24h: 1.2, date: new Date().toISOString() },
];

export default function MarketsPage() {
  const [indicators, setIndicators] = useState<MacroIndicator[]>(SAMPLE_INDICATORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/macro")
      .then((res) => res.json())
      .then((data) => {
        setIndicators(data.indicators && data.indicators.length > 0 ? data.indicators : SAMPLE_INDICATORS);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Macro fetch failed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.6rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "4px" }}>
          MACRO MARKETS
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim }}>
          Global economic indicators · Cross-asset regime backdrop
        </div>
      </div>

      {/* Macro Signals Grid */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "16px", textTransform: "uppercase" }}>
          ▸ Key Indicators
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {indicators.map((indicator) => {
            const isPositive = indicator.change24h && indicator.change24h > 0;
            const changeColor = isPositive ? palette.green : indicator.change24h && indicator.change24h < 0 ? palette.red : palette.paperDim;

            return (
              <div
                key={indicator.symbol}
                style={{
                  padding: "16px",
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  transition: "all 0.2s",
                  borderRadius: "2px",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = palette.amber;
                  el.style.background = `${palette.panel}dd`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = palette.hairline;
                  el.style.background = `${palette.panel}99`;
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "6px", textTransform: "uppercase" }}>
                  {indicator.symbol}
                </div>
                <div style={{ fontFamily: "var(--font-header)", fontSize: "1.4rem", fontWeight: 700, color: palette.paper, marginBottom: "6px", lineHeight: 1 }}>
                  {indicator.value.toFixed(2)}<span style={{ fontSize: "0.85rem", color: palette.paperDim }}>{indicator.unit}</span>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: palette.paperDim, marginBottom: "8px" }}>
                  {indicator.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: changeColor,
                    fontWeight: 600,
                  }}
                >
                  {indicator.change24h !== null ? `${indicator.change24h > 0 ? "+" : ""}${indicator.change24h.toFixed(2)}` : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Section */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
          ▸ Regime Analysis
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
          <div style={{ padding: "16px", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}`, borderRadius: "2px" }}>
            <div style={{ fontFamily: "var(--font-header)", fontSize: "0.95rem", fontWeight: 600, color: palette.paper, marginBottom: "8px" }}>
              Volatility Regime
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.5, color: palette.paperDim }}>
              VIX at historically low levels indicates reduced tail risk. Market breadth remains stable across major indices.
            </div>
          </div>
          <div style={{ padding: "16px", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}`, borderRadius: "2px" }}>
            <div style={{ fontFamily: "var(--font-header)", fontSize: "0.95rem", fontWeight: 600, color: palette.paper, marginBottom: "8px" }}>
              Rates Backdrop
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.5, color: palette.paperDim }}>
              10Y yield signals moderate growth expectations. Real yields support equity valuations at current levels.
            </div>
          </div>
          <div style={{ padding: "16px", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}`, borderRadius: "2px" }}>
            <div style={{ fontFamily: "var(--font-header)", fontSize: "0.95rem", fontWeight: 600, color: palette.paper, marginBottom: "8px" }}>
              Labor Market
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.5, color: palette.paperDim }}>
              Unemployment near historical lows. Wage pressure persists but inflation trajectory improving quarter-over-quarter.
            </div>
          </div>
        </div>
      </div>

      {/* Macro Context Box */}
      <div style={{ padding: "20px", background: `linear-gradient(135deg, ${palette.panel}cc, ${palette.panel}99)`, border: `1px solid ${palette.amber}44`, borderRadius: "2px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontSize: "0.95rem", fontWeight: 600, color: palette.amber, marginBottom: "10px", letterSpacing: "0.05em" }}>
          MACRO CONTEXT
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.7, color: palette.paper }}>
          <p style={{ margin: "0 0 10px 0" }}>
            <strong>Volatility (VIX):</strong> Measures expected 30-day price fluctuations. Reflects market fear gauge; below 20 is historically low.
          </p>
          <p style={{ margin: "0 0 10px 0" }}>
            <strong>10Y Yield:</strong> Bond market's expectations for inflation and Fed policy. Influences equity valuations and borrowing costs across the economy.
          </p>
          <p style={{ margin: "0" }}>
            <strong>Unemployment:</strong> Labor market health indicator. Low readings support consumer spending and corporate earnings growth backdrop.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
