import React from "react";
import { Composition, AbsoluteFill, useVideoConfig, interpolate, Easing } from "remotion";

interface FinancialNewsProps {
  assetSymbol: string;
  assetName: string;
  headline: string;
  whyItMoved: string;
  priceChange: number;
  direction: "up" | "down";
}

export const FinancialNewsTemplate: React.FC<FinancialNewsProps> = ({
  assetSymbol,
  assetName,
  headline,
  whyItMoved,
  priceChange,
  direction,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const headlineChars = headline.length;
  const descChars = whyItMoved.length;

  // Typewriter animation for headline (frames 0-60)
  const headlineProgress = interpolate(
    Math.min(Math.max(0, 0), 60),
    [0, 60],
    [0, 1],
    { easing: Easing.linear() }
  );
  const visibleHeadlineChars = Math.floor(headlineProgress * headlineChars);

  // Typewriter animation for description (frames 60-180)
  const descProgress = interpolate(
    Math.min(Math.max(0, 0), 120),
    [0, 120],
    [0, 1],
    { easing: Easing.linear() }
  );
  const visibleDescChars = Math.floor(descProgress * descChars);

  // Animated chart bars (background)
  const bars = Array.from({ length: 20 }, (_, i) => {
    const barHeight = interpolate(
      (i * 30) % durationInFrames,
      [0, fps * 2],
      [10, 80],
      { easing: Easing.sine() }
    );
    return barHeight;
  });

  const priceColor = direction === "up" ? "#10b981" : "#ef4444";
  const bgColor = direction === "up" ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)";

  return (
    <AbsoluteFill style={{ background: "#0f172a" }}>
      {/* Animated chart background */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(to top, ${bgColor}, transparent)`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          padding: "0 20px",
          opacity: 0.6,
        }}
      >
        {bars.map((height, i) => (
          <div
            key={i}
            style={{
              width: "3%",
              height: `${height}%`,
              background: priceColor,
              borderRadius: "4px 4px 0 0",
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          color: "#f1f5f9",
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Asset Header */}
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#fbbf24",
              letterSpacing: "2px",
            }}
          >
            {assetSymbol}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#cbd5e1",
            }}
          >
            {assetName}
          </div>
        </div>

        {/* Animated Headline */}
        <div
          style={{
            fontSize: "42px",
            fontWeight: "700",
            lineHeight: "1.3",
            marginBottom: "24px",
            maxWidth: "80%",
            color: "#f1f5f9",
            height: "140px",
            minHeight: "140px",
          }}
        >
          {headline.substring(0, visibleHeadlineChars)}
          <span style={{ opacity: visibleHeadlineChars < headlineChars ? 1 : 0 }}>▌</span>
        </div>

        {/* Price Change Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
            fontSize: "28px",
            fontWeight: "600",
            color: priceColor,
          }}
        >
          <span>{direction === "up" ? "▲" : "▼"}</span>
          <span>{Math.abs(priceChange).toFixed(2)}%</span>
        </div>

        {/* Animated Description */}
        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#cbd5e1",
            maxWidth: "85%",
            marginTop: "20px",
            height: "80px",
            minHeight: "80px",
            fontWeight: "500",
          }}
        >
          {whyItMoved.substring(0, visibleDescChars)}
          <span style={{ opacity: visibleDescChars < descChars ? 1 : 0 }}>▌</span>
        </div>
      </div>

      {/* Duration watermark */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          fontSize: "12px",
          color: "rgba(241, 245, 249, 0.4)",
          fontFamily: "monospace",
        }}
      >
        45s
      </div>
    </AbsoluteFill>
  );
};

export default FinancialNewsTemplate;
