import { palette } from "@/lib/warroom/palette";

export function SentimentGauge({ change }: { change: number }) {
  const clamped = Math.max(-8, Math.min(8, change || 0));
  const angle = (clamped / 8) * 85;
  const color = clamped >= 0 ? palette.green : palette.red;
  const w = 210,
    h = 118,
    cx = w / 2,
    cy = 108,
    r = 92;

  return (
    <div style={{ position: "relative", width: w, height: h + 4 }}>
      <svg width={w} height={h + 4} viewBox={`0 0 ${w} ${h + 4}`}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.red} />
            <stop offset="50%" stopColor={palette.amberDim} />
            <stop offset="100%" stopColor={palette.green} />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.85"
        />
        {[-85, -42.5, 0, 42.5, 85].map((a, i) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const tx1 = cx + (r + 8) * Math.cos(rad);
          const ty1 = cy + (r + 8) * Math.sin(rad);
          const tx2 = cx + (r + 15) * Math.cos(rad);
          const ty2 = cy + (r + 15) * Math.sin(rad);
          return <line key={i} x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={palette.paperDim} strokeWidth="1" opacity="0.5" />;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: "50%",
          width: 2,
          height: r - 14,
          background: `linear-gradient(to top, ${color}, transparent)`,
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${angle}deg)`,
          boxShadow: `0 0 6px ${color}`,
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          width: 8,
          height: 8,
          background: color,
          borderRadius: "50%",
          transform: "translateX(-50%)",
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -2,
          left: 4,
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: palette.red,
          letterSpacing: "0.05em",
        }}
      >
        BEAR
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -2,
          right: 4,
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: palette.green,
          letterSpacing: "0.05em",
        }}
      >
        BULL
      </div>
    </div>
  );
}
