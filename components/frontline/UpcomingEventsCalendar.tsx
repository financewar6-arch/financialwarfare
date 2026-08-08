"use client";

import { palette } from "@/lib/warroom/palette";
import type { EconomicEvent } from "@/lib/economic-calendar";

interface UpcomingEventsCalendarProps {
  events: EconomicEvent[];
}

export function UpcomingEventsCalendar({ events }: UpcomingEventsCalendarProps) {
  if (events.length === 0) {
    return (
      <div
        style={{
          padding: "20px",
          background: palette.panel,
          border: `1px solid ${palette.hairline}`,
          borderRadius: "2px",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: palette.paperDim,
        }}
      >
        NO UPCOMING EVENTS IN NEXT 30 DAYS
      </div>
    );
  }

  return (
    <div
      style={{
        background: palette.panel,
        border: `1px solid ${palette.hairline}`,
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${palette.hairline}`,
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: palette.amberDim,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        ▸ Economic Calendar (Next 30 Days)
      </div>

      {/* Events List */}
      <div>
        {events.map((event, idx) => (
          <div key={`${event.event}-${event.date.toISOString()}`}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 60px 1fr auto",
                gap: "12px",
                padding: "12px 16px",
                alignItems: "start",
                borderBottom: idx < events.length - 1 ? `1px solid ${palette.hairline}` : "none",
              }}
            >
              {/* Date & Time */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amber, fontWeight: 600 }}>
                  {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, marginTop: "2px" }}>
                  {event.time} ET
                </div>
              </div>

              {/* Impact Badge */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 6px",
                    background: event.impact === "high" ? `${palette.red}33` : event.impact === "medium" ? `${palette.amber}33` : `${palette.green}33`,
                    borderRadius: "1px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    color: event.impact === "high" ? palette.red : event.impact === "medium" ? palette.amber : palette.green,
                    width: "fit-content",
                  }}
                >
                  <span style={{ fontSize: "0.7rem" }}>{event.impact === "high" ? "●" : "○"}</span>
                  {event.impact.toUpperCase()}
                </div>
              </div>

              {/* Event Name & Description */}
              <div>
                <div style={{ fontFamily: "var(--font-header)", fontSize: "0.8rem", fontWeight: 600, color: palette.paper }}>
                  {event.event}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim, marginTop: "4px", lineHeight: 1.3 }}>
                  {event.description}
                </div>
              </div>

              {/* Country Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  background: `${palette.amber}22`,
                  borderRadius: "1px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: palette.amber,
                  textTransform: "uppercase",
                  height: "fit-content",
                }}
              >
                {event.country}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 16px",
          background: `${palette.bg}66`,
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: palette.paperDim,
        }}
      >
        Dates are approximate and subject to change. Check official sources for exact timing.
      </div>
    </div>
  );
}
