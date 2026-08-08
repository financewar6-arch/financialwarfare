import { PageShell } from "@/components/site/PageShell";
import { palette } from "@/lib/warroom/palette";

export const metadata = {
  title: "Luxury Assets — Financial Warfare",
};

export default function LuxuryPage() {
  return (
    <PageShell>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em" }}>
          LUXURY ASSETS
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim, marginTop: "4px" }}>
          Rolex · Diamonds · Fine Art · Jewellery
        </div>
      </div>

      <div style={{ padding: "32px", textAlign: "center", background: `${palette.panel}99`, border: `1px solid ${palette.hairline}` }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: palette.paperDim, marginBottom: "12px" }}>
          ○ FIELD COMING ONLINE
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: palette.paperDim, marginBottom: "16px" }}>
          Luxury watch and collectibles pricing — Rolex, diamonds, fine wine, jewellery — launches with manual updates. No free market data exists for these assets yet.
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.amberDim, fontStyle: "italic" }}>
          Coming in the Luxury expansion phase.
        </div>
      </div>
    </PageShell>
  );
}
