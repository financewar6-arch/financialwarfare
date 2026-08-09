"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WarRoomCard } from "@/components/site/WarRoomCard";
import { WhatsMovingTheMarket } from "@/components/site/WhatsMovingTheMarket";
import { AuthBanner } from "@/components/site/AuthBanner";
import { ASSETS } from "@/lib/assets";
import { useTheme } from "@/lib/theme-context";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string | null;
  source: { name: string };
  publishedAt: string;
  content?: string;
}

interface Short {
  id: string;
  title: string;
  assetSymbol: string;
  assetName: string;
  priceChange: number;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  generatedAt: number;
  assetSlug: string;
  headline?: string;
  whyItMoved?: string;
  significance?: string;
  newsBrief?: string; // Full 1-minute news brief for typewriter display
}

interface SundayOutlook {
  id: string;
  slug: string;
  title: string;
  author: string;
  publishedAt: number;
  coverImage?: string;
  summary: string;
  substackUrl: string;
  featured: boolean;
}

// Typewriter Text Component - reveals text character by character
function TypewriterDisplay({ text, duration }: { text: string; duration: number }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text) return;

    let charIndex = 0;
    const totalChars = text.length;
    const durationMs = duration * 1000;
    const msPerChar = durationMs / totalChars;
    let lastUpdateTime = Date.now();

    const animateText = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTime;

      if (elapsed >= msPerChar) {
        charIndex = Math.min(charIndex + 1, totalChars);
        setDisplayText(text.substring(0, charIndex));
        lastUpdateTime = now;
      }

      if (charIndex < totalChars) {
        requestAnimationFrame(animateText);
      }
    };

    requestAnimationFrame(animateText);
  }, [text, duration]);

  return <>{displayText}</>;
}


