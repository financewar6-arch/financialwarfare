"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

interface MarketEvent {
  assetSlug: string;
  assetName: string;
  assetSymbol: string;
  headline: string;
  whyItMatters: string;
  priceChange: number;
  timestamp: number;
  score: number;
  type?: string;
}

interface WhatsMovingProps {
  initialLimit?: number;
  mobileLimit?: number;
}

export function WhatsMovingTheMarket({ initialLimit = 5, mobileLimit = 3 }: WhatsMovingProps) {
  const { palette } = useTheme();
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch("/api/frontline/events");
        const data = await response.json();

        if (data.events && Array.isArray(data.events)) {
          // Take top N events based on device
          const limit = isMobile ? mobileLimit : initialLimit;
          setEvents(data.events.slice(0, limit));
          setLastUpdated(new Date());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Refresh every 15 seconds for real-time price updates
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, [isMobile, initialLimit, mobileLimit]);

  const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now.getTime() - eventTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getDirectionColor = (change: number) => {
    return change >= 0 ? palette.green : palette.red;
  };

  const getDirectionEmoji = (change: number) => {
    return change >= 0 ? "📈" : "📉";
  };

  // Loading state
  if (loading && events.length === 0) {
    return (
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: palette.amberDim,
            letterSpacing: "0.1em",
            marginBottom: "12px",
            textTransform: "uppercase",
          }}
        >
          🔥 What's Moving the Market
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Array.from({ length: isMobile ? mobileLimit : initialLimit }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: "14px",
                backgroundColor: palette.panel,
                border: `1px solid ${palette.hairline}`,
                borderRadius: "6px",
                height: "100px",
                animation: "pulse 2s infinite",
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: palette.amberDim,
            letterSpacing: "0.1em",
            marginBottom: "12px",
            textTransform: "uppercase",
          }}
        >
          🔥 What's Moving the Market
        </div>
        <div
          style={{
            padding: "16px",
            backgroundColor: palette.panel,
            color: palette.paperDim,
            borderRadius: "6px",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          Market intelligence temporarily unavailable.
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && events.length === 0) {
    return (
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: palette.amberDim,
            letterSpacing: "0.1em",
            marginBottom: "12px",
            textTransform: "uppercase",
          }}
        >
          🔥 What's Moving the Market
        </div>
        <div
          style={{
            padding: "20px",
            backgroundColor: palette.panel,
            color: palette.paperDim,
            borderRadius: "6px",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          Markets are relatively quiet right now. Check back soon.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: palette.amberDim,
          letterSpacing: "0.1em",
          marginBottom: "12px",
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🔥 What's Moving the Market</span>
        {lastUpdated && (
          <span style={{ fontSize: "0.65rem", color: palette.paperDim }}>
            Updated {formatTimestamp(lastUpdated.getTime())}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {events.map((event) => (
          <Link
            key={`${event.assetSlug}-${event.timestamp}`}
            href={`/war-room/${event.assetSlug}`}
            style={{
              padding: "14px",
              backgroundColor: palette.panel,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "6px",
              textDecoration: "none",
              display: "block",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLElement).style.backgroundColor = `${palette.panel}dd`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLElement).style.backgroundColor = palette.panel;
            }}
          >
            {/* Header: Symbol + Change */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "0.8rem", color: palette.paper }}>
                  {event.assetSymbol}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: getDirectionColor(event.priceChange),
                    fontWeight: 600,
                  }}
                >
                  {getDirectionEmoji(event.priceChange)} {event.priceChange > 0 ? "+" : ""}
                  {event.priceChange.toFixed(1)}%
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
                {formatTimestamp(event.timestamp)}
              </span>
            </div>

            {/* Headline */}
            <div style={{ marginBottom: "8px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: palette.paper, margin: 0, lineHeight: 1.3 }}>
                {event.headline}
              </p>
            </div>

            {/* Why It Moved */}
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: palette.amberDim,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "2px",
                }}
              >
                Why It Moved
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: palette.paperDim, margin: 0, lineHeight: 1.2 }}>
                {event.whyItMatters}
              </p>
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: "10px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: palette.amber,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Open {event.assetSymbol} War Room →
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <Link
          href="/frontline"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: palette.amber,
            textDecoration: "none",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          View all market events →
        </Link>
      </div>
    </div>
  );
}
