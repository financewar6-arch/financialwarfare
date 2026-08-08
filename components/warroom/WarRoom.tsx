"use client";

import { useMemo, useState, useEffect } from "react";
import { palette, RANGES, fmtUSD, fmtCompact } from "@/lib/warroom/palette";
import { useAssetFeed } from "./useAssetFeed";
import { CornerBrackets } from "./CornerBrackets";
import { SentimentGauge } from "./SentimentGauge";
import { Oscilloscope } from "./Oscilloscope";
import { CandlestickChart } from "./CandlestickChart";
import { TerminalLine } from "./TerminalLine";
import { PhotoSlot } from "./PhotoSlot";
import { ToggleButton } from "./ToggleButton";
import { DeepDiveCard } from "./DeepDiveCard";
import { ChartModal } from "./ChartModal";
import { WarRoomImage } from "./WarRoomImage";
import { NavigationTabs } from "./NavigationTabs";
import type { EditorialContent } from "@/content/types";
import { ASSETS } from "@/lib/assets";

// Stock tickers that support Deep Dive
const STOCK_TICKERS = ["AAPL", "NVDA", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "BRK"];

export interface WarRoomProps {
  assetSlug: string;
  name: string;
  symbol: string;
  editorial: EditorialContent;
}

export function WarRoom({ assetSlug, name, symbol, editorial }: WarRoomProps) {
  const [range, setRange] = useState("1");
  const [chartMode, setChartMode] = useState<"candles" | "line">("candles");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const feed = useAssetFeed(assetSlug, range);
  const change = feed.data?.change24h ?? 0;
  const isUp = change >= 0;
  const color = isUp ? palette.green : palette.red;
  const verdict = isUp ? "BULLISH" : "BEARISH";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const bgStyle = useMemo(
    () => ({
      minHeight: "100vh",
      background: palette.bg,
      backgroundImage: `radial-gradient(ellipse 640px 420px at 50% 8%, rgba(217,154,61,0.09), transparent 70%), repeating-linear-gradient(0deg, ${palette.grid} 0px, ${palette.grid} 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, ${palette.grid} 0px, ${palette.grid} 1px, transparent 1px, transparent 32px)`,
      color: palette.paper,
      display: "flex",
      justifyContent: "center",
      padding: "32px 16px",
    }),
    []
  );

  return (
    <div style={bgStyle}>
      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(600px); } }
        .scanline { animation: scan 5s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .scanline { animation: none; display: none; } }
      `}</style>
      <div style={{ width: "100%", maxWidth: "680px" }}>
        {/* Masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
          <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "0.95rem", color: palette.amber, letterSpacing: "0.08em" }}>
            FINANCIAL WARFARE
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
            {feed.status === "live" ? `● LIVE · ${verdict}` : feed.status === "loading" ? "○ ACQUIRING SIGNAL" : "● SIGNAL LOST"}
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: palette.paperDim, marginBottom: "20px" }}>
          THE ONE-MINUTE BRIEFING
        </div>

        {/* Target lock panel */}
        <div style={{ position: "relative", background: palette.panel, border: `1px solid ${palette.hairline}`, padding: "20px", overflow: "hidden" }}>
          <CornerBrackets color={color} />
          <div
            className="scanline"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "40px",
              background: `linear-gradient(180deg, transparent, ${color}14, transparent)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amber, letterSpacing: "0.15em", marginBottom: "4px" }}>
            TARGET LOCKED
          </div>
          <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1rem", color: palette.paperDim, letterSpacing: "0.1em", marginBottom: "14px" }}>
            {name} · {symbol}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <SentimentGauge change={change} />
            <div style={{ flex: 1, minWidth: "160px" }}>
              <div style={{ fontFamily: "var(--font-header)", fontWeight: 700, fontSize: "clamp(1.9rem, 6vw, 2.6rem)", color: palette.paper, lineHeight: 1 }}>
                {feed.data ? fmtUSD(feed.data.price) : "—"}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color, marginTop: "6px" }}>
                {feed.data ? `${isUp ? "+" : ""}${change.toFixed(2)}% / 24H` : "--"}
              </div>
              {feed.error && !feed.data && (
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: palette.red, marginTop: "8px" }}>
                  Signal error: {feed.error}
                </div>
              )}
            </div>
          </div>

          {/* Chart controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {RANGES.map((r) => (
                <ToggleButton key={r.key} active={range === r.key} onClick={() => setRange(r.key)}>
                  {r.label}
                </ToggleButton>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <ToggleButton active={chartMode === "candles"} onClick={() => setChartMode("candles")}>
                CANDLES
              </ToggleButton>
              <ToggleButton active={chartMode === "line"} onClick={() => setChartMode("line")}>
                LINE
              </ToggleButton>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  background: palette.panel,
                  border: `1px solid ${palette.hairline}`,
                  color: palette.paper,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  padding: "6px 10px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = palette.amber;
                  (e.currentTarget as HTMLButtonElement).style.color = palette.amber;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = palette.hairline;
                  (e.currentTarget as HTMLButtonElement).style.color = palette.paper;
                }}
              >
                ↗ EXPAND
              </button>
            </div>
          </div>

          <div>
            {chartMode === "candles" ? (
              <CandlestickChart ohlc={feed.data?.ohlc ?? []} />
            ) : (
              <Oscilloscope history={feed.data?.history ?? []} color={color} />
            )}
          </div>
        </div>

        {/* Readout row */}
        <div style={{ display: "flex", borderLeft: `1px solid ${palette.hairline}`, borderRight: `1px solid ${palette.hairline}`, borderBottom: `1px solid ${palette.hairline}` }}>
          {[
            [
              "24H VOL",
              feed.data?.volume24h != null
                ? feed.data.volumeUnit === "shares"
                  ? `${fmtCompact(feed.data.volume24h)} SH`
                  : `$${fmtCompact(feed.data.volume24h)}`
                : "--",
            ],
            ["MCAP", feed.data?.marketCap != null ? `$${fmtCompact(feed.data.marketCap)}` : "--"],
            ["STATUS", isUp ? "WINNING" : "LOSING"],
          ].map(([label, val], i) => (
            <div key={label} style={{ flex: 1, padding: "12px 14px", borderRight: i < 2 ? `1px solid ${palette.hairline}` : "none" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "4px" }}>
                {label}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: label === "STATUS" ? color : palette.paper }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Contextual Image */}
        {(() => {
          const asset = Object.values(ASSETS).find(a => a.slug === assetSlug);
          const categoryLower = asset?.category?.toLowerCase() || "";

          // Map asset categories to supported image library types
          let assetType: "stock" | "crypto" | "commodity" | "macro" | "luxury" | undefined;

          if (categoryLower.includes("stock") || categoryLower.includes("equities")) assetType = "stock";
          else if (categoryLower.includes("crypto")) assetType = "crypto";
          else if (categoryLower.includes("commodity") || categoryLower.includes("precious") || categoryLower.includes("metal")) assetType = "commodity";
          else if (categoryLower.includes("macro") || categoryLower.includes("treasury") || categoryLower.includes("currency")) assetType = "macro";
          else if (categoryLower.includes("luxury")) assetType = "luxury";

          if (assetType) {
            return <WarRoomImage assetType={assetType} assetSymbol={symbol} assetSlug={assetSlug} />;
          }
          return null;
        })()}

        <div style={{ marginTop: "22px" }}>
          <PhotoSlot label={editorial.photoLabel} color={palette.amberDim} />
        </div>

        {/* Terminal briefing log */}
        <div style={{ marginTop: "6px" }}>
          <TerminalLine label="WHY_IT_MOVED">{editorial.whyItMoved}</TerminalLine>
          <TerminalLine label="WHY_YOU_SHOULD_CARE">{editorial.whyYouShouldCare}</TerminalLine>
          <TerminalLine label="RISK">{editorial.risk}</TerminalLine>
          <TerminalLine label="WATCH_NEXT">{editorial.watchNext}</TerminalLine>
        </div>

        {/* Deep Dive for stocks */}
        {STOCK_TICKERS.includes(symbol.toUpperCase().split("-")[0]) && (
          <DeepDiveCard ticker={symbol.split("-")[0]} symbol={symbol.split("-")[0]} />
        )}

        <div style={{ textAlign: "center", padding: "20px 0 6px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
          {feed.updatedAt ? `LAST SYNC ${feed.updatedAt.toLocaleTimeString()}` : "SYNCING..."} · REFRESH 60S
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs currentSlug={assetSlug} currentCategory={Object.values(ASSETS).find((a) => a.slug === assetSlug)?.category} />
      </div>

      {/* Expanded Chart Modal */}
      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chartMode={chartMode}
        ohlc={feed.data?.ohlc ?? []}
        history={feed.data?.history ?? []}
        color={color}
        assetName={name}
        symbol={symbol}
        price={feed.data?.price ?? 0}
        change24h={change}
      />
    </div>
  );
}