// CSS for animated typewriter effect - reveals text letter by letter over 45 seconds
const typewriterStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  .delay-1 { animation-delay: 0.3s; opacity: 0; }
  .delay-2 { animation-delay: 1s; opacity: 0; }
  .delay-3 { animation-delay: 1.8s; opacity: 0; }
  .videos-market-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  @media (max-width: 640px) {
    .videos-market-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function Home() {
  const { palette } = useTheme();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [shortsLoading, setShortsLoading] = useState(true);
  const [outlooks, setOutlooks] = useState<SundayOutlook[]>([]);
  const [outlookLoading, setOutlookLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<(typeof ASSETS)[keyof typeof ASSETS][]>([]);
  const assets = Object.values(ASSETS);
  const featuredAssets = ["bitcoin", "gold", "apple"].map((slug) => ASSETS[slug as keyof typeof ASSETS]).filter(Boolean);

  // Play flashbang sound once on page load
  useEffect(() => {
    const hasPlayedSound = localStorage.getItem("flashbang-played");
    if (!hasPlayedSound) {
      const audio = new Audio("/sounds/flashbang.mp3");
      audio.volume = 0.7; // Set volume to 70%
      audio.play().catch((err) => console.log("Audio playback failed:", err));
      localStorage.setItem("flashbang-played", "true");
    }
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (value.length > 0) {
      const results = Object.values(ASSETS).filter(
        (asset) => asset.name.toLowerCase().includes(value.toLowerCase()) || asset.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    // Fetch news
    fetch("/api/news?category=market")
      .then((res) => res.json())
      .then((data) => {
        const articles = data.articles?.slice(0, 4) || [];
        setNews(articles);

        // Store articles in sessionStorage for detail pages
        articles.forEach((article: NewsArticle) => {
          const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          sessionStorage.setItem(`article-${slug}`, JSON.stringify(article));
        });

        setNewsLoading(false);
      })
      .catch(() => setNewsLoading(false));

    // Fetch shorts
    fetch("/api/shorts/latest?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setShorts(data.videos || []);
        setShortsLoading(false);
      })
      .catch(() => setShortsLoading(false));

    // Fetch all Sunday Outlooks (latest 2)
    fetch("/api/sunday-outlook")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.outlooks) {
          setOutlooks(data.outlooks.slice(0, 2));
        }
        setOutlookLoading(false);
      })
      .catch(() => setOutlookLoading(false));
  }, []);

  const groupedByCategory = assets.reduce(
    (acc, asset) => {
      if (!acc[asset.category]) acc[asset.category] = [];
      acc[asset.category].push(asset);
      return acc;
    },
    {} as Record<string, typeof assets>
  );

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh" }}>
      <style>{typewriterStyles}</style>
      {/* Auth Banner */}
      <AuthBanner isAuthenticated={false} />

      {/* Intro Video Hero */}
      <div style={{ position: "relative", width: "100%", marginBottom: "40px", overflow: "hidden" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <source src="/video/Financial Warfare Intro.mp4" type="video/mp4" />
          </video>

          {/* Subtle Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${palette.bg}44 0%, transparent 50%, ${palette.bg}44 100%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 16px" }}>
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search tickers... (e.g., TSLA, MSFT, BTC)"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: `${palette.panel}99`,
              border: `1px solid ${palette.hairline}`,
              color: palette.paper,
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = palette.amber;
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = palette.hairline;
            }}
          />
          {searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: palette.bg,
                border: `1px solid ${palette.hairline}`,
                borderTop: "none",
                maxHeight: "300px",
                overflowY: "auto",
                marginTop: "-1px",
                zIndex: 100,
              }}
            >
              {searchResults.map((asset) => (
                <Link
                  key={asset.slug}
                  href={`/war-room/${asset.slug}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderBottom: `1px solid ${palette.hairline}`,
                    textDecoration: "none",
                    color: palette.paperDim,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${palette.panel}99`;
                    (e.currentTarget as HTMLElement).style.color = palette.amber;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = palette.paperDim;
                  }}
                >
                  <span>{asset.name}</span>
                  <span style={{ color: palette.amberDim }}>{asset.symbol}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured War Rooms */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {featuredAssets.map((asset) => (
            <WarRoomCard key={asset.slug} slug={asset.slug} name={asset.name} symbol={asset.symbol} />
          ))}
        </div>
      </div>

      {/* Sunday Outlook Featured Section */}
      {!outlookLoading && outlooks.length > 0 && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 60px" }}>
          <div style={{ borderTop: `1px solid ${palette.hairline}`, paddingTop: "60px" }}>
            {/* Featured Article (Latest) */}
            <Link href={`/sunday-outlook/${outlooks[0].slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", alignItems: "start", marginBottom: "60px", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => {
                  const img = (e.currentTarget as HTMLElement).querySelector('img');
                  if (img) (img as HTMLElement).style.transform = "scale(1.02)";
                }
                }
                onMouseLeave={(e) => {
                  const img = (e.currentTarget as HTMLElement).querySelector('img');
                  if (img) (img as HTMLElement).style.transform = "scale(1)";
                }
                }>
                {/* Left: Image */}
                {outlooks[0].coverImage && (
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={outlooks[0].coverImage}
                      alt={outlooks[0].title}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        borderRadius: "8px",
                        boxShadow: `0 20px 40px ${palette.bg}66, 0 0 1px ${palette.hairline}`,
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                )}

                {/* Right: Content */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ color: palette.amber, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "16px", textTransform: "uppercase" }}>
                    📰 Sunday Outlook
                  </div>

                  <h2
                    style={{
                      fontSize: "2rem",
                      fontFamily: "var(--font-header)",
                      fontWeight: 700,
                      marginBottom: "20px",
                      lineHeight: 1.25,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {outlooks[0].title}
                  </h2>

                  <div style={{ display: "flex", gap: "20px", marginBottom: "24px", color: palette.paperDim, fontSize: "0.85rem", fontWeight: 500 }}>
                    <span style={{ fontWeight: 600 }}>{outlooks[0].author}</span>
                    <span>•</span>
                    <span>
                      {new Date(outlooks[0].publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: palette.paperDim, marginBottom: "32px", fontWeight: 400 }}>
                    {outlooks[0].summary}
                  </p>

                  <div style={{ color: palette.blue, fontWeight: 600, display: "inline-block", fontSize: "0.95rem", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = palette.amber;
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = palette.blue;
                      (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    }}>
                    Read Full Outlook →
                  </div>
                </div>
              </div>
            </Link>

            {/* Previous Article (if exists) */}
            {outlooks.length > 1 && (
              <div style={{ paddingTop: "48px", borderTop: `1px solid ${palette.hairline}` }}>
                <h3 style={{ color: palette.amber, fontSize: "0.7rem", fontWeight: 700, marginBottom: "28px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  📖 Previous Outlook
                </h3>
                <Link href={`/sunday-outlook/${outlooks[1].slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ cursor: "pointer", display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px", alignItems: "start", transition: "all 0.2s ease", padding: "16px", borderRadius: "8px", background: `${palette.panel}33` }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `${palette.panel}66`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `${palette.panel}33`;
                    }}>
                    {/* Thumbnail */}
                    {outlooks[1].coverImage && (
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img
                          src={outlooks[1].coverImage}
                          alt={outlooks[1].title}
                          style={{
                            width: "100%",
                            aspectRatio: "4/3",
                            objectFit: "cover",
                            borderRadius: "6px",
                            boxShadow: `0 8px 20px ${palette.bg}44`,
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "12px", lineHeight: 1.35, letterSpacing: "-0.3px" }}>
                        {outlooks[1].title}
                      </h4>

                      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", color: palette.paperDim, fontSize: "0.8rem", fontWeight: 500 }}>
                        <span>{outlooks[1].author}</span>
                        <span>•</span>
                        <span>
                          {new Date(outlooks[1].publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: palette.paperDim, marginBottom: "16px", fontWeight: 400 }}>
                        {outlooks[1].summary.substring(0, 150)}...
                      </p>

                      <div style={{ color: palette.blue, fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s ease" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = palette.amber;
                          (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = palette.blue;
                          (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                        }}>
                        Read Outlook →
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* All Outlooks Link */}
            <div style={{ marginTop: "32px", paddingTop: "32px", borderTop: `1px solid ${palette.hairline}` }}>
              <Link href="/sunday-outlook" style={{ color: palette.blue, textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
                View All Outlooks →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Videos + What's Moving the Market Section */}
      <div className="videos-market-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", marginBottom: "40px" }}>
        {/* Left: YouTube Videos / Market Shorts */}
        <div>
          <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.3rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "16px" }}>
            DAILY NEWS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {shortsLoading ? (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
                ○ LOADING...
              </div>
            ) : shorts.length === 0 ? (
              [1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    background: `${palette.panel}99`,
                    border: `1px solid ${palette.hairline}`,
                    padding: "12px",
                    aspectRatio: "16/9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>▶</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
                      Awaiting content...
                    </div>
                  </div>
                </div>
              ))
            ) : (
              shorts.map((short) => (
                <Link
                  key={short.id}
                  href={`/war-room/${short.assetSlug}`}
                  style={{
                    background: `${palette.panel}99`,
                    border: `1px solid ${palette.hairline}`,
                    padding: "0",
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: "9/12",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = palette.amber;
                    (e.currentTarget as HTMLElement).style.background = `${palette.panel}dd`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = palette.hairline;
                    (e.currentTarget as HTMLElement).style.background = `${palette.panel}99`;
                  }}
                >
                  {/* Video */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      pointerEvents: "none",
                    }}
                    poster={short.thumbnailUrl}
                  >
                    <source src={short.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Professional Financial News Brief - Typewriter Effect */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 100%)`,
                      padding: "30px 28px",
                      color: palette.paper,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      overflow: "hidden",
                    }}
                  >
                    {/* Breaking News Badge + Time */}
                    <div
                      className="fade-in-up delay-1"
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "28px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          background: palette.red,
                          color: palette.bg,
                          padding: "4px 8px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          borderRadius: "2px",
                        }}
                      >
                        ● MARKET BRIEF
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.65rem",
                          color: palette.paperDim,
                        }}
                      >
                        {new Date(short.generatedAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Main News Brief - Character by character typewriter effect */}
                    {short.newsBrief && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.98rem",
                          lineHeight: 1.65,
                          fontWeight: 500,
                          color: palette.paper,
                          flex: 1,
                          textAlign: "left",
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          paddingTop: "60px",
                          paddingBottom: "80px",
                          display: "block",
                          minHeight: "1em",
                        }}
                      >
                        <TypewriterDisplay text={short.newsBrief} duration={43} />
                      </div>
                    )}

                    {/* Price Percentage - Top Right */}
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "28px",
                        textAlign: "right",
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-header)",
                          fontSize: "1.3rem",
                          fontWeight: 700,
                          color: short.priceChange >= 0 ? palette.green : palette.red,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "4px",
                        }}
                      >
                        <span>{short.priceChange >= 0 ? "▲" : "▼"}</span>
                        <span>{Math.abs(short.priceChange).toFixed(2)}%</span>
                      </div>
                    </div>

                    {/* Asset Badge + Duration - Bottom Right */}
                    <div
                      className="fade-in-up delay-3"
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        right: "28px",
                        textAlign: "right",
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          color: palette.amber,
                          fontWeight: 700,
                          letterSpacing: "1px",
                          marginBottom: "4px",
                        }}
                      >
                        {short.assetSymbol}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.65rem",
                          color: palette.paperDim,
                        }}
                      >
                        {short.duration}s
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right: What's Moving the Market */}
        <div>
          <WhatsMovingTheMarket initialLimit={5} mobileLimit={3} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 24px" }}>
        {/* Left Column: News Feed */}
        <div>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.3rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "16px" }}>
              MARKET NEWS
            </div>

            {newsLoading ? (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
                ○ SIGNAL ACQUIRING
              </div>
            ) : news.length === 0 ? (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim }}>
                ○ NO SIGNAL
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {news.map((article, idx) => (
                  <Link
                    key={idx}
                    href={`/news/${encodeURIComponent(article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`}
                    style={{
                      padding: "16px",
                      background: `${palette.panel}99`,
                      border: `1px solid ${palette.hairline}`,
                      textDecoration: "none",
                      display: "block",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = palette.amber;
                      el.style.background = `${palette.panel}dd`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = palette.hairline;
                      el.style.background = `${palette.panel}99`;
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.amberDim, marginBottom: "4px" }}>
                      {article.source.name} · {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontFamily: "var(--font-header)", fontSize: "0.9rem", fontWeight: 600, color: palette.paper, marginBottom: "6px" }}>
                      {article.title}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: palette.paperDim, lineHeight: 1.4 }}>
                      {article.description || "Read full story →"}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/news"
              style={{
                display: "inline-block",
                marginTop: "16px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.amber,
                textDecoration: "none",
                borderBottom: `1px solid ${palette.amber}44`,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.borderBottomColor = palette.amber;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.borderBottomColor = `${palette.amber}44`;
              }}
            >
              VIEW ALL NEWS →
            </Link>
          </div>
        </div>

      </div>

      {/* Asset Grid by Category */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {Object.entries(groupedByCategory).map(([category, categoryAssets]) => (
          <div key={category} style={{ marginBottom: "40px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.amberDim,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              ▸ {category}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              {categoryAssets.slice(0, 3).map((asset) => (
                <WarRoomCard key={asset.slug} slug={asset.slug} name={asset.name} symbol={asset.symbol} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
