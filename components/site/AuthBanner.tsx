"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

interface AuthBannerProps {
  isAuthenticated?: boolean;
}

export function AuthBanner({ isAuthenticated = false }: AuthBannerProps) {
  const { palette } = useTheme();
  const [showBanner, setShowBanner] = useState(!isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !showBanner || isAuthenticated) {
    return null;
  }

  const handleClose = () => {
    setShowBanner(false);
  };

  return (
    <div
      style={{
        backgroundColor: palette.panel,
        borderBottom: `1px solid ${palette.hairline}`,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: palette.paper,
            marginBottom: "4px",
            fontFamily: "var(--font-body)",
          }}
        >
          Track your markets. Understand what's moving.
        </div>
        <div
          style={{
            fontSize: "13px",
            color: palette.paperDim,
            fontFamily: "var(--font-body)",
          }}
        >
          Get real-time intelligence on the assets you care about.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexShrink: 0,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <Link
          href="/signup"
          style={{
            padding: "8px 16px",
            backgroundColor: palette.amber,
            color: "#000",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = "1";
          }}
        >
          Sign Up
        </Link>

        <Link
          href="/signin"
          style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            color: palette.paper,
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
            border: `1px solid ${palette.hairline}`,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.borderColor = palette.amber;
            (e.target as HTMLElement).style.color = palette.amber;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.borderColor = palette.hairline;
            (e.target as HTMLElement).style.color = palette.paper;
          }}
        >
          Sign In
        </Link>

        <button
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            color: palette.paperDim,
            cursor: "pointer",
            padding: "4px 8px",
            fontSize: "18px",
            fontWeight: 300,
            lineHeight: 1,
            fontFamily: "var(--font-body)",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = palette.paper;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = palette.paperDim;
          }}
          title="Close"
        >
          ×
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="display: flex"] {
            flex-direction: column !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
