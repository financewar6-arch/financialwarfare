"use client";

import { useTheme } from "@/lib/theme-context";

type BadgeVariant = "live" | "updated" | "premium" | "new" | "bullish" | "bearish" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const { palette } = useTheme();

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
    live: { bg: `${palette.red}22`, text: palette.red, border: palette.red },
    updated: { bg: `${palette.green}22`, text: palette.green, border: palette.green },
    premium: { bg: `${palette.amber}22`, text: palette.amber, border: palette.amber },
    new: { bg: `${palette.amber}22`, text: palette.amber, border: palette.amber },
    bullish: { bg: `${palette.green}22`, text: palette.green },
    bearish: { bg: `${palette.red}22`, text: palette.red },
    default: { bg: `${palette.amber}11`, text: palette.amberDim },
  };

  const style = variantStyles[variant];
  const sizes = {
    sm: { fontSize: "0.7rem", padding: "4px 8px" },
    md: { fontSize: "0.8rem", padding: "6px 12px" },
  };

  return (
    <div
      style={{
        display: "inline-block",
        ...sizes[size],
        backgroundColor: style.bg,
        color: style.text,
        borderRadius: "3px",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        ...(style.border && {
          border: `1px solid ${style.border}33`,
        }),
      }}
    >
      {children}
    </div>
  );
}
