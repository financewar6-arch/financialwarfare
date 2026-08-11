"use client";

import { useTheme } from "@/lib/theme-context";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
}

export function Card({ children, style = {}, onClick, hoverable = true, className }: CardProps) {
  const { palette } = useTheme();

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: palette.panel,
        border: `1px solid ${palette.hairline}`,
        borderRadius: "6px",
        padding: "16px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        ...(hoverable && {
          cursor: "pointer",
          "&:hover": {
            borderColor: palette.amber,
            boxShadow: `0 4px 12px ${palette.amber}22`,
          },
        }),
        ...style,
      }}
      onMouseEnter={
        hoverable
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${palette.amber}22`;
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
