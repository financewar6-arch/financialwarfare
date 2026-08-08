"use client";

import { useEffect, useState } from "react";
import { palette } from "@/lib/warroom/palette";

interface QueueItem {
  id: string;
  marketEventId: string;
  title: string;
  description: string;
  assetSymbol: string;
  assetName: string;
  priceChange: number;
  status: string;
  flaggedIssues?: string[];
  createdAt: number;
  approvalNotes?: string;
}

export function ContentQueueDashboard() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("DRAFT");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, [filter]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shorts/queue?status=${filter}`);
      const data = await response.json();
      setQueue(data.items || []);
    } catch (error) {
      console.error("Failed to fetch queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, notes: string) => {
    setActionInProgress(id);
    try {
      const response = await fetch("/api/shorts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentQueueId: id,
          action: "approve",
          approvalNotes: notes,
        }),
      });

      if (response.ok) {
        setSelectedId(null);
        fetchQueue();
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionInProgress(id);
    try {
      await fetch("/api/shorts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentQueueId: id,
          action: "reject",
          approvalNotes: reason,
        }),
      });

      setSelectedId(null);
      fetchQueue();
    } finally {
      setActionInProgress(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const selectedItem = queue.find((item) => item.id === selectedId);

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.paper,
        minHeight: "100vh",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "2rem",
              fontWeight: 600,
              color: palette.amber,
              marginBottom: "12px",
            }}
          >
            📝 CONTENT QUEUE DASHBOARD
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: palette.paperDim }}>
            Review and approve YouTube Shorts scripts
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["DRAFT", "APPROVED", "GENERATING", "READY", "PUBLISHED", "REJECTED", "FAILED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: "8px 16px",
                  background: filter === status ? palette.amber : `${palette.panel}99`,
                  color: filter === status ? palette.bg : palette.paper,
                  border: `1px solid ${palette.hairline}`,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  if (filter !== status) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = palette.amber;
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== status) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = palette.hairline;
                  }
                }}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Queue Items List */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
          {/* Left: Queue List */}
          <div>
            {loading ? (
              <div style={{ color: palette.paperDim }}>○ Loading...</div>
            ) : queue.length === 0 ? (
              <div style={{ color: palette.paperDim }}>No items in {filter} status</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {queue.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      padding: "12px",
                      background: selectedId === item.id ? `${palette.amber}22` : `${palette.panel}99`,
                      border: `1px solid ${selectedId === item.id ? palette.amber : palette.hairline}`,
                      cursor: "pointer",
                      borderRadius: "2px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedId !== item.id) {
                        (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedId !== item.id) {
                        (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
                      }
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-header)",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {item.assetSymbol}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: palette.paperDim, lineHeight: 1.3 }}>
                      {item.title.substring(0, 50)}...
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: palette.amberDim,
                        marginTop: "4px",
                      }}
                    >
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Selected Item Details */}
          {selectedItem && (
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "20px",
                borderRadius: "2px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {selectedItem.assetName} ({selectedItem.assetSymbol})
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color:
                      selectedItem.priceChange >= 0
                        ? palette.green
                        : selectedItem.priceChange <= 0
                          ? palette.red
                          : palette.paper,
                    fontWeight: 600,
                  }}
                >
                  {selectedItem.priceChange >= 0 ? "📈" : "📉"} {selectedItem.priceChange.toFixed(2)}%
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: palette.amberDim }}>
                  TITLE
                </div>
                <div style={{ marginBottom: "12px" }}>{selectedItem.title}</div>

                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: palette.amberDim }}>
                  DESCRIPTION
                </div>
                <div style={{ marginBottom: "12px", lineHeight: 1.5 }}>{selectedItem.description}</div>

                {selectedItem.flaggedIssues && selectedItem.flaggedIssues.length > 0 && (
                  <>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: palette.red }}>
                      ⚠️ FLAGGED ISSUES
                    </div>
                    <ul style={{ marginBottom: "12px", paddingLeft: "20px" }}>
                      {selectedItem.flaggedIssues.map((issue, i) => (
                        <li key={i} style={{ fontSize: "0.85rem", color: palette.paperDim }}>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Actions */}
              {selectedItem.status === "DRAFT" && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => handleApprove(selectedItem.id, "Approved for video generation")}
                    disabled={actionInProgress === selectedItem.id}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      background: palette.green,
                      color: palette.bg,
                      border: "none",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: actionInProgress === selectedItem.id ? "not-allowed" : "pointer",
                      borderRadius: "2px",
                      opacity: actionInProgress === selectedItem.id ? 0.6 : 1,
                    }}
                  >
                    ✓ APPROVE
                  </button>
                  <button
                    onClick={() => handleReject(selectedItem.id, "Rejected by reviewer")}
                    disabled={actionInProgress === selectedItem.id}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      background: palette.red,
                      color: palette.bg,
                      border: "none",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: actionInProgress === selectedItem.id ? "not-allowed" : "pointer",
                      borderRadius: "2px",
                      opacity: actionInProgress === selectedItem.id ? 0.6 : 1,
                    }}
                  >
                    ✗ REJECT
                  </button>
                </div>
              )}

              {selectedItem.status === "APPROVED" && (
                <div
                  style={{
                    padding: "12px",
                    background: `${palette.amber}22`,
                    border: `1px solid ${palette.amber}44`,
                    borderRadius: "2px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: palette.amber,
                  }}
                >
                  ⏳ Waiting for video generation...
                </div>
              )}

              {selectedItem.status === "READY" && (
                <div
                  style={{
                    padding: "12px",
                    background: `${palette.green}22`,
                    border: `1px solid ${palette.green}44`,
                    borderRadius: "2px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: palette.green,
                  }}
                >
                  ✓ Video generated and ready to publish
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
