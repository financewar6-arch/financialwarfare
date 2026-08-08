"use client";

import { useEffect, useState } from "react";
import { palette } from "@/lib/warroom/palette";

interface DailyBriefingProps {
  summary: string;
  loading: boolean;
}

export function DailyBriefing({ summary, loading }: DailyBriefingProps) {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString());
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: palette.panel,
        border: `1px solid ${palette.hairline}`,
        borderLeft: `3px solid ${palette.amber}`,
        borderRadius: "2px",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "12px" }}>
        DAILY BRIEFING
      </div>

      {loading ? (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: palette.paperDim }}>
          GENERATING SUMMARY...
        </div>
      ) : (
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: palette.paper, lineHeight: 1.6 }}>
          {summary}
        </div>
      )}

      <div style={{ marginTop: "12px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
        Updated {timestamp || "—"}
      </div>
    </div>
  );
}
