"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import type { LuxuryAsset, LuxuryCategory } from "@/lib/models/luxury-asset";
import { LUXURY_CATEGORIES } from "@/lib/models/luxury-asset";
import { SUPPORTED_CURRENCIES, CURRENCY_SYMBOLS, convertCurrency, formatPrice } from "@/lib/utils/currency-converter";

export default function LuxuryPage() {
  const { palette } = useTheme();
  const [assets, setAssets] = useState<LuxuryAsset[]>([]);
  const [featured, setFeatured] = useState<LuxuryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<string>("GBP");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/luxury/assets");
        const data = await res.json();
        setFeatured(data.featured || []);
      } catch (error) {
        console.error("Failed to fetch luxury data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = Object.entries(LUXURY_CATEGORIES) as [LuxuryCategory, string][];

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${palette.panel} 0%, ${palette.bg} 100%)`, padding: "80px 20px", textAlign: "center", borderBottom: `1px solid ${palette.hairline}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: palette.bg,
                color: palette.paper,
                border: `1px solid ${palette.hairline}`,
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSelectElement).style.borderColor = palette.amber;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSelectElement).style.borderColor = palette.hairline;
              }}
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {CURRENCY_SYMBOLS[curr]} {curr}
                </option>
              ))}
            </select>
          </div>
          <h1 style={{ fontFamily: "var(--font-header)", fontSize: "3.5rem", fontWeight: 700, marginBottom: "16px" }}>Luxury Market Intelligence</h1>
          <p style={{ fontSize: "1.2rem", color: palette.paperDim, lineHeight: 1.8 }}>Track watches, cars, diamonds and alternative assets with real-time market intelligence. Prices in your preferred currency.</p>
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", borderBottom: `1px solid ${palette.hairline}` }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {categories.map(([key, label]) => (
            <Link key={key} href={`/luxury/${key}`} style={{ padding: "8px 16px", borderRadius: "4px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, background: palette.panel, color: palette.paper, border: `1px solid ${palette.hairline}`, transition: "all 0.2s" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: palette.paperDim }}>Loading...</div>
        ) : featured.length > 0 ? (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "32px", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Featured Assets to Watch</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {featured.map((asset) => (
                <Link key={asset.id} href={`/luxury/${asset.category}/${asset.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}>
                    {asset.heroImage && <img src={asset.heroImage} alt={asset.name} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />}
                    <div style={{ padding: "20px" }}>
                      <div style={{ color: palette.amber, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>{LUXURY_CATEGORIES[asset.category]}</div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px", lineHeight: 1.3 }}>{asset.name}</h3>
                      {asset.currentMarketValue && (
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: palette.amber, fontFamily: "var(--font-header)" }}>
                          {formatPrice(convertCurrency(asset.currentMarketValue, currency), currency)}
                        </div>
                      )}
                      {asset.marketTrend && (
                        <div style={{ fontSize: "0.85rem", color: palette.paperDim, marginTop: "8px" }}>
                          {asset.marketTrend === "rising" && "↑ Rising"}
                          {asset.marketTrend === "stable" && "→ Stable"}
                          {asset.marketTrend === "falling" && "↓ Falling"}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: palette.paperDim }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "16px" }}>🔍 Luxury Market Platform Ready for Real Data</p>
            <p>Mock data available for development. Real data providers integrating.</p>
          </div>
        )}
      </div>
    </div>
  );
}
