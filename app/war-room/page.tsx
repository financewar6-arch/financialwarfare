"use client";

import { WarRoomCard } from "@/components/site/WarRoomCard";
import { PageShell } from "@/components/site/PageShell";
import { ComparisonTool } from "@/components/warroom/ComparisonTool";
import { ASSETS } from "@/lib/assets";
import { palette } from "@/lib/warroom/palette";
import { useState } from "react";

const CATEGORIES = ["Crypto", "Stocks", "Precious Metals"] as const;

export default function WarRoomIndex() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const grouped = CATEGORIES.map((category) => ({
    category,
    assets: Object.values(ASSETS).filter((a) => a.category === category),
  })).filter((g) => g.assets.length > 0);

  return (
    <PageShell>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em" }}>
          WAR ROOMS
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim, marginTop: "4px" }}>
          Browse live market intelligence by asset class
        </div>
      </div>

      {/* Category Quick Links */}
      <div style={{ marginBottom: "32px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {grouped.map((group) => (
          <a
            key={`link-${group.category}`}
            href={`#${group.category.toLowerCase()}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: palette.amber,
              textDecoration: "none",
              padding: "8px 12px",
              border: `1px solid ${hoveredCategory === group.category ? palette.amber : palette.amber + "44"}`,
              background: hoveredCategory === group.category ? `${palette.panel}99` : "transparent",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredCategory(group.category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            ▸ {group.category.toUpperCase()}
          </a>
        ))}
      </div>

      {grouped.map((group) => (
        <div key={group.category} style={{ marginBottom: "32px" }} id={group.category.toLowerCase()}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
            ▸ {group.category}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
            {group.assets.slice(0, 6).map((asset) => (
              <WarRoomCard key={asset.slug} slug={asset.slug} name={asset.name} symbol={asset.symbol} />
            ))}
          </div>
        </div>
      ))}

      {/* Comparison Tool */}
      <div style={{ marginTop: "40px" }}>
        <ComparisonTool />
      </div>
    </PageShell>
  );
}
