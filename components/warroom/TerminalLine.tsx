import type { ReactNode } from "react";
import { palette } from "@/lib/warroom/palette";

const SECTION_COLORS: Record<string, string> = {
  WHY_IT_MOVED: palette.amber,
  WHY_YOU_SHOULD_CARE: palette.green,
  RISK: palette.red,
  WATCH_NEXT: palette.paper,
};

export function TerminalLine({ label, children }: { label: string; children: ReactNode }) {
  const accentColor = SECTION_COLORS[label] || palette.amber;

  return (
    <div
      style={{
        padding: "20px",
        marginBottom: "12px",
        borderLeft: `3px solid ${accentColor}`,
        background: `linear-gradient(90deg, ${accentColor}08 0%, transparent 100%)`,
        border: `1px solid ${accentColor}33`,
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: accentColor,
          marginBottom: "10px",
          letterSpacing: "0.08em",
          fontWeight: 600,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ opacity: 0.5 }}>▸</span>
        <span>{label.replace(/_/g, " ")}</span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          lineHeight: 1.7,
          color: palette.paper,
          paddingLeft: "20px",
          fontWeight: 400,
        }}
      >
        {children}
      </div>
    </div>
  );
}
