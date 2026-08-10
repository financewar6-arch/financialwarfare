"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import type { LuxuryAsset, LuxuryCategory } from "@/lib/models/luxury-asset";
import { LUXURY_CATEGORIES } from "@/lib/models/luxury-asset";
import { SUPPORTED_CURRENCIES, CURRENCY_SYMBOLS, convertCurrency, formatPrice } from "@/lib/utils/currency-converter";

export default function LuxuryAssetPage() {
  const { palette } = useTheme();
  const params = useParams();
  const category = (params?.category as LuxuryCategory) || "";
  const slug = (params?.slug as string) || "";
  const [asset, setAsset] = useState<LuxuryAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<string>("GBP");

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/luxury/assets?category=${category}`);
        const data = await res.json();
        const found = (data.assets || []).find((a: LuxuryAsset) => a.slug === slug);
        setAsset(found || null);
      } catch (error) {
        console.error("Failed to fetch asset:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [category, slug]);

  if (loading) {
    return (
      <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "60px 20px", textAlign: "center" }}>
        Loading asset...
      </div>
    );
  }

  if (!asset) {
    return (
      <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Asset Not Found</h1>
        <p style={{ color: palette.paperDim, marginBottom: "32px" }}>This asset hasn't made a significant move recently, or isn't in our coverage universe.</p>
        <Link href={`/luxury/${category}`} style={{ color: palette.blue, textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to {LUXURY_CATEGORIES[category]}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Hero Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", borderBottom: `1px solid ${palette.hairline}` }}>
        {asset.heroImage && (
          <img src={asset.heroImage} alt={asset.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(to bottom, transparent 0%, ${palette.bg}cc 100%)` }} />
      </div>

      {/* Header Section */}
      <div style={{ background: palette.bg, borderBottom: `1px solid ${palette.hairline}`, padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Link href={`/luxury/${category}`} style={{ color: palette.blue, textDecoration: "none", fontSize: "0.9rem", marginBottom: "16px", display: "inline-block" }}>
            ← Back to {LUXURY_CATEGORIES[category]}
          </Link>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", marginTop: "24px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: palette.amber, fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>
                {LUXURY_CATEGORIES[category]}
              </div>
              <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2.5rem", fontWeight: 700, marginBottom: "16px" }}>
                {asset.name}
              </h1>
              {asset.brand && (
                <div style={{ fontSize: "1.1rem", color: palette.paperDim, marginBottom: "8px" }}>
                  {asset.brand}{asset.model && ` – ${asset.model}`}
                </div>
              )}
              {asset.year && (
                <div style={{ fontSize: "0.95rem", color: palette.paperDim }}>
                  {asset.year}
                </div>
              )}
            </div>

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
              }}
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {CURRENCY_SYMBOLS[curr]} {curr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Market Data Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "60px" }}>
          {asset.currentMarketValue && (
            <div style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, padding: "24px", borderRadius: "8px" }}>
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase" }}>
                Market Value
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: palette.amber, fontFamily: "var(--font-header)" }}>
                {formatPrice(convertCurrency(asset.currentMarketValue, currency), currency)}
              </div>
            </div>
          )}

          {asset.marketTrend && (
            <div style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, padding: "24px", borderRadius: "8px" }}>
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase" }}>
                Market Trend
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: asset.marketTrend === "rising" ? palette.green : asset.marketTrend === "falling" ? palette.red : palette.amber }}>
                {asset.marketTrend === "rising" && "↑ Rising"}
                {asset.marketTrend === "stable" && "→ Stable"}
                {asset.marketTrend === "falling" && "↓ Falling"}
              </div>
            </div>
          )}

          {asset.marketActivity && (
            <div style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, padding: "24px", borderRadius: "8px" }}>
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase" }}>
                Market Activity
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: palette.blue, textTransform: "capitalize" }}>
                {asset.marketActivity} Activity
              </div>
            </div>
          )}
        </div>

        {asset.description && (
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "16px", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              About This Asset
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: palette.paperDim }}>
              {asset.description}
            </p>
          </div>
        )}

        {asset.specifications && Object.keys(asset.specifications).length > 0 && (
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "24px", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Specifications
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {Object.entries(asset.specifications).map(([key, value]) => (
                <div key={key} style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, padding: "16px", borderRadius: "6px" }}>
                  <div style={{ color: palette.paperDim, fontSize: "0.8rem", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase" }}>
                    {key}
                  </div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {asset.source && (
          <div style={{ padding: "16px", background: palette.panel, borderRadius: "6px", fontSize: "0.85rem", color: palette.paperDim, borderLeft: `3px solid ${palette.amber}` }}>
            <strong>Data Source:</strong> {asset.source}
            {asset.sourceUrl && (
              <>
                {" "}
                <a href={asset.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: palette.blue, textDecoration: "underline" }}>
                  View Source
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
