import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing } from "remotion";

interface MarketMovesTemplateProps {
  assetSymbol: string;
  assetName: string;
  priceChange: number;
  hook: string;
  what: string;
  why: string;
  significance: string;
  watchNext: string;
  cta: string;
}

const palette = {
  bg: "#0a0a0a",
  paper: "#e8e8e8",
  paperDim: "#999999",
  amber: "#d4a574",
  green: "#4ade80",
  red: "#f87171",
  panel: "#1a1a1a",
};

export const MarketMovesTemplate: React.FC<MarketMovesTemplateProps> = ({
  assetSymbol,
  assetName,
  priceChange,
  hook,
  what,
  why,
  significance,
  watchNext,
  cta,
}) => {
  const frame = useCurrentFrame();
  const direction = priceChange >= 0 ? "up" : "down";
  const color = priceChange >= 0 ? palette.green : palette.red;

  return (
    <AbsoluteFill style={{ background: palette.bg, color: palette.paper, fontFamily: "monospace" }}>
      {/* Header: Asset Symbol + Price Change (frames 0-30) */}
      <Sequence from={0} durationInFrames={30}>
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "20px",
            opacity: interpolate(frame, [0, 10, 20, 30], [0, 1, 1, 0], {
              easing: Easing.ease,
            }),
          }}
        >
          <div style={{ fontSize: "80px", fontWeight: "bold" }}>{assetSymbol}</div>
          <div style={{ fontSize: "60px", color, fontWeight: "bold" }}>
            {direction === "up" ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Hook (frames 30-90) */}
      <Sequence from={30} durationInFrames={60}>
        <TextSlide text={hook} />
      </Sequence>

      {/* What Happened (frames 90-150) */}
      <Sequence from={90} durationInFrames={60}>
        <TextSlide text={what} />
      </Sequence>

      {/* Why It Matters (frames 150-210) */}
      <Sequence from={150} durationInFrames={60}>
        <TextSlide text={significance} />
      </Sequence>

      {/* Watch Next (frames 210-270) */}
      <Sequence from={210} durationInFrames={60}>
        <TextSlide text={watchNext} />
      </Sequence>

      {/* CTA + Branding (frames 270-300) */}
      <Sequence from={270} durationInFrames={30}>
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "30px",
            opacity: interpolate(frame - 270, [0, 5, 20, 30], [0, 1, 1, 0], {
              easing: Easing.ease,
            }),
          }}
        >
          <div style={{ fontSize: "36px", color: palette.amber, fontWeight: "bold" }}>
            {cta}
          </div>
          <div style={{ fontSize: "24px", color: palette.paperDim }}>Financial Warfare</div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

interface TextSlideProps {
  text: string;
}

const TextSlide: React.FC<TextSlideProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 5, 50, 60], [0, 1, 1, 0], {
    easing: Easing.ease,
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: "40px",
          lineHeight: "1.5",
          textAlign: "center",
          maxWidth: "800px",
          color: palette.paper,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
