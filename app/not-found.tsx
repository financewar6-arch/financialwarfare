"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export default function NotFound() {
  const { palette } = useTheme();

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontSize: "6rem", fontWeight: 700, color: palette.amber, marginBottom: "16px", lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2.5rem", fontWeight: 700, marginBottom: "12px" }}>
          Signal Lost
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", color: palette.paperDim, marginBottom: "32px", lineHeight: 1.6 }}>
          This asset isn't in our coverage universe or has been archived. The market moves on, but you don't have to get lost.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              padding: "12px 24px",
              background: palette.amber,
              color: palette.bg,
              textDecoration: "none",
              borderRadius: "4px",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/war-room"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              padding: "12px 24px",
              background: "transparent",
              color: palette.paper,
              textDecoration: "none",
              border: `1px solid ${palette.hairline}`,
              borderRadius: "4px",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLAnchorElement).style.color = palette.paper;
            }}
          >
            Browse War Rooms
          </Link>
          <Link
            href="/frontline"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              padding: "12px 24px",
              background: "transparent",
              color: palette.paper,
              textDecoration: "none",
              border: `1px solid ${palette.hairline}`,
              borderRadius: "4px",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLAnchorElement).style.color = palette.paper;
            }}
          >
            Front Line
          </Link>
        </div>

        <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: `1px solid ${palette.hairline}` }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
            ● SIGNAL OFFLINE · RECONNECT AVAILABLE
          </p>
        </div>
      </div>
    </div>
  );
}
