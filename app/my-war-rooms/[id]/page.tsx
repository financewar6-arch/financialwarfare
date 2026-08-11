"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

interface WatchItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  source?: string;
  sourceUrl?: string;
  createdAt: string;
}

interface PersonalNote {
  id: string;
  content: string;
  type: string;
  createdAt: string;
}

interface Thesis {
  id: string;
  statement: string;
  confidence: string;
  createdAt: string;
}

interface WarRoom {
  id: string;
  assetSlug: string;
  assetName: string;
  assetSymbol: string;
  status: string;
  isPremium: boolean;
  thesis: Thesis[];
  notes: PersonalNote[];
  watching: WatchItem[];
  createdAt: string;
  lastViewedAt: string;
}

export default function WarRoomDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { palette } = useTheme();
  const [warRoom, setWarRoom] = useState<WarRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("thesis");
  const [newNote, setNewNote] = useState("");
  const [newWatchItem, setNewWatchItem] = useState({
    title: "",
    category: "catalyst",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchWarRoom();
    }
  }, [status, id]);

  const fetchWarRoom = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/my-war-rooms/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch war room");
      }
      const data = await res.json();
      setWarRoom(data);
      setError("");
    } catch (err) {
      setError("Error loading war room");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/my-war-rooms/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote, type: "general" }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      setNewNote("");
      fetchWarRoom();
    } catch (err) {
      setError("Error adding note");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddWatchItem = async () => {
    if (!newWatchItem.title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/my-war-rooms/${id}/watching`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWatchItem),
      });

      if (!res.ok) throw new Error("Failed to add watch item");

      setNewWatchItem({ title: "", category: "catalyst", description: "" });
      fetchWarRoom();
    } catch (err) {
      setError("Error adding watch item");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
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

  if (!session || !warRoom) {
    return null;
  }

  const thesis = warRoom.thesis?.[0];

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.paper,
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: palette.amberDim,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
            }}
          >
            {warRoom.assetSlug.toUpperCase()} RESEARCH
          </div>
          <div
            style={{
              fontFamily: "var(--font-header)",
              fontSize: "2rem",
              fontWeight: 700,
              color: palette.amber,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
            }}
          >
            {warRoom.assetName}
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              fontSize: "0.85rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ color: palette.paperDim }}>
              {warRoom.assetSymbol}
            </span>
            <span
              style={{
                background:
                  warRoom.status === "active"
                    ? `${palette.green}22`
                    : `${palette.gray}22`,
                padding: "4px 12px",
                borderRadius: "2px",
                border:
                  warRoom.status === "active"
                    ? `1px solid ${palette.green}`
                    : `1px solid ${palette.gray}`,
                color:
                  warRoom.status === "active"
                    ? palette.green
                    : palette.gray,
              }}
            >
              {warRoom.status.toUpperCase()}
            </span>
          </div>
        </div>

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

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginBottom: "40px",
            borderBottom: `1px solid ${palette.hairline}`,
            paddingBottom: "12px",
          }}
        >
          {[
            { id: "thesis", label: "THESIS" },
            { id: "watching", label: "WHAT TO WATCH" },
            { id: "notes", label: "PERSONAL NOTES" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 0",
                background: "transparent",
                border: "none",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color:
                  activeTab === tab.id ? palette.amber : palette.paperDim,
                cursor: "pointer",
                transition: "color 0.2s",
                borderBottom:
                  activeTab === tab.id
                    ? `2px solid ${palette.amber}`
                    : "none",
                paddingBottom: activeTab === tab.id ? "10px" : "8px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* THESIS TAB */}
        {activeTab === "thesis" && (
          <div>
            {thesis ? (
              <div
                style={{
                  background: `${palette.panel}99`,
                  border: `1px solid ${palette.hairline}`,
                  padding: "24px",
                  borderRadius: "4px",
                  marginBottom: "40px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-header)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    marginBottom: "16px",
                    color: palette.amber,
                  }}
                >
                  INVESTMENT THESIS
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: palette.paper,
                    marginBottom: "16px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {thesis.statement}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: palette.amberDim,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Created{" "}
                  {new Date(thesis.createdAt).toLocaleDateString()}{" "}
                  • Confidence:{" "}
                  {thesis.confidence?.toUpperCase() || "NOT SET"}
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: `${palette.panel}44`,
                  border: `1px dashed ${palette.hairline}`,
                  padding: "24px",
                  borderRadius: "4px",
                  textAlign: "center",
                  color: palette.paperDim,
                  fontFamily: "var(--font-body)",
                }}
              >
                No thesis yet
              </div>
            )}
          </div>
        )}

        {/* WHAT TO WATCH TAB */}
        {activeTab === "watching" && (
          <div>
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "24px",
                borderRadius: "4px",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                ADD NEW CATALYST OR RISK
              </div>

              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  value={newWatchItem.title}
                  onChange={(e) =>
                    setNewWatchItem({ ...newWatchItem, title: e.target.value })
                  }
                  placeholder="Title (e.g., Earnings Report)"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: palette.bg,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "2px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    color: palette.paper,
                    marginBottom: "12px",
                    boxSizing: "border-box",
                  }}
                />

                <select
                  value={newWatchItem.category}
                  onChange={(e) =>
                    setNewWatchItem({
                      ...newWatchItem,
                      category: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: palette.bg,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "2px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    color: palette.paper,
                    marginBottom: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="catalyst">May Support Thesis</option>
                  <option value="risk">May Challenge Thesis</option>
                  <option value="development">Other Relevant</option>
                </select>

                <textarea
                  value={newWatchItem.description}
                  onChange={(e) =>
                    setNewWatchItem({
                      ...newWatchItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description (optional)"
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "12px",
                    background: palette.bg,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "2px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    color: palette.paper,
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                onClick={handleAddWatchItem}
                disabled={submitting || !newWatchItem.title.trim()}
                style={{
                  padding: "10px 24px",
                  background:
                    submitting || !newWatchItem.title.trim()
                      ? palette.gray
                      : palette.amber,
                  color: palette.bg,
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor:
                    submitting || !newWatchItem.title.trim()
                      ? "not-allowed"
                      : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                  opacity: submitting || !newWatchItem.title.trim() ? 0.5 : 1,
                }}
              >
                {submitting ? "ADDING..." : "ADD ITEM"}
              </button>
            </div>

            {warRoom.watching && warRoom.watching.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px",
                }}
              >
                {warRoom.watching.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: `${palette.panel}99`,
                      border: `1px solid ${palette.hairline}`,
                      padding: "16px",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-header)",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        marginBottom: "8px",
                        color: palette.amber,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: palette.amberDim,
                        fontFamily: "var(--font-mono)",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.category === "catalyst"
                        ? "May Support"
                        : item.category === "risk"
                          ? "May Challenge"
                          : "Other Relevant"}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.85rem",
                          color: palette.paperDim,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: `${palette.panel}44`,
                  border: `1px dashed ${palette.hairline}`,
                  padding: "40px",
                  borderRadius: "4px",
                  textAlign: "center",
                  color: palette.paperDim,
                  fontFamily: "var(--font-body)",
                }}
              >
                No watch items yet
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <div>
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "24px",
                borderRadius: "4px",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-header)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                ADD PERSONAL NOTE
              </div>

              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add your thoughts, observations, or analysis..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px",
                  background: palette.bg,
                  border: `1px solid ${palette.hairline}`,
                  borderRadius: "2px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: palette.paper,
                  marginBottom: "12px",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={handleAddNote}
                disabled={submitting || !newNote.trim()}
                style={{
                  padding: "10px 24px",
                  background:
                    submitting || !newNote.trim() ? palette.gray : palette.amber,
                  color: palette.bg,
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor:
                    submitting || !newNote.trim()
                      ? "not-allowed"
                      : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                  opacity: submitting || !newNote.trim() ? 0.5 : 1,
                }}
              >
                {submitting ? "SAVING..." : "ADD NOTE"}
              </button>
            </div>

            {warRoom.notes && warRoom.notes.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                }}
              >
                {warRoom.notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      background: `${palette.panel}99`,
                      border: `1px solid ${palette.hairline}`,
                      padding: "16px",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: palette.amberDim,
                        fontFamily: "var(--font-mono)",
                        marginBottom: "8px",
                      }}
                    >
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: palette.paper,
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {note.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: `${palette.panel}44`,
                  border: `1px dashed ${palette.hairline}`,
                  padding: "40px",
                  borderRadius: "4px",
                  textAlign: "center",
                  color: palette.paperDim,
                  fontFamily: "var(--font-body)",
                }}
              >
                No notes yet
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div style={{ marginTop: "60px", textAlign: "center" }}>
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
