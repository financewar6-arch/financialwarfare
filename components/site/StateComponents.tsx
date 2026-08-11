"use client";

import { useTheme } from "@/lib/theme-context";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export function EmptyState({ icon = "○", title, message }: EmptyStateProps) {
  const { palette } = useTheme();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        color: palette.paperDim,
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{icon}</div>
      <h3
        style={{
          fontFamily: "var(--font-header)",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: palette.paper,
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({ title = "Error", message, retry }: ErrorStateProps) {
  const { palette } = useTheme();

  return (
    <div
      style={{
        background: `${palette.red}11`,
        border: `1px solid ${palette.red}33`,
        borderRadius: "6px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", color: palette.red, marginBottom: "12px" }}>⚠</div>
      <h3
        style={{
          fontFamily: "var(--font-header)",
          fontSize: "1rem",
          fontWeight: 600,
          color: palette.red,
          marginBottom: "8px",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          color: palette.paperDim,
          marginBottom: "16px",
          margin: "0 0 16px 0",
        }}
      >
        {message}
      </p>
      {retry && (
        <button
          onClick={retry}
          style={{
            padding: "8px 16px",
            backgroundColor: palette.red,
            color: palette.bg,
            border: "none",
            borderRadius: "4px",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = "1";
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

interface UnavailableStateProps {
  dataType?: string;
  reason?: string;
}

export function UnavailableState({ dataType = "Data", reason = "temporarily unavailable" }: UnavailableStateProps) {
  const { palette } = useTheme();

  return (
    <div
      style={{
        background: palette.panel,
        border: `1px solid ${palette.hairline}`,
        borderRadius: "6px",
        padding: "16px",
        textAlign: "center",
        color: palette.paperDim,
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
        {dataType} {reason}.
      </div>
    </div>
  );
}
