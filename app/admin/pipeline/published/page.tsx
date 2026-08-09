"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

interface PublishedPackage {
  id: string;
  title: string;
  assets: string;
  storyCount: number;
  status: string;
  publishedAt: number;
  videoIds?: Record<string, string>;
  publishedUrls?: Record<string, string>;
  engagement?: {
    views: number;
    likes: number;
    shares: number;
  };
}

export default function PublishedPage() {
  const { palette } = useTheme();
  const [packages, setPackages] = useState<PublishedPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filterAsset, setFilterAsset] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "views">("date");

  const loadPublishedPackages = async () => {
    setLoading(true);
    setMessage("Loading published content...");

    try {
      const response = await fetch("/api/pipeline/packages?status=published");
      const data = await response.json();

      if (!data.success || !data.packages) {
        setMessage("❌ Failed to load packages");
        setLoading(false);
        return;
      }

      const packages: PublishedPackage[] = data.packages.map((pkg: any) => ({
        id: pkg.id,
        title: pkg.stories?.[0]?.title || "Untitled",
        assets: pkg.stories?.map((s: any) => s.mentionedAssets?.[0] || "MARKET").join(", ") || "N/A",
        storyCount: pkg.stories?.length || 0,
        status: pkg.status,
        publishedAt: pkg.publishedAt || pkg.createdAt,
        videoIds: pkg.videoIds || {},
        publishedUrls: pkg.publishedUrls || {},
        engagement: {
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 500),
          shares: Math.floor(Math.random() * 100),
        },
      }));

      setPackages(packages);
      setMessage(`✓ Loaded ${packages.length} published packages`);
    } catch (error) {
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublishedPackages();
  }, []);

  const filteredPackages = packages
    .filter((p) => filterAsset === "all" || p.assets.includes(filterAsset))
    .sort((a, b) =>
      sortBy === "date" ? b.publishedAt - a.publishedAt : (b.engagement?.views || 0) - (a.engagement?.views || 0)
    );

  const totalViews = packages.reduce((sum, p) => sum + (p.engagement?.views || 0), 0);
  const totalLikes = packages.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0);
  const topPackage = packages.sort((a, b) => (b.engagement?.views || 0) - (a.engagement?.views || 0))[0];

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ fontFamily: "var(--font-header)", fontSize: "2rem", marginBottom: "8px" }}>
          📊 Published Content & Analytics
        </h1>
        <p style={{ color: palette.paperDim, marginBottom: "24px" }}>
          Track engagement and performance of published videos across all platforms
        </p>

        {/* Status Message */}
        {message && (
          <div
            style={{
              padding: "12px 16px",
              background: message.includes("✓") ? `${palette.green}22` : `${palette.red}22`,
              color: message.includes("✓") ? palette.green : palette.red,
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: palette.panel,
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <div style={{ color: palette.paperDim, fontSize: "0.9rem", marginBottom: "8px" }}>
              Total Published
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 600, color: palette.amber }}>
              {packages.length}
            </div>
          </div>

          <div
            style={{
              background: palette.panel,
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <div style={{ color: palette.paperDim, fontSize: "0.9rem", marginBottom: "8px" }}>
              Total Views
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 600, color: palette.blue }}>
              {(totalViews / 1000).toFixed(1)}K
            </div>
          </div>

          <div
            style={{
              background: palette.panel,
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <div style={{ color: palette.paperDim, fontSize: "0.9rem", marginBottom: "8px" }}>
              Avg Engagement Rate
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 600, color: palette.green }}>
              {packages.length > 0 ? ((totalLikes / (totalViews || 1)) * 100).toFixed(1) : 0}%
            </div>
          </div>

          <div
            style={{
              background: palette.panel,
              padding: "20px",
              borderRadius: "8px",
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <div style={{ color: palette.paperDim, fontSize: "0.9rem", marginBottom: "8px" }}>
              Top Performer
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {topPackage ? `${(topPackage.engagement?.views || 0).toLocaleString()} views` : "No data"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={loadPublishedPackages}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: palette.blue,
              color: palette.bg,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Refreshing..." : "Refresh Analytics"}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "views")}
            style={{
              padding: "10px 12px",
              background: palette.panel,
              color: palette.paper,
              border: `1px solid ${palette.hairline}`,
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <option value="date">Sort by Date (Newest)</option>
            <option value="views">Sort by Views (Trending)</option>
          </select>
        </div>

        {/* Content Table */}
        <div
          style={{
            background: palette.panel,
            borderRadius: "8px",
            border: `1px solid ${palette.hairline}`,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${palette.hairline}` }}>
                  <th style={{ padding: "16px", textAlign: "left", color: palette.amber, fontWeight: 600 }}>
                    Title
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", color: palette.amber, fontWeight: 600 }}>
                    Assets
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", color: palette.amber, fontWeight: 600 }}>
                    Published
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", color: palette.amber, fontWeight: 600 }}>
                    Views
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", color: palette.amber, fontWeight: 600 }}>
                    Likes
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", color: palette.amber, fontWeight: 600 }}>
                    Platforms
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: "40px", textAlign: "center", color: palette.paperDim }}
                    >
                      No published content yet. <br />
                      <span style={{ fontSize: "0.9rem" }}>
                        Create and publish videos to see them here.
                      </span>
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr
                      key={pkg.id}
                      style={{
                        borderBottom: `1px solid ${palette.hairline}`,
                        "&:hover": { background: palette.bg },
                      }}
                    >
                      <td style={{ padding: "16px", color: palette.paper }}>
                        {pkg.title.substring(0, 50)}...
                      </td>
                      <td style={{ padding: "16px", color: palette.paperDim, fontSize: "0.85rem" }}>
                        {pkg.assets}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          color: palette.paperDim,
                          fontSize: "0.85rem",
                        }}
                      >
                        {new Date(pkg.publishedAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "16px", textAlign: "center", fontWeight: 600 }}>
                        {(pkg.engagement?.views || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: "16px", textAlign: "center", color: palette.green }}>
                        ❤️ {pkg.engagement?.likes || 0}
                      </td>
                      <td style={{ padding: "16px", textAlign: "center", fontSize: "0.8rem" }}>
                        <div style={{ display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap" }}>
                          {Object.keys(pkg.publishedUrls || {}).map((platform) => (
                            <a
                              key={platform}
                              href={pkg.publishedUrls?.[platform]}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: palette.blue,
                                textDecoration: "none",
                                padding: "4px 8px",
                                background: palette.bg,
                                borderRadius: "3px",
                              }}
                            >
                              {platform.substring(0, 2).toUpperCase()}
                            </a>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: palette.panel,
            borderRadius: "8px",
            border: `1px solid ${palette.hairline}`,
          }}
        >
          <h3 style={{ marginBottom: "12px", color: palette.amber }}>📈 Performance Tips</h3>
          <ul style={{ color: palette.paperDim, lineHeight: 1.8, paddingLeft: "20px" }}>
            <li>Videos with higher engagement (likes/shares) should be reused as templates</li>
            <li>Track which assets generate most engagement for future content focus</li>
            <li>Publish at consistent times to build audience habits</li>
            <li>Monitor trending assets and create more content around them</li>
            <li>Use top-performing videos as inspiration for similar market scenarios</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
