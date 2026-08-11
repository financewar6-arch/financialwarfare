"use client";

import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

interface SourceAttributionProps {
  source: string;
  url?: string;
  timestamp?: Date | string;
  compact?: boolean;
}

export function SourceAttribution({ source, url, timestamp, compact = false }: SourceAttributionProps) {
  const { palette } = useTheme();

  const formatTime = (date: Date | string) => {
    if (typeof date === "string") return date;
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  };

  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.75rem",
          color: palette.paperDim,
          fontFamily: "var(--font-mono)",
        }}
      >
        <span style={{ textTransform: "uppercase", fontWeight: 600 }}>SOURCE</span>
        <span>{source}</span>
        {timestamp && <span style={{ opacity: 0.7 }}>· {formatTime(timestamp)}</span>}
        {url && (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: palette.amber,
              textDecoration: "none",
              marginLeft: "4px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.opacity = "1";
            }}
          >
            →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        borderTop: `1px solid ${palette.hairline}`,
        paddingTop: "12px",
        marginTop: "12px",
        fontSize: "0.8rem",
      }}
    >
      <div style={{ color: palette.paperDim, fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
        <span style={{ textTransform: "uppercase", fontWeight: 600, color: palette.amberDim }}>SOURCE</span>
        <span style={{ marginLeft: "8px" }}>{source}</span>
      </div>
      {timestamp && (
        <div style={{ color: palette.paperDim, fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: "8px" }}>
          {formatTime(timestamp)}
        </div>
      )}
      {url && (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            color: palette.amber,
            textDecoration: "none",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 600,
            transition: "all 0.2s",
            padding: "4px 8px",
            marginLeft: "-8px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          VIEW SOURCE →
        </Link>
      )}
    </div>
  );
}
