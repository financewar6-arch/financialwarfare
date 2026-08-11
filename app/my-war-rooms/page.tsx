"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

interface WarRoom {
  id: string;
  assetSlug: string;
  assetName: string;
  assetSymbol: string;
  status: string;
  isPremium: boolean;
  createdAt: string;
  lastViewedAt: string;
}

export default function MyWarRoomsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { palette } = useTheme();
  const [warRooms, setWarRooms] = useState<WarRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchWarRooms();
    }
  }, [status]);

  const fetchWarRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/my-war-rooms");

      if (res.status === 403) {
        setError(
          "Premium feature not available. Contact us to unlock My War Rooms."
        );
        setWarRooms([]);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch war rooms");
      }

      const data = await res.json();
      setWarRooms(data);
      setError("");
    } catch (err) {
      setError("Error loading war rooms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div
        style={{
          background: palette.bg,
          color: palette.paper,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.paper,
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "40px",
            borderBottom: `2px solid ${palette.amber}`,
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: palette.amber,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            MY WAR ROOMS
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: palette.paperDim,
              marginBottom: "20px",
            }}
          >
            Personalized research & thesis management for premium assets
          </div>

          <Link
            href="/my-war-rooms/create"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background: palette.amber,
              color: palette.bg,
              border: "none",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderRadius: "2px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            + NEW WAR ROOM
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: `${palette.red}22`,
              border: `1px solid ${palette.red}`,
              padding: "16px",
              marginBottom: "24px",
              borderRadius: "4px",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: palette.red,
            }}
          >
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              fontFamily: "var(--font-mono)",
              color: palette.paperDim,
            }}
          >
            Loading your war rooms...
          </div>
        )}

        {/* War Rooms Grid */}
        {!loading && warRooms.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {warRooms.map((room) => (
              <Link
                key={room.id}
                href={`/my-war-rooms/${room.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    background: `${palette.panel}99`,
                    border: `1px solid ${palette.hairline}`,
                    padding: "24px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                      fontSize: "0.7rem",
                      color: palette.amberDim,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}
                  >
                    {room.assetSlug.toUpperCase()}
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-header)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: palette.amber,
                      marginBottom: "4px",
                    }}
                  >
                    {room.assetName}
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      color: palette.paperDim,
                      marginBottom: "16px",
                      flex: 1,
                    }}
                  >
                    {room.assetSymbol}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      fontSize: "0.75rem",
                      color: palette.amberDim,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <span
                      style={{
                        background:
                          room.status === "active"
                            ? `${palette.green}22`
                            : `${palette.gray}22`,
                        padding: "4px 8px",
                        borderRadius: "2px",
                        border:
                          room.status === "active"
                            ? `1px solid ${palette.green}`
                            : `1px solid ${palette.gray}`,
                        color:
                          room.status === "active"
                            ? palette.green
                            : palette.gray,
                      }}
                    >
                      {room.status.toUpperCase()}
                    </span>
                    {room.isPremium && (
                      <span
                        style={{
                          background: `${palette.amber}22`,
                          padding: "4px 8px",
                          borderRadius: "2px",
                          border: `1px solid ${palette.amber}`,
                          color: palette.amber,
                        }}
                      >
                        PREMIUM
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && warRooms.length === 0 && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: `${palette.panel}44`,
              border: `1px dashed ${palette.hairline}`,
              borderRadius: "4px",
              fontFamily: "var(--font-body)",
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                color: palette.paperDim,
                marginBottom: "16px",
              }}
            >
              No war rooms yet. Create your first one to start building a
              personalized research layer.
            </div>
            <Link
              href="/my-war-rooms/create"
              style={{
                display: "inline-block",
                padding: "10px 24px",
                background: palette.amber,
                color: palette.bg,
                border: "none",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              CREATE WAR ROOM
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            href="/dashboard"
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
              (e.currentTarget as HTMLElement).style.borderBottomColor =
                palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor =
                `${palette.amber}44`;
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
