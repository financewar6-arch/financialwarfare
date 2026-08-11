"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { ASSETS } from "@/lib/assets";

type Step = "asset" | "thesis" | "watching" | "review";

interface FormData {
  assetSlug: string;
  assetName: string;
  assetSymbol: string;
  thesisContent: string;
  catalyst?: string;
  mainRisk?: string;
  upcomingEvent?: string;
}

export default function CreateMyWarRoomPage() {
  const { palette } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState<Step>("asset");
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<typeof ASSETS[keyof typeof ASSETS][]>([]);
  const [formData, setFormData] = useState<FormData>({
    assetSlug: "",
    assetName: "",
    assetSymbol: "",
    thesisContent: "",
  });

  const handleAssetSearch = (value: string) => {
    setSearchInput(value);
    if (value.length > 0) {
      const results = Object.values(ASSETS).filter(
        (asset) =>
          asset.name.toLowerCase().includes(value.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  };

  const handleAssetSelect = (asset: typeof ASSETS[keyof typeof ASSETS]) => {
    setFormData({
      ...formData,
      assetSlug: asset.slug,
      assetName: asset.name,
      assetSymbol: asset.symbol,
    });
    setSearchInput("");
    setSearchResults([]);
    setStep("thesis");
  };

  const handleCreateWarRoom = async () => {
    if (!formData.assetSlug || !formData.thesisContent) {
      alert("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/my-war-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          userId: "demo-user", // TODO: Get from auth
          assetSlug: formData.assetSlug,
          assetName: formData.assetName,
          assetSymbol: formData.assetSymbol,
          thesisContent: formData.thesisContent,
          watching: {
            catalyst: formData.catalyst,
            mainRisk: formData.mainRisk,
            upcomingEvent: formData.upcomingEvent,
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(`Error: ${data.error || "Failed to create war room"}`);
        setLoading(false);
        return;
      }

      // Redirect to the new war room
      router.push(`/my-war-rooms/${data.warRoom.id}`);
    } catch (error) {
      alert(`Error: ${String(error)}`);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.paper,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 20px 40px" }}>
        <h1
          style={{
            fontFamily: "var(--font-header)",
            fontSize: "1.8rem",
            marginBottom: "8px",
          }}
        >
          CREATE MY WAR ROOM
        </h1>
        <p style={{ color: palette.paperDim }}>
          Build your personal intelligence workspace around any asset.
        </p>
      </div>

      {/* Form Container */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 20px 60px",
        }}
      >
        {/* STEP 1: Choose Asset */}
        {step === "asset" && (
          <div
            style={{
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              padding: "32px",
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: palette.amber,
                  marginBottom: "12px",
                }}
              >
                STEP 1: CHOOSE AN ASSET
              </h2>
              <p style={{ color: palette.paperDim }}>
                Search for an asset you want to track.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search: NVDA, Bitcoin, Gold..."
              value={searchInput}
              onChange={(e) => handleAssetSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: palette.bg,
                color: palette.paper,
                border: `1px solid ${palette.hairline}`,
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontFamily: "var(--font-mono)",
                marginBottom: "16px",
                outline: "none",
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = palette.amber;
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = palette.hairline;
              }}
            />

            {searchResults.length > 0 && (
              <div style={{ borderTop: `1px solid ${palette.hairline}` }}>
                {searchResults.map((asset) => (
                  <div
                    key={asset.slug}
                    onClick={() => handleAssetSelect(asset)}
                    style={{
                      padding: "12px 16px",
                      borderBottom: `1px solid ${palette.hairline}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: palette.bg,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        `${palette.panel}99`;
                      (e.currentTarget as HTMLElement).style.color =
                        palette.amber;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        palette.bg;
                      (e.currentTarget as HTMLElement).style.color =
                        palette.paper;
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{asset.name}</div>
                    <div style={{ fontSize: "0.85rem", color: palette.amberDim }}>
                      {asset.symbol}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Your Thesis */}
        {step === "thesis" && (
          <div
            style={{
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              padding: "32px",
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: palette.amber,
                  marginBottom: "12px",
                }}
              >
                STEP 2: YOUR THESIS
              </h2>
              <p style={{ color: palette.paperDim }}>
                Why are you researching {formData.assetSymbol}?
              </p>
            </div>

            <textarea
              value={formData.thesisContent}
              onChange={(e) =>
                setFormData({ ...formData, thesisContent: e.target.value })
              }
              placeholder="Describe your own view, research thesis or reason for following this asset.

Example: I believe AI infrastructure spending will continue to increase demand for Nvidia chips."
              rows={6}
              style={{
                width: "100%",
                padding: "16px",
                background: palette.bg,
                color: palette.paper,
                border: `1px solid ${palette.hairline}`,
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontFamily: "var(--font-body)",
                marginBottom: "16px",
                outline: "none",
                resize: "vertical",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLTextAreaElement).style.borderColor =
                  palette.amber;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLTextAreaElement).style.borderColor =
                  palette.hairline;
              }}
            />

            <p style={{ color: palette.paperDim, fontSize: "0.85rem" }}>
              This is your own view. Financial Warfare does not generate investment
              recommendations.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => setStep("asset")}
                style={{
                  padding: "12px 24px",
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  color: palette.paper,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ← BACK
              </button>
              <button
                onClick={() => setStep("watching")}
                disabled={!formData.thesisContent}
                style={{
                  padding: "12px 24px",
                  background: palette.amber,
                  color: palette.bg,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                  opacity: !formData.thesisContent ? 0.5 : 1,
                }}
              >
                NEXT →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: What Are You Watching? */}
        {step === "watching" && (
          <div
            style={{
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              padding: "32px",
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: palette.amber,
                  marginBottom: "12px",
                }}
              >
                STEP 3: WHAT ARE YOU WATCHING?
              </h2>
              <p style={{ color: palette.paperDim }}>
                Optional: Add specific things you're monitoring.
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  color: palette.paperDim,
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Key Catalyst
              </label>
              <input
                type="text"
                value={formData.catalyst || ""}
                onChange={(e) =>
                  setFormData({ ...formData, catalyst: e.target.value })
                }
                placeholder="What's the main catalyst you're watching?"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: palette.bg,
                  color: palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  color: palette.paperDim,
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Main Risk
              </label>
              <input
                type="text"
                value={formData.mainRisk || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mainRisk: e.target.value })
                }
                placeholder="What's your main risk concern?"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: palette.bg,
                  color: palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: palette.paperDim,
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Important Upcoming Event
              </label>
              <input
                type="text"
                value={formData.upcomingEvent || ""}
                onChange={(e) =>
                  setFormData({ ...formData, upcomingEvent: e.target.value })
                }
                placeholder="e.g., Earnings date, Product launch"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: palette.bg,
                  color: palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "4px",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep("thesis")}
                style={{
                  padding: "12px 24px",
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  color: palette.paper,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ← BACK
              </button>
              <button
                onClick={() => setStep("review")}
                style={{
                  padding: "12px 24px",
                  background: palette.amber,
                  color: palette.bg,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                REVIEW →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Create */}
        {step === "review" && (
          <div
            style={{
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              padding: "32px",
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: palette.amber,
                  marginBottom: "12px",
                }}
              >
                REVIEW YOUR WAR ROOM
              </h2>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "8px" }}>
                ASSET
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                {formData.assetSymbol} · {formData.assetName}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "8px" }}>
                YOUR THESIS
              </div>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{formData.thesisContent}</p>
            </div>

            <div
              style={{
                borderTop: `1px solid ${palette.hairline}`,
                paddingTop: "24px",
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setStep("watching")}
                style={{
                  padding: "12px 24px",
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  color: palette.paper,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ← BACK
              </button>
              <button
                onClick={handleCreateWarRoom}
                disabled={loading}
                style={{
                  padding: "12px 32px",
                  background: palette.green,
                  color: palette.bg,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "CREATING..." : "CREATE MY WAR ROOM"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
