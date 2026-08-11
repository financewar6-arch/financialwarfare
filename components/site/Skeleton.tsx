"use client";

import { useTheme } from "@/lib/theme-context";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = "20px", circle = false, className, style }: SkeletonProps) {
  const { palette } = useTheme();

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: palette.grid,
        borderRadius: circle ? "50%" : "4px",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ...style,
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  const { palette } = useTheme();

  return (
    <div
      style={{
        background: palette.panel,
        border: `1px solid ${palette.hairline}`,
        borderRadius: "6px",
        padding: "16px",
      }}
    >
      <Skeleton width="60%" height="24px" style={{ marginBottom: "12px" }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "80%" : "100%"} height="16px" style={{ marginBottom: i < lines - 1 ? "8px" : "0" }} />
      ))}
    </div>
  );
}
