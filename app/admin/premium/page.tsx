"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { PREMIUM_CONFIG, updatePremiumConfig, addBetaUser, removeBetaUser } from "@/lib/premium-config";

export default function PremiumAdminPage() {
  const { palette } = useTheme();
  const [mode, setMode] = useState<"ENABLED" | "DISABLED" | "BETA" | "WAITLIST">(PREMIUM_CONFIG.mode);
  const [betaUserInput, setBetaUserInput] = useState("");

  const handleUpdateMode = (newMode: typeof mode) => {
    setMode(newMode);
    updatePremiumConfig({ mode: newMode });
  };

  const handleToggleEnabled = () => {
    const newEnabled = !PREMIUM_CONFIG.enabled;
    updatePremiumConfig({ enabled: newEnabled });
  };

  const handleAddBetaUser = () => {
    if (betaUserInput.trim()) {
      addBetaUser(betaUserInput.trim());
      setBetaUserInput("");
    }
  };

  const handleRemoveBetaUser = (userId: string) => {
    removeBetaUser(userId);
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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px 40px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>PREMIUM ADMIN CONTROLS</h1>
        <p style={{ color: palette.paperDim }}>
          Manage MY WAR ROOM feature availability and settings.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 60px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
          }}
        >
          {/* Left: Feature Controls */}
          <div>
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "32px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  color: palette.amber,
                  marginBottom: "24px",
                }}
              >
                FEATURE STATE
              </h2>

              {/* Enable/Disable Toggle */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    marginBottom: "8px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={PREMIUM_CONFIG.enabled}
                    onChange={handleToggleEnabled}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <span>Feature Enabled</span>
                </label>
                <p style={{ color: palette.paperDim, fontSize: "0.85rem", margin: "8px 0 0 32px" }}>
                  {PREMIUM_CONFIG.enabled ? "✓ MY WAR ROOM is active" : "✗ MY WAR ROOM is disabled"}
                </p>
              </div>

              {/* Mode Selection */}
              <div>
                <div style={{ fontSize: "0.85rem", color: palette.paperDim, marginBottom: "12px", textTransform: "uppercase" }}>
                  Mode
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {(["ENABLED", "BETA", "WAITLIST", "DISABLED"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => handleUpdateMode(m)}
                      style={{
                        padding: "12px",
                        background: mode === m ? palette.amber : `${palette.panel}99`,
                        color: mode === m ? palette.bg : palette.paper,
                        border: `1px solid ${mode === m ? palette.amber : palette.hairline}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: "16px", padding: "12px", background: palette.bg, borderRadius: "4px" }}>
                  <div style={{ fontSize: "0.8rem", color: palette.paperDim, marginBottom: "4px" }}>
                    Current Mode: <span style={{ color: palette.amber, fontWeight: 600 }}>{mode}</span>
                  </div>
                  {mode === "ENABLED" && (
                    <p style={{ margin: 0, fontSize: "0.85rem", color: palette.paperDim }}>
                      Available to all premium users
                    </p>
                  )}
                  {mode === "BETA" && (
                    <p style={{ margin: 0, fontSize: "0.85rem", color: palette.paperDim }}>
                      Only beta testers can create war rooms
                    </p>
                  )}
                  {mode === "WAITLIST" && (
                    <p style={{ margin: 0, fontSize: "0.85rem", color: palette.paperDim }}>
                      Show waitlist CTA only
                    </p>
                  )}
                  {mode === "DISABLED" && (
                    <p style={{ margin: 0, fontSize: "0.85rem", color: palette.paperDim }}>
                      Feature completely hidden
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Placeholder */}
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "32px",
                borderRadius: "8px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  color: palette.amber,
                  marginBottom: "24px",
                }}
              >
                USAGE STATS
              </h2>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.8rem", color: palette.paperDim, marginBottom: "4px" }}>
                  Total War Rooms Created
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 700 }}>0</div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.8rem", color: palette.paperDim, marginBottom: "4px" }}>
                  Active Premium Users
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 700 }}>0</div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.8rem", color: palette.paperDim, marginBottom: "4px" }}>
                  Most Tracked Asset
                </div>
                <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>—</div>
              </div>

              <p style={{ color: palette.paperDim, fontSize: "0.85rem", margin: 0 }}>
                📊 Analytics dashboard to be implemented
              </p>
            </div>
          </div>

          {/* Right: Beta Users */}
          <div
            style={{
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              padding: "32px",
              borderRadius: "8px",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                color: palette.amber,
                marginBottom: "24px",
              }}
            >
              BETA USERS
            </h2>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: palette.paperDim, marginBottom: "8px" }}>
                Add Beta User ID
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={betaUserInput}
                  onChange={(e) => setBetaUserInput(e.target.value)}
                  placeholder="user-123"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: palette.bg,
                    color: palette.paper,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleAddBetaUser()}
                />
                <button
                  onClick={handleAddBetaUser}
                  style={{
                    padding: "10px 20px",
                    background: palette.amber,
                    color: palette.bg,
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  ADD
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.85rem", color: palette.paperDim, marginBottom: "12px", textTransform: "uppercase" }}>
                Current Beta Users ({PREMIUM_CONFIG.betaUserIds?.length || 0})
              </div>

              {PREMIUM_CONFIG.betaUserIds && PREMIUM_CONFIG.betaUserIds.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {PREMIUM_CONFIG.betaUserIds.map((userId) => (
                    <div
                      key={userId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px",
                        background: palette.bg,
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>{userId}</span>
                      <button
                        onClick={() => handleRemoveBetaUser(userId)}
                        style={{
                          padding: "4px 12px",
                          background: palette.red,
                          color: palette.bg,
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: palette.paperDim, fontSize: "0.9rem", margin: 0 }}>
                  No beta users added yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div
          style={{
            background: `${palette.panel}44`,
            border: `1px dashed ${palette.hairline}`,
            padding: "24px",
            borderRadius: "8px",
            marginTop: "32px",
          }}
        >
          <h3 style={{ color: palette.amber, marginBottom: "12px" }}>ℹ️ Feature Modes</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", fontSize: "0.9rem" }}>
            <div>
              <strong>ENABLED</strong>
              <p style={{ color: palette.paperDim, margin: "4px 0 0 0" }}>
                All premium users can create and access MY WAR ROOM
              </p>
            </div>
            <div>
              <strong>BETA</strong>
              <p style={{ color: palette.paperDim, margin: "4px 0 0 0" }}>
                Only beta testers (listed above) can create war rooms
              </p>
            </div>
            <div>
              <strong>WAITLIST</strong>
              <p style={{ color: palette.paperDim, margin: "4px 0 0 0" }}>
                Show waitlist signup CTA, no actual access
              </p>
            </div>
            <div>
              <strong>DISABLED</strong>
              <p style={{ color: palette.paperDim, margin: "4px 0 0 0" }}>
                Feature completely hidden from users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
