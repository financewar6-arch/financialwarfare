"use client";

import Link from "next/link";
import { palette } from "@/lib/warroom/palette";
import type { FrontLineEvent } from "@/lib/frontline";

interface FrontLineEventCardProps {
  event: FrontLineEvent;
}

export function FrontLineEventCard({ event }: FrontLineEventCardProps) {
  const scoreColor = event.score > 75 ? palette.red : event.score > 50 ? palette.amber : palette.green;
  const scoreLabel = event.score > 75 ? "CRITICAL" : event.score > 50 ? "HIGH" : "MODERATE";

  return (
    <Link
      href={`/war-room/${event.assetSlug}`}
      style={{
        display: "block",
        padding: "16px",
        background: palette.panel,
        border: `1px solid ${palette.hairline}`,
        borderLeft: `3px solid ${scoreColor}`,
        borderRadius: "2px",
        textDecoration: "none",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = scoreColor;
        el.style.background = `${palette.panel}dd`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.borderColor = palette.hairline;
        el.style.background = palette.panel;
      }}
    >
      {/* Header: Asset + Score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, letterSpacing: "0.08em" }}>
            {event.type.toUpperCase()}
          </div>
          <div style={{ fontFamily: "var(--font-header)", fontSize: "0.9rem", fontWeight: 600, color: palette.paper, marginTop: "2px" }}>
            {event.assetName}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600, color: scoreColor }}>
            {event.score.toFixed(0)}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: palette.paperDim }}>
            {scoreLabel}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height: "4px", background: `${scoreColor}33`, borderRadius: "1px", marginBottom: "12px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(event.score, 100)}%`, background: scoreColor, transition: "width 0.3s" }} />
      </div>

      {/* Headline */}
      <div style={{ fontFamily: "var(--font-header)", fontSize: "0.85rem", fontWeight: 600, color: palette.paper, marginBottom: "8px" }}>
        {event.headline}
      </div>

      {/* Why it matters */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.paperDim, marginBottom: "10px", lineHeight: 1.4 }}>
        {event.whyItMatters}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "16px", fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: palette.amberDim }}>
        <span>
          24H: <span style={{ color: event.priceChange >= 0 ? palette.green : palette.red }}>{event.priceChange >= 0 ? "+" : ""}
          {event.priceChange.toFixed(2)}%</span>
        </span>
        {event.volumeChange != null && (
          <span>
            VOL: <span style={{ color: event.volumeChange > 0 ? palette.amber : palette.paperDim }}>
              {event.volumeChange.toFixed(0)}%
            </span>
          </span>
        )}
      </div>

      {/* Related assets */}
      {event.relatedAssets.length > 0 && (
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${palette.hairline}` }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: palette.paperDim, marginBottom: "6px" }}>
            CORRELATED:
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {event.relatedAssets.map((slug) => (
              <span
                key={slug}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  background: `${palette.amber}22`,
                  color: palette.amber,
                  padding: "2px 6px",
                  borderRadius: "1px",
                }}
              >
                {slug.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div style={{ marginTop: "10px", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: palette.paperDim }}>
        {new Date(event.timestamp).toLocaleTimeString()}
      </div>
    </Link>
  );
}
