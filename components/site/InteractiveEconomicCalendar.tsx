"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/lib/theme-context";
import { getUpcomingEvents } from "@/lib/economic-calendar";
import { filterCalendarForAssets, AssetCalendarRelevance } from "@/lib/calendar-filter";

interface InteractiveEconomicCalendarProps {
  defaultAssets?: string[];
}

const COMMON_ASSETS = [
  { slug: "spy", label: "SPY (S&P 500)", category: "index" },
  { slug: "qqq", label: "QQQ (Nasdaq)", category: "index" },
  { slug: "iwm", label: "IWM (Russell 2000)", category: "index" },
  { slug: "bitcoin", label: "Bitcoin", category: "crypto" },
  { slug: "ethereum", label: "Ethereum", category: "crypto" },
  { slug: "gold", label: "Gold", category: "commodity" },
  { slug: "nvda", label: "NVIDIA", category: "stock" },
  { slug: "msft", label: "Microsoft", category: "stock" },
  { slug: "aapl", label: "Apple", category: "stock" },
];

export function InteractiveEconomicCalendar({
  defaultAssets = ["spy", "qqq", "bitcoin"],
}: InteractiveEconomicCalendarProps) {
  const { palette } = useTheme();
  const [selectedAssets, setSelectedAssets] = useState(defaultAssets);
  const [filterMode, setFilterMode] = useState<"all" | "relevant">("relevant");

  const relevantEvents = useMemo(() => {
    if (filterMode === "all") {
      return getUpcomingEvents(30).map((event) => ({
        event,
        relevanceScore: 0,
        impactedAssets: [],
        reasoning: "All events",
      }));
    }
    return filterCalendarForAssets(selectedAssets, 30);
  }, [selectedAssets, filterMode]);

  const toggleAsset = (slug: string) => {
    setSelectedAssets((prev) =>
      prev.includes(slug) ? prev.filter((a) => a !== slug) : [...prev, slug]
    );
  };

  const toggleAllAssets = () => {
    if (selectedAssets.length === COMMON_ASSETS.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(COMMON_ASSETS.map((a) => a.slug));
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return palette.red;
      case "medium":
        return palette.amber;
      default:
        return palette.green;
    }
  };

  return (
    <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: palette.panel }}>
      <h3 style={{ marginBottom: "16px", color: palette.paper }}>Economic Calendar</h3>

      {/* Filter Mode Toggle */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        <button
          onClick={() => setFilterMode("relevant")}
          style={{
            padding: "8px 12px",
            backgroundColor: filterMode === "relevant" ? palette.amber : "transparent",
            color: filterMode === "relevant" ? "#000" : palette.paper,
            border: `1px solid ${palette.hairline}`,
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          My Assets Only
        </button>
        <button
          onClick={() => setFilterMode("all")}
          style={{
            padding: "8px 12px",
            backgroundColor: filterMode === "all" ? palette.amber : "transparent",
            color: filterMode === "all" ? "#000" : palette.paper,
            border: `1px solid ${palette.hairline}`,
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          All Events
        </button>
      </div>

      {/* Asset Selection */}
      {filterMode === "relevant" && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontSize: "12px", color: palette.paperDim }}>Filter by assets:</label>
            <button
              onClick={toggleAllAssets}
              style={{
                fontSize: "11px",
                color: palette.amber,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {selectedAssets.length === COMMON_ASSETS.length ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "8px",
            }}
          >
            {COMMON_ASSETS.map((asset) => (
              <button
                key={asset.slug}
                onClick={() => toggleAsset(asset.slug)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: selectedAssets.includes(asset.slug) ? palette.amber : palette.bg,
                  color: selectedAssets.includes(asset.slug) ? "#000" : palette.paper,
                  border: `1px solid ${selectedAssets.includes(asset.slug) ? palette.amber : palette.hairline}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
              >
                {asset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Events List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
        {relevantEvents.length === 0 ? (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              color: palette.paperDim,
              fontSize: "12px",
            }}
          >
            {filterMode === "relevant" ? "No upcoming events for selected assets" : "No events available"}
          </div>
        ) : (
          relevantEvents.map((item) => (
            <div
              key={`${item.event.date.getTime()}-${item.event.event}`}
              style={{
                padding: "12px",
                borderLeft: `3px solid ${getImpactColor(item.event.impact)}`,
                backgroundColor: palette.bg,
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "8px" }}>
                <div>
                  <div style={{ fontWeight: 600, color: palette.paper, marginBottom: "4px" }}>
                    {item.event.event}
                  </div>
                  <div style={{ color: palette.paperDim, fontSize: "11px", marginBottom: "4px" }}>
                    {item.event.date.toLocaleDateString()} at {item.event.time} ET
                  </div>
                  {filterMode === "relevant" && item.impactedAssets.length > 0 && (
                    <div style={{ color: palette.amber, fontSize: "11px" }}>Affects: {item.impactedAssets.join(", ").toUpperCase()}</div>
                  )}
                </div>
                <div
                  style={{
                    padding: "4px 8px",
                    backgroundColor: getImpactColor(item.event.impact),
                    color: "#000",
                    borderRadius: "3px",
                    fontWeight: 600,
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.event.impact.toUpperCase()}
                </div>
              </div>
              <div style={{ color: palette.paperDim, fontSize: "11px", marginTop: "8px" }}>
                {item.event.description}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filterMode === "relevant" && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            backgroundColor: palette.bg,
            borderRadius: "4px",
            fontSize: "11px",
            color: palette.paperDim,
          }}
        >
          Showing {relevantEvents.length} events relevant to {selectedAssets.length} selected
          {selectedAssets.length === 1 ? " asset" : " assets"}
        </div>
      )}
    </div>
  );
}
