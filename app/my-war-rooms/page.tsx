"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { PREMIUM_CONFIG } from "@/lib/premium-config";

interface WarRoom {
  id: string;
  assetName: string;
  assetSymbol: string;
  thesis: { content: string };
  status: "active" | "archived";
  createdAt: number;
  updatedAt: number;
}

export default function MyWarRoomsPage() {
  const { palette } = useTheme();
  const [warRooms, setWarRooms] = useState<WarRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState("demo-user"); // TODO: Get from auth

  useEffect(() => {
    // Fetch user's war rooms
    const fetchWarRooms = async () => {
      try {
        const res = await fetch(`/api/my-war-rooms?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setWarRooms(data.warRooms);
        }
      } catch (error) {
        console.error("Failed to fetch war rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarRooms();
  }, [userId]);

  if (!PREMIUM_CONFIG.enabled) {
    return (
      <div
        style={{
          background: palette.bg,
          color: palette.paper,
          minHeight: "100vh",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "16px" }}>
            MY WAR ROOM
          </h1>
          <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
            This premium feature is not currently available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.paper,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px 40px" }}>
        <h1
          style={{
            fontFamily: "var(--font-header)",
            fontSize: "2rem",
            marginBottom: "8px",
          }}
        >
          MY WAR ROOMS
        </h1>
        <p style={{ color: palette.paperDim, fontSize: "1.05rem" }}>
          Your personalised market intelligence.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 60px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: palette.paperDim }}>
            Loading...
          </div>
        ) : warRooms.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "8px",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                marginBottom: "12px",
                color: palette.amber,
              }}
            >
              CREATE YOUR FIRST WAR ROOM
            </h2>
            <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
              Choose an asset and build your personal intelligence workspace.
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
        ) : (
          <div>
            {/* War Room Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
                marginBottom: "40px",
              }}
            >
              {warRooms
                .filter((wr) => wr.status === "active")
                .map((warRoom) => (
                  <Link
                    key={warRoom.id}
                    href={`/my-war-rooms/${warRoom.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        padding: "24px",
                        background: `${palette.panel}99`,
                        border: `1px solid ${palette.hairline}`,
                        borderRadius: "8px",
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
                          `${palette.panel}dd`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          palette.hairline;
                        (e.currentTarget as HTMLElement).style.background =
                          `${palette.panel}99`;
                      }}
                    >
                      {/* Asset Header */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 700,
                            color: palette.amber,
                          }}
                        >
                          {warRoom.assetSymbol}
                        </div>
                        <div style={{ color: palette.paperDim, fontSize: "0.9rem" }}>
                          {warRoom.assetName}
                        </div>
                      </div>

                      {/* Thesis Preview */}
                      <div style={{ marginBottom: "16px", flex: 1 }}>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: palette.paperDim,
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          My Thesis
                        </div>
                        <p
                          style={{
                            fontSize: "0.95rem",
                            color: palette.paper,
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          {warRoom.thesis.content.substring(0, 100)}
                          {warRoom.thesis.content.length > 100 ? "..." : ""}
                        </p>
                      </div>

                      {/* Meta */}
                      <div
                        style={{
                          borderTop: `1px solid ${palette.hairline}`,
                          paddingTop: "12px",
                          fontSize: "0.75rem",
                          color: palette.paperDim,
                        }}
                      >
                        Created{" "}
                        {new Date(warRoom.createdAt).toLocaleDateString()}
                      </div>

                      {/* CTA */}
                      <div
                        style={{
                          marginTop: "12px",
                          color: palette.blue,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        OPEN WAR ROOM →
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Create New Button */}
            <div style={{ textAlign: "center" }}>
              <Link
                href="/my-war-rooms/create"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: `${palette.panel}99`,
                  border: `2px solid ${palette.amber}`,
                  color: palette.amber,
                  textDecoration: "none",
                  borderRadius: "4px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    palette.amber;
                  (e.currentTarget as HTMLElement).style.color = palette.bg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    `${palette.panel}99`;
                  (e.currentTarget as HTMLElement).style.color = palette.amber;
                }}
              >
                + CREATE NEW WAR ROOM
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
