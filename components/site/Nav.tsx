"use client";

import { useState } from "react";
import Link from "next/link";
import { palette } from "@/lib/warroom/palette";
import { ASSETS } from "@/lib/assets";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme-context";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/frontline", label: "THE FRONT LINE" },
  { href: "/war-room", label: "WAR ROOMS", hasSubmenu: true },
  { href: "/news", label: "NEWS" },
  { href: "/markets", label: "MARKETS" },
  { href: "/luxury", label: "LUXURY" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<(typeof ASSETS)[keyof typeof ASSETS][]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = Array.from(new Set(Object.values(ASSETS).map((a) => a.category))).sort();
  const assetsByCategory = categories.reduce(
    (acc, cat) => {
      acc[cat] = Object.values(ASSETS).filter((a) => a.category === cat);
      return acc;
    },
    {} as Record<string, typeof ASSETS[keyof typeof ASSETS][]>
  );


  return (
    <div>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: palette.bg,
        borderBottom: `1px solid ${palette.hairline}`,
        padding: "8px 20px",
        display: "flex",
        gap: "24px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
        <img
          src="/images/lockup-dark.png"
          alt="Financial Warfare"
          style={{ height: "56px", width: "auto" }}
        />
      </Link>

      {/* Hamburger Menu - Mobile Only */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          flexDirection: "column",
          gap: "6px",
          marginLeft: "auto",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = "1";
        }}
      >
        <div style={{ width: "24px", height: "2px", background: palette.paper }}></div>
        <div style={{ width: "24px", height: "2px", background: palette.paper }}></div>
        <div style={{ width: "24px", height: "2px", background: palette.paper }}></div>
      </button>

      {/* Left: Nav Links - Desktop Only */}
      <div className="nav-desktop" style={{ display: "flex", gap: "24px" }}>
      {NAV_ITEMS.map((item) => (
        <div
          key={item.href}
          style={{ position: "relative" }}
          onMouseEnter={() => item.hasSubmenu && setHoveredMenu(item.href)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          <Link
            href={item.href}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              color: hoveredMenu === item.href ? palette.amber : palette.paperDim,
              textDecoration: "none",
              transition: "color 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.color = palette.amber;
            }}
            onMouseLeave={(e) => {
              if (hoveredMenu !== item.href) {
                (e.target as HTMLAnchorElement).style.color = palette.paperDim;
              }
            }}
          >
            {item.label}
          </Link>

          {/* Submenu for WAR ROOMS */}
          {item.hasSubmenu && hoveredMenu === item.href && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: palette.bg,
                border: `1px solid ${palette.hairline}`,
                borderTop: "none",
                padding: "8px 0",
                minWidth: "180px",
                marginTop: "-1px",
              }}
            >
              {categories.map((category) => (
                <div key={category}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: palette.amberDim,
                      letterSpacing: "0.08em",
                      padding: "8px 16px 4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {category}
                  </div>
                  {assetsByCategory[category].map((asset) => (
                    <Link
                      key={asset.slug}
                      href={`/war-room/${asset.slug}`}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        color: palette.paperDim,
                        textDecoration: "none",
                        display: "block",
                        padding: "6px 16px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLAnchorElement).style.color = palette.amber;
                        (e.target as HTMLAnchorElement).style.background = `${palette.panel}99`;
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLAnchorElement).style.color = palette.paperDim;
                        (e.target as HTMLAnchorElement).style.background = "transparent";
                      }}
                    >
                      {asset.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      </div>


      {/* Right: Portfolio, Theme Toggle & Sign In */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Link
          href="/portfolio"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            color: palette.paperDim,
            textDecoration: "none",
            transition: "color 0.2s",
            padding: "6px 12px",
            border: `1px solid ${palette.hairline}`,
            borderRadius: "2px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.amber;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = palette.paperDim;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.hairline;
          }}
        >
          PORTFOLIO
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            color: palette.paperDim,
            background: "transparent",
            border: `1px solid ${palette.hairline}`,
            padding: "6px 10px",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = palette.amber;
            (e.currentTarget as HTMLButtonElement).style.borderColor = palette.amber;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = palette.paperDim;
            (e.currentTarget as HTMLButtonElement).style.borderColor = palette.hairline;
          }}
        >
          {theme === "dark" ? "☀" : "🌙"}
        </button>

        <button
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            color: palette.paper,
            background: palette.amber,
            border: "none",
            padding: "6px 16px",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
        >
          SIGN IN
        </button>
      </div>

      {/* Mobile Menu - Expands below navbar */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: palette.panel,
            borderBottom: `1px solid ${palette.hairline}`,
            flexDirection: "column",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  color: palette.paperDim,
                  textDecoration: "none",
                  display: "block",
                  padding: "12px 20px",
                  borderBottom: `1px solid ${palette.hairline}`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${palette.bg}99`;
                  (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = palette.paperDim;
                }}
              >
                {item.label}
              </Link>

              {/* Mobile Submenu for WAR ROOMS */}
              {item.hasSubmenu && (
                <div style={{ background: palette.bg, paddingLeft: "10px" }}>
                  {categories.map((category) => (
                    <div key={category}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6rem",
                          color: palette.amberDim,
                          letterSpacing: "0.08em",
                          padding: "8px 16px 4px",
                          textTransform: "uppercase",
                        }}
                      >
                        {category}
                      </div>
                      {assetsByCategory[category].map((asset) => (
                        <Link
                          key={asset.slug}
                          href={`/war-room/${asset.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: palette.paperDim,
                            textDecoration: "none",
                            display: "block",
                            padding: "6px 20px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color = palette.paperDim;
                          }}
                        >
                          {asset.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
