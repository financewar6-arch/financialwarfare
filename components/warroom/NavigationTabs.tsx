"use client";

import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { palette } from "@/lib/warroom/palette";

interface NavigationTabsProps {
  currentSlug: string;
  currentCategory?: string;
}

export function NavigationTabs({ currentSlug, currentCategory }: NavigationTabsProps) {
  // Get current asset info
  const currentAsset = Object.values(ASSETS).find((a) => a.slug === currentSlug);

  // Get assets in the same category
  const categoryAssets = Object.values(ASSETS)
    .filter((a) => a.category === currentCategory && a.slug !== currentSlug)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Get category groups
  const categoryGroups = Object.values(ASSETS).reduce(
    (acc, asset) => {
      const cat = asset.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(asset);
      return acc;
    },
    {} as Record<string, (typeof ASSETS)[keyof typeof ASSETS][]>
  );

  const sortedCategories = Object.keys(categoryGroups)
    .filter((cat) => cat !== currentCategory)
    .sort();

  return (
    <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: `1px solid ${palette.hairline}` }}>
      {/* Related Assets Tabs */}
      {categoryAssets.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: palette.amber,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            {currentCategory} Assets
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categoryAssets.slice(0, 8).map((asset) => (
              <Link
                key={asset.slug}
                href={`/war-room/${asset.slug}`}
                style={{
                  padding: "6px 12px",
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "3px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: palette.paperDim,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
                  (e.currentTarget as HTMLElement).style.color = palette.amber;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
                  (e.currentTarget as HTMLElement).style.color = palette.paperDim;
                }}
              >
                {asset.symbol}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category Navigation */}
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: palette.amber,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
          }}
        >
          Browse Categories
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {sortedCategories.map((category) => {
            const categoryCount = categoryGroups[category]?.length || 0;
            const displayName = category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <Link
                key={category}
                href={`/war-room?category=${encodeURIComponent(category)}`}
                style={{
                  padding: "6px 12px",
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "3px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: palette.paperDim,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
                  (e.currentTarget as HTMLElement).style.color = palette.amber;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
                  (e.currentTarget as HTMLElement).style.color = palette.paperDim;
                }}
              >
                {displayName} ({categoryCount})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${palette.hairline}` }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: palette.amber,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
          }}
        >
          Quick Links
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <Link
            href="/"
            style={{
              padding: "6px 12px",
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "3px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: palette.paperDim,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLElement).style.color = palette.paperDim;
            }}
          >
            Homepage
          </Link>
          <Link
            href="/war-room"
            style={{
              padding: "6px 12px",
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "3px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: palette.paperDim,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLElement).style.color = palette.paperDim;
            }}
          >
            All War Rooms
          </Link>
          <Link
            href="/frontline"
            style={{
              padding: "6px 12px",
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "3px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: palette.paperDim,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLElement).style.color = palette.paperDim;
            }}
          >
            Front Line
          </Link>
          <Link
            href="/discovery"
            style={{
              padding: "6px 12px",
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "3px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: palette.paperDim,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
              (e.currentTarget as HTMLElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
              (e.currentTarget as HTMLElement).style.color = palette.paperDim;
            }}
          >
            Market Discovery
          </Link>
        </div>
      </div>
    </div>
  );
}
