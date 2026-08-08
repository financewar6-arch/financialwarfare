"use client";

import { AreaChart, Area, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { palette } from "@/lib/warroom/palette";
import type { HistoryPoint } from "@/lib/providers/types";
import { useState } from "react";

export function Oscilloscope({ history, color }: { history: HistoryPoint[]; color: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length < 2) {
    return (
      <div
        style={{
          height: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: palette.paperDim,
        }}
      >
        AWAITING SIGNAL...
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: palette.panel,
            border: `1px solid ${color}`,
            padding: "6px 8px",
            borderRadius: "2px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: palette.paper,
          }}
        >
          <div style={{ color: color, fontWeight: "bold" }}>${data.p.toFixed(2)}</div>
          <div style={{ color: palette.paperDim, fontSize: "0.65rem", marginTop: "2px" }}>
            {new Date(data.t).toLocaleTimeString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: "140px", filter: `drop-shadow(0 0 4px ${color}88)`, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={history}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
          onMouseMove={(state: any) => {
            if (state && state.activeTooltipIndex !== undefined) {
              setHoveredIndex(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="scopeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeDasharray: "5 5", strokeOpacity: 0.5 }} />
          <Area
            type="monotone"
            dataKey="p"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#scopeFill)"
            isAnimationActive={false}
            dot={
              hoveredIndex !== null
                ? {
                    r: 3,
                    fill: color,
                    stroke: palette.paper,
                    strokeWidth: 1.5,
                  }
                : false
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
