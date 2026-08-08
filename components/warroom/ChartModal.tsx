"use client";

import { palette } from "@/lib/warroom/palette";
import { CandlestickChart } from "./CandlestickChart";
import { Oscilloscope } from "./Oscilloscope";
import type { OhlcPoint, HistoryPoint } from "@/lib/providers/types";

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartMode: "candles" | "line";
  ohlc: OhlcPoint[];
  history: HistoryPoint[];
  color: string;
  assetName: string;
  symbol: string;
  price: number;
  change24h: number;
}

export function ChartModal({
  isOpen,
  onClose,
  chartMode,
  ohlc,
  history,
  color,
  assetName,
  symbol,
  price,
  change24h,
}: ChartModalProps) {
  if (!isOpen) return null;

  const isUp = change24h >= 0;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `${palette.bg}ee`,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        style={{
          background: palette.bg,
          border: `1px solid ${palette.hairline}`,
          borderRadius: "2px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "24px",
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em" }}>
              {assetName} · {symbol}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim, marginTop: "4px" }}>
              EXPANDED CHART VIEW
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${palette.hairline}`,
              color: palette.paper,
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              padding: "8px 12px",
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
            ✕ CLOSE
          </button>
        </div>

        {/* Price Display */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px", paddingBottom: "20px", borderBottom: `1px solid ${palette.hairline}` }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amberDim, letterSpacing: "0.08em", marginBottom: "4px" }}>
              PRICE
            </div>
            <div style={{ fontFamily: "var(--font-header)", fontWeight: 700, fontSize: "2rem", color: palette.paper }}>
              ${price.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amberDim, letterSpacing: "0.08em", marginBottom: "4px" }}>
              24H CHANGE
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color }}>
              {isUp ? "+" : ""}
              {change24h.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ minHeight: "400px", marginBottom: "16px" }}>
          {chartMode === "candles" ? (
            <div style={{ position: "relative", height: "400px" }}>
              <CandlestickChart ohlc={ohlc} />
            </div>
          ) : (
            <div style={{ position: "relative", height: "400px" }}>
              <Oscilloscope history={history} color={color} />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, textAlign: "center" }}>
          Press ESC to close
        </div>
      </div>
    </div>
  );
}
