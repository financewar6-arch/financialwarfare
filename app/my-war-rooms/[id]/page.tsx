"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { useParams } from "next/navigation";

interface WarRoom {
  id: string;
  assetName: string;
  assetSymbol: string;
  thesis: { id: string; content: string };
  notes: Array<{ id: string; content: string }>;
  watching: {
    catalyst?: string;
    mainRisk?: string;
    upcomingEvent?: string;
  };
  status: "active" | "archived";
  createdAt: number;
}

export default function MyWarRoomPage() {
  const { palette } = useTheme();
  const params = useParams();
  const warRoomId = params.id as string;
  const [warRoom, setWarRoom] = useState<WarRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingThesis, setEditingThesis] = useState(false);
  const [thesisText, setThesisText] = useState("");
  const [newNote, setNewNote] = useState("");
  const [userId] = useState("demo-user"); // TODO: Get from auth

  useEffect(() => {
    const fetchWarRoom = async () => {
      try {
        const res = await fetch(`/api/my-war-rooms?userId=${userId}`);
        const data = await res.json();
        const found = data.warRooms?.find((wr: WarRoom) => wr.id === warRoomId);
        if (found) {
          setWarRoom(found);
          setThesisText(found.thesis.content);
        }
      } catch (error) {
        console.error("Failed to fetch war room:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarRoom();
  }, [warRoomId, userId]);

  const handleUpdateThesis = async () => {
    if (!warRoom) return;

    try {
      const res = await fetch("/api/my-war-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          userId,
          warRoomId,
          thesisContent: thesisText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWarRoom(data.warRoom);
        setEditingThesis(false);
      }
    } catch (error) {
      console.error("Failed to update thesis:", error);
    }
  };

  const handleAddNote = async () => {
    if (!warRoom || !newNote.trim()) return;

    try {
      const res = await fetch("/api/my-war-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_note",
          userId,
          warRoomId,
          content: newNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWarRoom(data.warRoom);
        setNewNote("");
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!warRoom) return;

    try {
      const res = await fetch("/api/my-war-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_note",
          userId,
          warRoomId,
          noteId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWarRoom(data.warRoom);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: palette.bg,
          color: palette.paper,
          minHeight: "100vh",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!warRoom) {
    return (
      <div
        style={{
          background: palette.bg,
          color: palette.paper,
          minHeight: "100vh",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        War room not found
      </div>
    );
  }

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.paper,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px 40px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: palette.amber,
              marginBottom: "4px",
            }}
          >
            {warRoom.assetSymbol}
          </div>
          <div style={{ color: palette.paperDim }}>MY WAR ROOM</div>
        </div>
        <a
          href="/my-war-rooms"
          style={{
            color: palette.blue,
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          ← Back to War Rooms
        </a>
      </div>

      {/* Content Grid */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 60px" }}>
        {/* LEFT: Thesis & Notes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "32px",
            marginBottom: "40px",
          }}
        >
          {/* Thesis Section */}
          <div>
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "24px",
                borderRadius: "8px",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: palette.paperDim,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  MY THESIS
                </div>
                <button
                  onClick={() => setEditingThesis(!editingThesis)}
                  style={{
                    padding: "4px 12px",
                    background: "transparent",
                    color: palette.amber,
                    border: `1px solid ${palette.amber}`,
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {editingThesis ? "CANCEL" : "EDIT THESIS"}
                </button>
              </div>

              {editingThesis ? (
                <div>
                  <textarea
                    value={thesisText}
                    onChange={(e) => setThesisText(e.target.value)}
                    rows={6}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: palette.bg,
                      color: palette.paper,
                      border: `1px solid ${palette.hairline}`,
                      borderRadius: "4px",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.95rem",
                      marginBottom: "12px",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleUpdateThesis}
                    style={{
                      padding: "8px 16px",
                      background: palette.green,
                      color: palette.bg,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    SAVE THESIS
                  </button>
                </div>
              ) : (
                <p style={{ margin: 0, lineHeight: 1.7 }}>{thesisText}</p>
              )}
            </div>

            {/* Watching Section */}
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "24px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  color: palette.paperDim,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "16px",
                }}
              >
                WHAT I'M WATCHING
              </div>

              {warRoom.watching?.catalyst && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ color: palette.amberDim, fontSize: "0.8rem" }}>
                    KEY CATALYST
                  </div>
                  <div>{warRoom.watching.catalyst}</div>
                </div>
              )}

              {warRoom.watching?.mainRisk && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ color: palette.amberDim, fontSize: "0.8rem" }}>
                    MAIN RISK
                  </div>
                  <div>{warRoom.watching.mainRisk}</div>
                </div>
              )}

              {warRoom.watching?.upcomingEvent && (
                <div>
                  <div style={{ color: palette.amberDim, fontSize: "0.8rem" }}>
                    UPCOMING EVENT
                  </div>
                  <div>{warRoom.watching.upcomingEvent}</div>
                </div>
              )}

              {!warRoom.watching?.catalyst &&
                !warRoom.watching?.mainRisk &&
                !warRoom.watching?.upcomingEvent && (
                  <p style={{ color: palette.paperDim, margin: 0 }}>
                    No items added yet
                  </p>
                )}
            </div>
          </div>

          {/* RIGHT: Personal Notes */}
          <div>
            <div
              style={{
                background: `${palette.panel}99`,
                border: `1px solid ${palette.hairline}`,
                padding: "24px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  color: palette.paperDim,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "16px",
                }}
              >
                MY NOTES
              </div>

              <div style={{ marginBottom: "16px" }}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a personal note..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: palette.bg,
                    color: palette.paper,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    marginBottom: "8px",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: palette.amber,
                    color: palette.bg,
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    opacity: !newNote.trim() ? 0.5 : 1,
                  }}
                >
                  ADD NOTE
                </button>
              </div>

              {warRoom.notes.length > 0 && (
                <div>
                  <div
                    style={{
                      borderTop: `1px solid ${palette.hairline}`,
                      paddingTop: "16px",
                    }}
                  >
                    {warRoom.notes.map((note) => (
                      <div
                        key={note.id}
                        style={{
                          padding: "12px",
                          background: palette.bg,
                          borderRadius: "4px",
                          marginBottom: "8px",
                          fontSize: "0.85rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ flex: 1 }}>{note.content}</div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          style={{
                            background: "transparent",
                            color: palette.red,
                            border: "none",
                            cursor: "pointer",
                            marginLeft: "8px",
                            fontSize: "0.8rem",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Placeholder sections for future phases */}
        <div
          style={{
            background: `${palette.panel}44`,
            border: `1px dashed ${palette.hairline}`,
            padding: "32px",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ color: palette.paperDim, marginBottom: "8px" }}>
            🔒 PREMIUM FEATURE
          </div>
          <h3 style={{ color: palette.amber, marginBottom: "8px" }}>
            THESIS MONITOR
          </h3>
          <p style={{ color: palette.paperDim, margin: 0 }}>
            Track relevant market developments that support or challenge your thesis.
            Coming soon.
          </p>
        </div>

        <div
          style={{
            background: `${palette.panel}44`,
            border: `1px dashed ${palette.hairline}`,
            padding: "32px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ color: palette.paperDim, marginBottom: "8px" }}>
            🔒 PREMIUM FEATURE
          </div>
          <h3 style={{ color: palette.amber, marginBottom: "8px" }}>
            RECENT DEVELOPMENTS & SOURCES
          </h3>
          <p style={{ color: palette.paperDim, margin: 0 }}>
            Factual market updates relevant to your thesis, with sourced information.
            Coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
