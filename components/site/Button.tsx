"use client";

import { useTheme } from "@/lib/theme-context";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  href?: string;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  href,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const { palette } = useTheme();

  const sizes = {
    sm: { padding: "6px 12px", fontSize: "0.75rem" },
    md: { padding: "10px 20px", fontSize: "0.85rem" },
    lg: { padding: "12px 28px", fontSize: "0.9rem" },
  };

  const baseStyles = {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    border: "none",
    borderRadius: "4px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    display: fullWidth ? "block" : "inline-block",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled || loading ? 0.6 : 1,
    ...sizes[size],
  };

  const variantStyles = {
    primary: {
      backgroundColor: palette.amber,
      color: palette.bg,
      "&:hover": !disabled && !loading ? { opacity: 0.9 } : undefined,
    },
    secondary: {
      backgroundColor: "transparent",
      color: palette.paper,
      border: `1px solid ${palette.hairline}`,
      "&:hover": !disabled && !loading ? { borderColor: palette.amber, color: palette.amber } : undefined,
    },
    text: {
      backgroundColor: "transparent",
      color: palette.amber,
      "&:hover": !disabled && !loading ? { opacity: 0.8 } : undefined,
    },
  };

  const style = {
    ...baseStyles,
    ...variantStyles[variant],
  };

  const buttonContent = loading ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          border: `2px solid ${variantStyles[variant].color}`,
          borderRight: "2px solid transparent",
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite",
        }}
      />
      {children}
    </span>
  ) : (
    children
  );

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      (e.currentTarget as HTMLElement).style.opacity =
        variant === "primary" ? "0.9" : variant === "secondary" ? "1" : "0.8";
      if (variant === "secondary") {
        (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
        (e.currentTarget as HTMLElement).style.color = palette.amber;
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    if (variant === "secondary") {
      (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
      (e.currentTarget as HTMLElement).style.color = palette.paper;
    }
  };

  if (href) {
    return (
      <a
        href={href}
        style={{
          ...style,
          textDecoration: "none",
          display: fullWidth ? "block" : "inline-block",
        } as React.CSSProperties}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={style as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {buttonContent}
    </button>
  );
}
