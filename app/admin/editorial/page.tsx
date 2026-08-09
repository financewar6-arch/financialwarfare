"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";

interface EditorialForm {
  slug: string;
  photoLabel: string;
  whyItMoved: string;
  whyYouShouldCare: string;
  risk: string;
  watchNext: string;
}

const assetOptions = [
  { slug: "bitcoin", name: "Bitcoin" },
  { slug: "ethereum", name: "Ethereum" },
  { slug: "gold", name: "Gold" },
  { slug: "apple", name: "Apple" },
  { slug: "sp500", name: "S&P 500" },
  { slug: "nasdaq", name: "Nasdaq" },
];

export default function AdminEditorialPage() {
  const { palette } = useTheme();
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [formData, setFormData] = useState<EditorialForm>({
    slug: "bitcoin",
    photoLabel: "",
    whyItMoved: "",
    whyYouShouldCare: "",
    risk: "",
    watchNext: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adminToken, setAdminToken] = useState("");

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    setFormData({ ...formData, slug: asset });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!adminToken) {
      setMessage("❌ Admin token required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/update-editorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({ slug: selectedAsset, content: formData }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${selectedAsset} updated successfully!`);
        // Clear form
        setFormData({
          slug: selectedAsset,
          photoLabel: "",
          whyItMoved: "",
          whyYouShouldCare: "",
          risk: "",
          watchNext: "",
        });
      } else {
        setMessage(`❌ ${data.error || "Failed to update"}`);
      }
    } catch (error) {
      setMessage("❌ Error updating editorial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2rem", marginBottom: "8px" }}>
          📰 Update War Room Content
        </h1>
        <p style={{ color: palette.paperDim, marginBottom: "32px" }}>
          Update "Why It Moved" and other editorial content for any asset
        </p>

        <form onSubmit={handleSubmit}>
          {/* Admin Token */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Admin Token (set in Render env)
            </label>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Enter admin token"
              style={{
                width: "100%",
                padding: "10px",
                background: palette.panel,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          {/* Asset Selection */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontWeight: 500 }}>
              Select Asset
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
              {assetOptions.map((asset) => (
                <button
                  key={asset.slug}
                  type="button"
                  onClick={() => handleAssetChange(asset.slug)}
                  style={{
                    padding: "10px",
                    background:
                      selectedAsset === asset.slug ? palette.amber : palette.panel,
                    color:
                      selectedAsset === asset.slug ? palette.bg : palette.paper,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: selectedAsset === asset.slug ? 600 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  {asset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Label */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Photo Label (e.g., "Bitcoin Market Action")
            </label>
            <input
              type="text"
              name="photoLabel"
              value={formData.photoLabel}
              onChange={handleInputChange}
              placeholder="Photo label"
              style={{
                width: "100%",
                padding: "10px",
                background: palette.panel,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Why It Moved */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Why It Moved (key driver for today's action)
            </label>
            <textarea
              name="whyItMoved"
              value={formData.whyItMoved}
              onChange={handleInputChange}
              placeholder="What caused the price movement today?"
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                background: palette.panel,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Why You Should Care */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Why You Should Care (impact on portfolio)
            </label>
            <textarea
              name="whyYouShouldCare"
              value={formData.whyYouShouldCare}
              onChange={handleInputChange}
              placeholder="Why should investors pay attention?"
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                background: palette.panel,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Risk */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Risk (what could go wrong)
            </label>
            <textarea
              name="risk"
              value={formData.risk}
              onChange={handleInputChange}
              placeholder="What are the main risks?"
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                background: palette.panel,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Watch Next */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Watch Next (what to monitor)
            </label>
            <textarea
              name="watchNext"
              value={formData.watchNext}
              onChange={handleInputChange}
              placeholder="What should investors monitor next?"
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                background: palette.panel,
                border: `1px solid ${palette.hairline}`,
                color: palette.paper,
                borderRadius: "4px",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Message */}
          {message && (
            <div
              style={{
                padding: "12px",
                background: message.includes("✅") ? `${palette.green}22` : `${palette.red}22`,
                color: message.includes("✅") ? palette.green : palette.red,
                borderRadius: "4px",
                marginBottom: "20px",
                fontFamily: "var(--font-body)",
              }}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: palette.amber,
              color: palette.bg,
              border: "none",
              borderRadius: "4px",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {loading ? "Updating..." : "Update Content"}
          </button>
        </form>

        <div style={{ marginTop: "40px", padding: "20px", background: palette.panel, borderRadius: "4px" }}>
          <h3 style={{ marginBottom: "12px", color: palette.amber }}>💡 Tips</h3>
          <ul style={{ color: palette.paperDim, lineHeight: 1.6 }}>
            <li>Update this daily with fresh market insights</li>
            <li>Keep explanations concise (2-3 sentences each)</li>
            <li>Focus on actionable information for investors</li>
            <li>Update all major assets: Bitcoin, Gold, Apple, S&P 500, Nasdaq, Ethereum</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
