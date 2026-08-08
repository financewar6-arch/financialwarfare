"use client";

import { PageShell } from "@/components/site/PageShell";
import { palette } from "@/lib/warroom/palette";

export default function ContactPage() {
  return (
    <PageShell>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em" }}>
          CONTACT
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim, marginTop: "4px" }}>
          Reach out with feedback, stories, or ideas
        </div>
      </div>

      <div style={{ padding: "24px", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}` }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.amberDim, letterSpacing: "0.05em", marginBottom: "12px" }}>
          EMAIL
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: palette.paper }}>
          <a
            href="mailto:contact@example.com"
            style={{
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
            contact@example.com
          </a>
        </div>
      </div>
    </PageShell>
  );
}
