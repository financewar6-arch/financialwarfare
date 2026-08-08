export const darkPalette = {
  bg: "#0A0B07",
  panel: "#131409",
  amber: "#D99A3D",
  amberDim: "#7A5A26",
  paper: "#E8E3D3",
  paperDim: "#8B8574",
  green: "#5FA06B",
  red: "#C1503A",
  grid: "rgba(217,154,61,0.07)",
  hairline: "rgba(232,227,211,0.10)",
} as const;

export const lightPalette = {
  bg: "#FAFAF8",
  panel: "#F1EFE8",
  amber: "#C67C3D",
  amberDim: "#8B6A3D",
  paper: "#2A2520",
  paperDim: "#6B6560",
  green: "#3D6B4D",
  red: "#A84535",
  grid: "rgba(198, 124, 61, 0.06)",
  hairline: "rgba(42, 37, 32, 0.08)",
} as const;

export const palette = darkPalette;

export const RANGES = [
  { key: "1", label: "24H" },
  { key: "7", label: "7D" },
  { key: "30", label: "30D" },
] as const;

export function fmtUSD(n: number | null | undefined) {
  if (n == null) return "--";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function fmtCompact(n: number | null | undefined) {
  if (n == null) return "--";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}
