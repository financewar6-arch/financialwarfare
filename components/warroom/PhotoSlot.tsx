import { CornerBrackets } from "./CornerBrackets";
import { palette } from "@/lib/warroom/palette";

export function PhotoSlot({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ position: "relative", height: "140px", marginBottom: "8px", background: palette.panel, border: `1px solid ${palette.hairline}` }}>
      <CornerBrackets color={color} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px", textAlign: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.paperDim }}>{label}</span>
      </div>
    </div>
  );
}
