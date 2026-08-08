import type { ReactNode } from "react";
import { palette } from "@/lib/warroom/palette";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: palette.bg,
        backgroundImage: `radial-gradient(ellipse 640px 420px at 50% 8%, rgba(217,154,61,0.09), transparent 70%), repeating-linear-gradient(0deg, ${palette.grid} 0px, ${palette.grid} 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, ${palette.grid} 0px, ${palette.grid} 1px, transparent 1px, transparent 32px)`,
        color: palette.paper,
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "680px" }}>{children}</div>
    </div>
  );
}
