"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { palette } = useTheme();

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "20px" }}>
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          listStyle: "none",
          padding: 0,
          margin: 0,
          flexWrap: "wrap",
        }}
      >
        {items.map((item, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {item.href ? (
              <Link
                href={item.href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: palette.amber,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: palette.paperDim,
                }}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span style={{ color: palette.paperDim, fontSize: "0.8rem" }}>/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
