"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";
import { ASSETS } from "@/lib/assets";

export default function CreateWarRoomPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { palette } = useTheme();
  const [step, setStep] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [thesis, setThesis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div
        style={{
          background: palette.bg,
          color: palette.paper,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}>
          Loading...
        </div>
      </div>
    );
  }

  const handleCreateWarRoom = async () => {
    if (!selectedAsset || !thesis.trim()) {
      setError("Please select an asset and enter a thesis statement");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const asset = ASSETS[selectedAsset];
      const res = await fetch("/api/my-war-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetSlug: selectedAsset,
          assetName: asset.name,
          assetSymbol: asset.symbol,
          thesisStatement: thesis,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create war room");
      }

      const warRoom = await res.json();
      router.push(`/my-war-rooms/${warRoom.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const premiumAssets = Object.values(ASSETS).filter((a) => a.isPremium);

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.paper,
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "40px",
            borderBottom: `2px solid ${palette.amber}`,
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: palette.amber,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            CREATE NEW WAR ROOM
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: palette.amberDim,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            STEP {step} OF 2
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: `${palette.red}22`,
              border: `1px solid ${palette.red}`,
              padding: "16px",
              marginBottom: "24px",
              borderRadius: "4px",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: palette.red,
            }}
          >
            {error}
          </div>
        )}

        {/* Step 1: Select Asset */}
        {step === 1 && (
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "24px",
                color: palette.paper,
              }}
            >
              Select an asset to research
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {premiumAssets.map((asset) => (
                <button
                  key={asset.slug}
                  onClick={() => setSelectedAsset(asset.slug)}
                  style={{
                    padding: "20px",
                    background:
                      selectedAsset === asset.slug
                        ? palette.amber
                        : `${palette.panel}99`,
                    border:
                      selectedAsset === asset.slug
                        ? `2px solid ${palette.amber}`
                        : `1px solid ${palette.hairline}`,
                    color:
                      selectedAsset === asset.slug
                        ? palette.bg
                        : palette.paper,
                    borderRadius: "4px",
                    fontFamily: "var(--font-header)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAsset !== asset.slug) {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        palette.amber;
                      (e.currentTarget as HTMLElement).style.color =
                        palette.amber;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAsset !== asset.slug) {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        palette.hairline;
                      (e.currentTarget as HTMLElement).style.color =
                        palette.paper;
                    }
                  }}
                >
                  <div>{asset.name}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.7,
                      marginTop: "4px",
                    }}
                  >
                    {asset.symbol}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedAsset}
              style={{
                marginTop: "32px",
                padding: "12px 32px",
                background: selectedAsset ? palette.amber : palette.gray,
                color: palette.bg,
                border: "none",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: selectedAsset ? "pointer" : "not-allowed",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "2px",
                transition: "all 0.2s",
                opacity: selectedAsset ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (selectedAsset) {
                  (e.currentTarget as HTMLElement).style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAsset) {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }
              }}
            >
              NEXT: ADD THESIS
            </button>
          </div>
        )}

        {/* Step 2: Add Thesis */}
        {step === 2 && (
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "24px",
                color: palette.paper,
              }}
            >
              Write your investment thesis
            </div>

            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                borderRadius: "4px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <textarea
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="Explain your thesis for this asset. Include your key assumptions, expected catalysts, and timeframe..."
                style={{
                  width: "100%",
                  minHeight: "200px",
                  background: palette.bg,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "2px",
                  padding: "16px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: palette.paper,
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                fontSize: "0.85rem",
                color: palette.paperDim,
                marginBottom: "24px",
                fontFamily: "var(--font-body)",
              }}
            >
              {thesis.length} / 2000 characters
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                style={{
                  padding: "12px 32px",
                  background: "transparent",
                  color: palette.amber,
                  border: `1px solid ${palette.amber}`,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    `${palette.amber}22`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                BACK
              </button>

              <button
                onClick={handleCreateWarRoom}
                disabled={loading || !thesis.trim()}
                style={{
                  padding: "12px 32px",
                  background:
                    loading || !thesis.trim() ? palette.gray : palette.amber,
                  color: palette.bg,
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor:
                    loading || !thesis.trim() ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                  opacity: loading || !thesis.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading && thesis.trim()) {
                    (e.currentTarget as HTMLElement).style.opacity = "0.9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && thesis.trim()) {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }
                }}
              >
                {loading ? "CREATING..." : "CREATE WAR ROOM"}
              </button>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link
            href="/my-war-rooms"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: palette.amber,
              textDecoration: "none",
              borderBottom: `1px solid ${palette.amber}44`,
              transition: "all 0.2s",
              padding: "8px 0",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor =
                palette.amber;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor =
                `${palette.amber}44`;
            }}
          >
            ← BACK TO WAR ROOMS
          </Link>
        </div>
      </div>
    </div>
  );
}
