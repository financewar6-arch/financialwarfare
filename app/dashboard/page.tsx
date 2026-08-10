"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme-context";

interface UserDashboard {
  userId: string;
  userName: string;
  warRoomCount: number;
  watchlistCount: number;
  lastActive: string;
}

export default function DashboardPage() {
  const { palette } = useTheme();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchDashboard = async () => {
      try {
        const userId = (session.user as any).id;
        const res = await fetch(`/api/user/dashboard?userId=${userId}`);
        const data = await res.json();

        setDashboard({
          userId,
          userName: session.user?.name || "Trader",
          warRoomCount: data.warRoomCount || 0,
          watchlistCount: data.watchlistCount || 5,
          lastActive: new Date().toLocaleTimeString(),
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        // Fallback to basic dashboard
        setDashboard({
          userId: (session.user as any).id,
          userName: session.user?.name || "Trader",
          warRoomCount: 0,
          watchlistCount: 5,
          lastActive: new Date().toLocaleTimeString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [session]);

  if (loading) {
    return (
      <div
        style={{
          background: palette.bg,
          color: palette.paper,
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        <div style={{ textAlign: "center", color: palette.paperDim }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "60px 20px 40px",
          borderBottom: `1px solid ${palette.hairline}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "2.4rem",
                fontWeight: 700,
                marginBottom: "8px",
                color: palette.paper,
              }}
            >
              Welcome back, {dashboard?.userName}
            </h1>
            <p style={{ color: palette.paperDim, fontSize: "1rem" }}>
              Last active: {dashboard?.lastActive}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: `1px solid ${palette.paperDim}`,
              color: palette.paperDim,
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.paperDim;
              (e.currentTarget as HTMLElement).style.color = palette.paperDim;
            }}
          >
            SIGN OUT
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: `${palette.panel}66`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.amber,
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Active War Rooms
            </div>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "2rem",
                fontWeight: 700,
                color: palette.amber,
              }}
            >
              {dashboard?.warRoomCount ?? 0}
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: `${palette.panel}66`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.blue,
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Watchlist Items
            </div>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "2rem",
                fontWeight: 700,
                color: palette.blue,
              }}
            >
              {dashboard?.watchlistCount ?? 0}
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: `${palette.panel}66`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.green,
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Portfolio Health
            </div>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "2rem",
                fontWeight: 700,
                color: palette.green,
              }}
            >
              98%
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "32px",
          }}
        >
          {/* War Rooms Section */}
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: palette.amber,
                  marginBottom: "8px",
                  borderBottom: `2px solid ${palette.amber}`,
                  paddingBottom: "8px",
                }}
              >
                MY WAR ROOMS
              </h2>
              <p style={{ color: palette.paperDim, fontSize: "0.9rem" }}>
                {dashboard?.warRoomCount === 0
                  ? "Create your first war room to get started"
                  : `${dashboard?.warRoomCount} active war room${(dashboard?.warRoomCount ?? 0) > 1 ? "s" : ""}`}
              </p>
            </div>

            {dashboard?.warRoomCount === 0 ? (
              <div
                style={{
                  padding: "32px 20px",
                  background: `${palette.panel}99`,
                  border: `1px dashed ${palette.hairline}`,
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: palette.paperDim, marginBottom: "16px" }}>
                  No war rooms yet
                </p>
                <Link
                  href="/my-war-rooms/create"
                  style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    background: palette.amber,
                    color: palette.bg,
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  CREATE WAR ROOM
                </Link>
              </div>
            ) : (
              <div
                style={{
                  padding: "16px",
                  background: `${palette.panel}66`,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                }}
              >
                <p style={{ color: palette.paperDim, marginBottom: "12px" }}>
                  War rooms coming soon...
                </p>
                <Link
                  href="/my-war-rooms"
                  style={{
                    color: palette.amber,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  View all →
                </Link>
              </div>
            )}
          </div>

          {/* Alerts Section */}
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: palette.blue,
                  marginBottom: "8px",
                  borderBottom: `2px solid ${palette.blue}`,
                  paddingBottom: "8px",
                }}
              >
                YOUR ALERTS
              </h2>
              <p style={{ color: palette.paperDim, fontSize: "0.9rem" }}>
                Price movements you're tracking
              </p>
            </div>

            <div
              style={{
                padding: "16px",
                background: `${palette.panel}66`,
                border: `1px solid ${palette.hairline}`,
                borderRadius: "4px",
              }}
            >
              <p style={{ color: palette.paperDim, marginBottom: "12px" }}>
                No active alerts
              </p>
              <p style={{ color: palette.paperDim, fontSize: "0.85rem" }}>
                Set price alerts from your war rooms
              </p>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: palette.green,
                  marginBottom: "8px",
                  borderBottom: `2px solid ${palette.green}`,
                  paddingBottom: "8px",
                }}
              >
                QUICK STATS
              </h2>
              <p style={{ color: palette.paperDim, fontSize: "0.9rem" }}>
                Portfolio snapshot
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  background: `${palette.panel}66`,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: palette.paperDim,
                    marginBottom: "8px",
                  }}
                >
                  TOTAL VALUE
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: palette.green,
                  }}
                >
                  $0
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: `${palette.panel}66`,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: palette.paperDim,
                    marginBottom: "8px",
                  }}
                >
                  TODAY P&L
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: palette.paperDim,
                  }}
                >
                  —
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            marginTop: "60px",
            padding: "40px",
            background: `linear-gradient(135deg, ${palette.amber}11 0%, transparent 100%)`,
            border: `1px solid ${palette.amber}33`,
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Ready to build your first war room?
          </h3>
          <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
            Choose an asset and build your personal market intelligence workspace.
          </p>
          <Link
            href="/my-war-rooms/create"
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
          >
            START BUILDING →
          </Link>
        </div>
      </div>
    </div>
  );
}
