/**
 * Premium CTA Component for MY WAR ROOM
 * Used to show premium upsell or access-denied screens
 */

"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export type AccessState = "AVAILABLE" | "LOCKED" | "BETA" | "WAITLIST_ONLY" | "DISABLED";

interface PremiumMyWarRoomCTAProps {
  state: AccessState;
  assetSymbol?: string;
}

export function PremiumMyWarRoomCTA({ state, assetSymbol }: PremiumMyWarRoomCTAProps) {
  const { palette } = useTheme();

  if (state === "AVAILABLE") {
    return null; // User has access, no CTA needed
  }

  if (state === "DISABLED") {
    return (
      <div
        style={{
          background: `${palette.panel}44`,
          border: `1px solid ${palette.hairline}`,
          padding: "32px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div style={{ color: palette.paperDim, marginBottom: "8px" }}>
          Coming soon
        </div>
        <h3 style={{ color: palette.amber, marginBottom: "12px" }}>
          MY WAR ROOM
        </h3>
        <p style={{ color: palette.paperDim }}>
          This feature is coming soon to Financial Warfare Pro.
        </p>
      </div>
    );
  }

  if (state === "WAITLIST_ONLY") {
    return (
      <div
        style={{
          background: `${palette.panel}99`,
          border: `2px solid ${palette.amber}`,
          padding: "40px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.3rem",
            color: palette.amber,
            marginBottom: "12px",
          }}
        >
          MY WAR ROOM
        </h2>
        <p
          style={{
            fontSize: "1.05rem",
            color: palette.paperDim,
            marginBottom: "24px",
          }}
        >
          Your personal market intelligence workspace.
        </p>

        <div
          style={{
            background: palette.bg,
            padding: "24px",
            borderRadius: "6px",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: "0.9rem", color: palette.paper, lineHeight: 1.8 }}>
            <div style={{ marginBottom: "12px" }}>
              ✓ Your own investment/research thesis
            </div>
            <div style={{ marginBottom: "12px" }}>
              ✓ Personal notes and tracking
            </div>
            <div style={{ marginBottom: "12px" }}>
              ✓ Relevant market updates
            </div>
            <div style={{ marginBottom: "12px" }}>
              ✓ Structured developments
            </div>
            <div style={{ marginBottom: "12px" }}>
              ✓ Risk monitoring
            </div>
            <div>✓ Asset-specific news and events</div>
          </div>
        </div>

        <button
          style={{
            padding: "14px 40px",
            background: palette.amber,
            color: palette.bg,
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "1rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          JOIN THE WAITLIST
        </button>

        <p style={{ color: palette.paperDim, fontSize: "0.85rem", marginTop: "16px" }}>
          Be first to access when MY WAR ROOM launches.
        </p>
      </div>
    );
  }

  if (state === "BETA") {
    return (
      <div
        style={{
          background: `${palette.panel}99`,
          border: `2px solid ${palette.green}`,
          padding: "32px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div style={{ color: palette.green, fontSize: "0.9rem", fontWeight: 600, marginBottom: "8px" }}>
          BETA ACCESS
        </div>
        <h3 style={{ color: palette.amber, marginBottom: "16px" }}>
          MY WAR ROOM
        </h3>
        <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
          You have beta access to create a personalized War Room {assetSymbol && `for ${assetSymbol}`}.
        </p>
        <Link
          href="/my-war-rooms/create"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            background: palette.green,
            color: palette.bg,
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          START BETA TESTING →
        </Link>
      </div>
    );
  }

  // LOCKED state
  return (
    <div
      style={{
        background: `${palette.panel}99`,
        border: `1px solid ${palette.hairline}`,
        padding: "40px",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ color: palette.paperDim, marginBottom: "8px", fontSize: "0.85rem" }}>
        🔒 PREMIUM FEATURE
      </div>
      <h2
        style={{
          fontSize: "1.3rem",
          color: palette.amber,
          marginBottom: "12px",
        }}
      >
        MY WAR ROOM
      </h2>
      <p
        style={{
          fontSize: "1.05rem",
          color: palette.paperDim,
          marginBottom: "24px",
        }}
      >
        Build a personalised intelligence workspace around {assetSymbol ? assetSymbol : "any asset"} you're researching.
      </p>

      <div
        style={{
          background: palette.bg,
          padding: "24px",
          borderRadius: "6px",
          marginBottom: "24px",
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: "0.9rem", color: palette.paper, lineHeight: 1.8 }}>
          <div style={{ marginBottom: "12px" }}>
            ✓ Your own investment/research thesis
          </div>
          <div style={{ marginBottom: "12px" }}>
            ✓ Personal notes and tracking
          </div>
          <div style={{ marginBottom: "12px" }}>
            ✓ Relevant market updates
          </div>
          <div style={{ marginBottom: "12px" }}>
            ✓ Structured developments
          </div>
          <div style={{ marginBottom: "12px" }}>
            ✓ Risk monitoring
          </div>
          <div style={{ marginBottom: "12px" }}>
            ✓ Upcoming events
          </div>
          <div style={{ marginBottom: "12px" }}>
            ✓ Asset-specific news
          </div>
          <div>✓ Continuous information updates</div>
        </div>
      </div>

      <button
        style={{
          padding: "14px 40px",
          background: palette.amber,
          color: palette.bg,
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "1rem",
          transition: "all 0.2s",
          marginRight: "12px",
          marginBottom: "12px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "1";
        }}
      >
        UNLOCK PREMIUM
      </button>

      <p style={{ color: palette.paperDim, fontSize: "0.85rem" }}>
        Premium feature — Coming soon
      </p>
    </div>
  );
}

/**
 * Inline CTA for existing War Room page
 * Shows after public War Room content
 */
export function InlineMyWarRoomCTA({ assetName, assetSymbol }: { assetName: string; assetSymbol: string }) {
  const { palette } = useTheme();

  return (
    <div
      style={{
        borderTop: `2px solid ${palette.hairline}`,
        marginTop: "40px",
        paddingTop: "40px",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          fontSize: "1.1rem",
          color: palette.amber,
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        📰 MY WAR ROOM
      </h3>
      <p style={{ color: palette.paperDim, marginBottom: "16px" }}>
        Want to track {assetName} yourself?
      </p>
      <Link
        href={`/my-war-rooms/create?asset=${assetSymbol}`}
        style={{
          display: "inline-block",
          padding: "12px 32px",
          background: palette.amber,
          color: palette.bg,
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "1";
        }}
      >
        CREATE A PERSONALIZED WAR ROOM →
      </Link>
    </div>
  );
}
