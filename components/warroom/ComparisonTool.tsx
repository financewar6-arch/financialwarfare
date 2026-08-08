"use client";

import { useState } from "react";
import { palette } from "@/lib/warroom/palette";
import { ASSETS } from "@/lib/assets";
import { useAssetFeed } from "./useAssetFeed";
import { ComparisonAssetCard } from "./ComparisonAssetCard";
import { ComparisonChart } from "./ComparisonChart";

interface AssetData {
  slug: string;
  symbol: string;
  color: string;
  history: Array<{ t: number; p: number }>;
}

export function ComparisonTool() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const availableAssets = Object.values(ASSETS);

  const handleSelectAsset = (slug: string) => {
    if (selectedAssets.includes(slug)) {
      setSelectedAssets(selectedAssets.filter((s) => s !== slug));
    } else if (selectedAssets.length < 3) {
      setSelectedAssets([...selectedAssets, slug]);
    }
  };

  // Collect asset data from feeds
  const feeds = {
    [selectedAssets[0]]: useAssetFeed(selectedAssets[0] || "", "7"),
    [selectedAssets[1]]: useAssetFeed(selectedAssets[1] || "", "7"),
    [selectedAssets[2]]: useAssetFeed(selectedAssets[2] || "", "7"),
  };

  const chartAssets_computed = selectedAssets
    .map((slug) => {
      const feed = feeds[slug];
      if (!feed?.data?.history || feed.data.history.length === 0) return null;

      const asset = ASSETS[slug as keyof typeof ASSETS];
      const isUp = (feed.data?.change24h ?? 0) >= 0;

      return {
        slug,
        symbol: asset.symbol,
        color: isUp ? "#5FA06B" : "#C1503A",
        history: feed.data.history,
      };
    })
    .filter((a) => a !== null) as AssetData[];

  return (
    <div style={{ padding: "24px", background: palette.panel, border: `1px solid ${palette.hairline}` }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.2rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "8px" }}>
          ASSET COMPARISON
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim }}>
          Compare up to 3 assets on normalized 0-100 scale
        </div>
      </div>

      {/* Selected Assets Display */}
      <div style={{ marginBottom: "16px" }}>
        {selectedAssets.length === 0 ? (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim, padding: "12px", background: `${palette.bg}66`, borderRadius: "2px" }}>
            No assets selected. Click below to compare.
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {selectedAssets.map((slug) => (
              <ComparisonAssetCard key={slug} slug={slug} onRemove={handleSelectAsset} />
            ))}
          </div>
        )}
      </div>

      {/* Asset Selector */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowSelector(!showSelector)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: palette.bg,
            border: `1px solid ${showSelector ? palette.amber : palette.hairline}`,
            color: showSelector ? palette.amber : palette.paper,
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!showSelector) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = palette.amber;
            }
          }}
          onMouseLeave={(e) => {
            if (!showSelector) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = palette.hairline;
            }
          }}
        >
          {showSelector ? "▼ CLOSE SELECTOR" : "▶ SELECT ASSETS"}
        </button>

        {showSelector && (
          <div style={{ marginTop: "12px", maxHeight: "300px", overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
            {availableAssets.map((asset) => (
              <button
                key={asset.slug}
                onClick={() => handleSelectAsset(asset.slug)}
                disabled={!selectedAssets.includes(asset.slug) && selectedAssets.length >= 3}
                style={{
                  padding: "10px 8px",
                  background: selectedAssets.includes(asset.slug) ? `${palette.amber}33` : palette.bg,
                  border: `1px solid ${selectedAssets.includes(asset.slug) ? palette.amber : palette.hairline}`,
                  color: selectedAssets.includes(asset.slug) ? palette.amber : palette.paper,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  cursor: selectedAssets.includes(asset.slug) || selectedAssets.length < 3 ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  opacity: selectedAssets.includes(asset.slug) || selectedAssets.length < 3 ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (selectedAssets.includes(asset.slug) || selectedAssets.length < 3) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = palette.amber;
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = selectedAssets.includes(asset.slug)
                    ? palette.amber
                    : palette.hairline;
                }}
              >
                {asset.symbol}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Chart */}
      {selectedAssets.length > 0 && <ComparisonChart assets={chartAssets_computed} />}
    </div>
  );
}
