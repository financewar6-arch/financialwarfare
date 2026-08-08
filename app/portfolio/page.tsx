"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { palette } from "@/lib/warroom/palette";
import { ASSETS } from "@/lib/assets";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface PortfolioHolding {
  assetSlug: string;
  quantity: number;
  entryPrice: number;
}

const COLORS = [
  "#D99A3D",
  "#5FA06B",
  "#C1503A",
  "#8B6F47",
  "#6B8E23",
  "#CD853F",
  "#FF8C00",
  "#20B2AA",
  "#DA70D6",
  "#FFB6C1",
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [quantity, setQuantity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio");
    if (saved) {
      setHoldings(JSON.parse(saved));
    }
  }, []);

  const savePortfolio = (newHoldings: PortfolioHolding[]) => {
    setHoldings(newHoldings);
    localStorage.setItem("portfolio", JSON.stringify(newHoldings));
  };

  const addHolding = () => {
    if (!selectedAsset || !quantity || !entryPrice) return;
    const newHolding: PortfolioHolding = {
      assetSlug: selectedAsset,
      quantity: parseFloat(quantity),
      entryPrice: parseFloat(entryPrice),
    };
    const existing = holdings.findIndex((h) => h.assetSlug === selectedAsset);
    let updated;
    if (existing >= 0) {
      updated = [...holdings];
      updated[existing].quantity += newHolding.quantity;
    } else {
      updated = [...holdings, newHolding];
    }
    savePortfolio(updated);
    setSelectedAsset("");
    setQuantity("");
    setEntryPrice("");
  };

  const removeHolding = (slug: string) => {
    savePortfolio(holdings.filter((h) => h.assetSlug !== slug));
  };

  // Calculate pie chart data
  const chartData = holdings.map((holding) => {
    const asset = ASSETS[holding.assetSlug as keyof typeof ASSETS];
    const value = holding.quantity * holding.entryPrice;
    return {
      name: asset?.name || holding.assetSlug,
      value: parseFloat(value.toFixed(2)),
    };
  });

  const totalPortfolioValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontFamily: "var(--font-header)", fontWeight: 700, fontSize: "2rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "8px" }}>
            YOUR PORTFOLIO
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paperDim }}>
            Track your positions and visualize your allocation.
          </div>
        </div>

        {/* Portfolio Overview */}
        {holdings.length > 0 && (
          <div style={{ marginBottom: "32px", padding: "24px", background: `linear-gradient(135deg, ${palette.panel}dd, ${palette.panel}99)`, border: `1px solid ${palette.amber}44`, borderRadius: "2px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center" }}>
              {/* Pie Chart */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill={palette.amber}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{
                        background: palette.panel,
                        border: `1px solid ${palette.hairline}`,
                        color: palette.paper,
                        fontFamily: "var(--font-mono)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Portfolio Stats */}
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "4px" }}>
                    TOTAL PORTFOLIO VALUE
                  </div>
                  <div style={{ fontFamily: "var(--font-header)", fontSize: "2rem", fontWeight: 700, color: palette.paper }}>
                    ${totalPortfolioValue.toFixed(2)}
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "4px" }}>
                    POSITIONS
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: palette.paperDim }}>
                    {holdings.length} asset{holdings.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {chartData.map((item, idx) => (
                    <div key={idx} style={{ fontSize: "0.8rem", color: palette.paperDim, display: "flex", alignItems: "center", gap: "6px" }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          background: COLORS[idx % COLORS.length],
                          borderRadius: "2px",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: palette.paper }}>{item.name}</div>
                        <div style={{ fontSize: "0.7rem" }}>${item.value.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Holding */}
        <div style={{ padding: "24px", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}`, marginBottom: "32px" }}>
          <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.1rem", color: palette.amber, marginBottom: "16px" }}>
            ADD POSITION
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px" }}>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              style={{
                padding: "8px",
                background: palette.bg,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
              }}
            >
              <option value="">Select asset...</option>
              {Object.values(ASSETS).map((asset) => (
                <option key={asset.slug} value={asset.slug}>
                  {asset.name} ({asset.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                padding: "8px",
                background: palette.bg,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
              }}
            />
            <input
              type="number"
              placeholder="Entry price"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              step="0.01"
              style={{
                padding: "8px",
                background: palette.bg,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
              }}
            />
            <button
              onClick={addHolding}
              style={{
                padding: "8px 16px",
                background: palette.amber,
                color: palette.bg,
                border: "none",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              }}
            >
              ADD
            </button>
          </div>
        </div>

        {/* Holdings List */}
        <div>
          <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.1rem", color: palette.amber, marginBottom: "16px" }}>
            POSITIONS ({holdings.length})
          </div>
          {holdings.length === 0 ? (
            <div style={{ padding: "24px", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}`, textAlign: "center", color: palette.paperDim }}>
              No positions yet. Add your first holding above.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {holdings.map((holding, idx) => {
                const asset = ASSETS[holding.assetSlug as keyof typeof ASSETS];
                if (!asset) return null;
                const cost = holding.quantity * holding.entryPrice;
                const pct = totalPortfolioValue > 0 ? (cost / totalPortfolioValue) * 100 : 0;
                return (
                  <div
                    key={holding.assetSlug}
                    style={{
                      padding: "16px",
                      background: `${palette.panel}99`,
                      border: `1px solid ${palette.hairline}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Link href={`/war-room/${asset.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, color: palette.paper, marginBottom: "4px" }}>
                        {asset.name}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: palette.paperDim }}>
                        {holding.quantity} @ ${holding.entryPrice.toFixed(2)} = ${cost.toFixed(2)} ({pct.toFixed(1)}%)
                      </div>
                    </Link>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        background: COLORS[idx % COLORS.length],
                        marginRight: "12px",
                        borderRadius: "2px",
                      }}
                    />
                    <button
                      onClick={() => removeHolding(holding.assetSlug)}
                      style={{
                        padding: "6px 12px",
                        background: palette.red,
                        color: palette.bg,
                        border: "none",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
