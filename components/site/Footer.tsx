"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export function Footer() {
  const { palette } = useTheme();

  const SOCIAL_LINKS = [
    { name: "Twitter", icon: "𝕏", url: "https://twitter.com/financialwarfare" },
    { name: "Instagram", icon: "📸", url: "https://instagram.com/financialwarfare" },
    { name: "LinkedIn", icon: "💼", url: "https://linkedin.com/company/financialwarfare" },
    { name: "GitHub", icon: "🐙", url: "https://github.com/financialwarfare" },
    { name: "Discord", icon: "💬", url: "https://discord.gg/financialwarfare" },
  ];

  const FOOTER_LINKS = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Sitemap", href: "/api/discovery/sitemap" },
  ];

  return (
    <footer
      style={{
        background: palette.panel,
        borderTop: `1px solid ${palette.hairline}`,
        padding: "40px 20px 20px",
        marginTop: "60px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-header)",
                fontSize: "1rem",
                fontWeight: 700,
                color: palette.amber,
                marginBottom: "12px",
              }}
            >
              Financial Warfare
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: palette.paperDim,
                lineHeight: 1.6,
              }}
            >
              Real-time market intelligence. One-minute briefings. Understand what's moving.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.amber,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "12px",
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {FOOTER_LINKS.slice(0, 3).map((link) => (
                <li key={link.href} style={{ marginBottom: "8px" }}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: palette.paperDim,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = palette.paperDim;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.amber,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "12px",
              }}
            >
              Legal
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {FOOTER_LINKS.slice(2).map((link) => (
                <li key={link.href} style={{ marginBottom: "8px" }}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: palette.paperDim,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = palette.paperDim;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: palette.amber,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "12px",
              }}
            >
              Follow Us
            </h4>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    background: `${palette.bg}`,
                    border: `1px solid ${palette.hairline}`,
                    borderRadius: "4px",
                    color: palette.paper,
                    textDecoration: "none",
                    fontSize: "1.2rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.amber;
                    (e.currentTarget as HTMLAnchorElement).style.color = palette.amber;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = palette.hairline;
                    (e.currentTarget as HTMLAnchorElement).style.color = palette.paper;
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            borderTop: `1px solid ${palette.hairline}`,
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: palette.paperDim,
              margin: 0,
            }}
          >
            © 2026 Financial Warfare. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: palette.paperDim,
              margin: 0,
            }}
          >
            Markets never close. Neither do we.
          </p>
        </div>
      </div>
    </footer>
  );
}
