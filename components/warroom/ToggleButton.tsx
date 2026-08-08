import type { ReactNode } from "react";
import { palette } from "@/lib/warroom/palette";

export function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.06em",
        padding: "4px 10px",
        background: active ? palette.amberDim : "transparent",
        color: active ? palette.paper : palette.paperDim,
        border: `1px solid ${active ? palette.amberDim : palette.hairline}`,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
