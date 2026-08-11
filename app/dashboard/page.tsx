"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { palette } = useTheme();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Navigation Tabs */}
        <div style={{ marginBottom: "40px", borderBottom: `2px solid ${palette.amber}`, paddingBottom: "20px" }}>
          <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: palette.amber,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Dashboard
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {["Overview", "Portfolio", "Watchlist", "Settings"].map((tab) => (
              <button
                key={tab}
                style={{
                  padding: "8px 16px",
                  background: palette.amber,
                  color: palette.bg,
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = palette.amberDim;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = palette.amber;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div
          style={{
            background: `${palette.panel}99`,
            border: `1px solid ${palette.hairline}`,
            padding: "24px",
            borderRadius: "4px",
            marginBottom: "40px",
          }}
        >
          <div style={{ fontFamily: "var(--font-header)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>
            Welcome, {session.user?.name || session.user?.email || "Trader"}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paperDim, marginBottom: "24px" }}>
            Email: {session.user?.email}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "10px 24px",
              background: palette.red,
              color: palette.bg,
              border: "none",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderRadius: "2px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            Sign Out
          </button>
        </div>

        {/* My War Rooms Section */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: palette.amber,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "20px",
            }}
          >
            PREMIUM RESEARCH
          </div>
          <Link
            href="/my-war-rooms"
            style={{
              display: "block",
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              padding: "24px",
              borderRadius: "4px",
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.amber;
              (e.currentTarget as HTMLElement).style.background =
                palette.panel;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.hairline;
              (e.currentTarget as HTMLElement).style.background =
                `${palette.panel}99`;
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.amberDim,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              MY WAR ROOMS
            </div>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: palette.amber,
              }}
            >
              Build personalized investment theses
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: palette.paperDim,
                marginTop: "8px",
              }}
            >
              Create private War Rooms for premium assets with your research,
              thesis, and watchlists.
            </div>
          </Link>
        </div>

        {/* Placeholder Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {[
            { title: "Watchlist Items", count: 12 },
            { title: "Alerts Active", count: 5 },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "24px",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.amberDim, marginBottom: "12px" }}>
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: item.value && item.value.includes("+") ? palette.green : palette.amber,
                }}
              >
                {(item as any).count}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: palette.amber,
              textDecoration: "none",
              borderBottom: `1px solid ${palette.amber}44`,
              transition: "all 0.2s",
              padding: "8px 0",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor = `${palette.amber}44`;
            }}
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
