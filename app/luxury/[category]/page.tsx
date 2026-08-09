"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import type { LuxuryAsset, LuxuryCategory } from "@/lib/models/luxury-asset";
import { LUXURY_CATEGORIES } from "@/lib/models/luxury-asset";

export default function CategoryPage() {
  const { palette } = useTheme();
  const params = useParams();
  const category = params.category as LuxuryCategory;
  const [assets, setAssets] = useState<LuxuryAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/luxury/assets?category=${category}`);
        const data = await res.json();
        setAssets(data.assets || []);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${palette.panel} 0%, ${palette.bg} 100%)`, padding: "60px 20px", borderBottom: `1px solid ${palette.hairline}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Link href="/luxury" style={{ color: palette.blue, textDecoration: "none", fontSize: "0.9rem", marginBottom: "16px", display: "inline-block" }}>← Back to Luxury</Link>
          <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2.5rem", fontWeight: 700 }}>{LUXURY_CATEGORIES[category]} Market Intelligence</h1>
        </div>
      </div>

      {/* Assets Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: palette.paperDim }}>Loading assets...</div>
        ) : assets.length === 0 ? (
          <div style={{ textAlign: "center", color: palette.paperDim }}>No assets in this category yet</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {assets.map((asset) => (
              <Link key={asset.id} href={`/luxury/${category}/${asset.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}>
                  {asset.heroImage && <img src={asset.heroImage} alt={asset.name} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />}
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px" }}>{asset.name}</h3>
                    {asset.currentMarketValue && <div style={{ fontSize: "1.3rem", fontWeight: 700, color: palette.amber }}>${asset.currentMarketValue.toLocaleString()}</div>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
