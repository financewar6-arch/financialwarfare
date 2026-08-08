"use client";

import { FrontLineEventCard } from "./FrontLineEventCard";
import { palette } from "@/lib/warroom/palette";
import type { FrontLineEvent } from "@/lib/frontline";

interface EventGridProps {
  events: FrontLineEvent[];
  loading: boolean;
}

export function EventGrid({ events, loading }: EventGridProps) {
  if (loading) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: palette.paperDim,
        }}
      >
        SCANNING MARKETS...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: palette.paperDim,
        }}
      >
        NO SIGNIFICANT EVENTS DETECTED — MARKETS QUIET
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
      {events.map((event) => (
        <FrontLineEventCard key={`${event.assetSlug}-${event.timestamp}`} event={event} />
      ))}
    </div>
  );
}
