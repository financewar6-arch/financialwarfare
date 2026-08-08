import { PageShell } from "@/components/site/PageShell";
import { palette } from "@/lib/warroom/palette";

export const metadata = {
  title: "About — Financial Warfare",
};

export default function AboutPage() {
  return (
    <PageShell>
      <div style={{ marginBottom: "48px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "24px" }}>
          WHY FINANCIAL WARFARE EXISTS
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.8, color: palette.paper, marginBottom: "20px" }}>
          Most people are losing the battle for better decisions.
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.8, color: palette.paper, marginBottom: "20px" }}>
          Every morning, millions wake to market chaos—prices moving, assets shifting, opportunities missed. They read ten articles searching for one clear answer. They watch twenty-minute videos to find five minutes of insight. They lose.
        </div>
      </div>

      {/* Intro Video */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", border: `1px solid ${palette.amber}44` }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          >
            <source src="/video/Financial Warfare Intro.mp4" type="video/mp4" />
          </video>

          {/* Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(180deg, transparent 0%, ${palette.bg}99 100%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "48px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "24px" }}>
          WHO WE ARE
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.8, color: palette.paper, marginBottom: "20px" }}>
          We're a team of market professionals, traders, and analysts built to change that. We've spent years in the trenches—scalping, analysing, learning what actually matters when capital is on the line. We know that speed without clarity is noise. We know that most financial media reports what happened yesterday, not what it means for you today.
        </div>
      </div>

      <div style={{ marginBottom: "48px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em", marginBottom: "24px" }}>
          WHAT WE DO
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.8, color: palette.paper, marginBottom: "20px" }}>
          Financial Warfare does one thing: we transform scattered information into actionable intelligence. No fluff. No clickbait. No "10 stocks that might maybe possibly..." Just what happened, why it happened, why you should care, and what happens next. In one minute.
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.8, color: palette.paper, marginBottom: "20px" }}>
          We cover every asset that holds value—stocks, crypto, gold, luxury watches, diamonds, anything people invest in or store wealth in. Same treatment for every one: simple, fast, understandable.
        </div>
      </div>

      <div style={{ padding: "24px", borderLeft: `2px solid ${palette.amber}`, marginLeft: "4px", marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.1rem", color: palette.amber, marginBottom: "8px" }}>
          THIS IS HOW YOU WIN
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paperDim, lineHeight: 1.6 }}>
          Speed without clarity is noise. We deliver clarity first. Every asset. Every day. One minute.
        </div>
      </div>
    </PageShell>
  );
}
