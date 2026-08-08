"use client";

import { useState } from "react";
import { palette } from "@/lib/warroom/palette";

interface DeepDiveCardProps {
  ticker: string;
  symbol: string;
}

interface DeepDiveSummary {
  ticker: string;
  filing_date: string;
  filing_type: string;
  summary: string;
}

export function DeepDiveCard({ ticker, symbol }: DeepDiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<DeepDiveSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (data) {
      setIsExpanded(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/deep-dive/${ticker}`);
      if (!res.ok) {
        throw new Error("Failed to fetch summary");
      }
      const summary = await res.json();
      setData(summary);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading summary");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        margin: "24px 0",
        borderLeft: `2px solid ${palette.amber}`,
        paddingLeft: "16px",
      }}
    >
      <button
        onClick={handleClick}
        style={{
          fontFamily: "var(--font-header)",
          fontWeight: 600,
          fontSize: "1rem",
          color: palette.amber,
          background: "transparent",
          border: "none",
          padding: "0",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = "1";
        }}
      >
        <span style={{ fontSize: "0.8rem" }}>
          {isExpanded ? "▼" : "▶"}
        </span>
        READ THE FULL FILING SUMMARY
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: palette.amberDim,
            marginLeft: "8px",
          }}
        >
          DEEP DIVE
        </span>
      </button>

      {isExpanded && (
        <div style={{ marginTop: "16px" }}>
          {loading ? (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
              ○ GENERATING SUMMARY...
            </div>
          ) : error ? (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.red }}>
              ○ ERROR: {error}
            </div>
          ) : data ? (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: palette.paperDim,
                  marginBottom: "12px",
                }}
              >
                Last updated: {formatDate(data.filing_date)} • {data.filing_type}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: palette.paper,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {data.summary}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: palette.paperDim,
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: `1px solid ${palette.hairline}`,
                }}
              >
                Summary generated from SEC {data.filing_type} filing
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
