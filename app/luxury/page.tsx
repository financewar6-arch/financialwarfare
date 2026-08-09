"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import type { LuxuryAsset, LuxuryCategory } from "@/lib/models/luxury-asset";
import { LUXURY_CATEGORIES } from "@/lib/models/luxury-asset";

export default function LuxuryPage() {
  const { palette } = useTheme();
  const [assets, setAssets] = useState<LuxuryAsset[]>([]);
  const [featured, setFeatured] = useState<LuxuryAsset[]>([]);
  const [loading, setLoading] = useState(true);

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
          <h1 style={{ fontFamily: "var(--font-header)", fontSize: "3.5rem", fontWeight: 700, marginBottom: "16px" }}>Luxury Market Intelligence</h1>
          <p style={{ fontSize: "1.2rem", color: palette.paperDim, lineHeight: 1.8 }}>Track watches, cars, diamonds and alternative assets with real-time market intelligence.</p>
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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        {loading ? <div style={{ color: palette.paperDim }}>Loading...</div> : <div><p style={{ color: palette.paperDim, fontSize: "1.1rem" }}>🔍 Luxury Market Platform Ready for Real Data</p><p style={{ color: palette.paperDim }}>Mock data available for development. Real data providers integrating.</p></div>}
      </div>
    </div>
  );
}
