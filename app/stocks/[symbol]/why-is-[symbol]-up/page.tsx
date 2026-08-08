import { Metadata } from "next";
import Link from "next/link";
import { getRecentEvents, getPublishedEvents } from "@/lib/db";
import { ASSETS } from "@/lib/assets";
import { palette } from "@/lib/warroom/palette";
import { PageShell } from "@/components/site/PageShell";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { symbol } = await params;
  const asset = Object.values(ASSETS).find((a) => a.symbol.split("-")[0] === symbol.toUpperCase());

  if (!asset) {
    return {
      title: "Asset Not Found",
      description: "This asset was not found in our database.",
    };
  }

  // Get recent event for this asset
  const events = getPublishedEvents(100);
  const event = events.find((e) => e.assetSymbol === asset.symbol && e.priceChange > 0);

  if (!event || event.importanceScore < 60) {
    return {
      title: `${symbol.toUpperCase()} | Financial Warfare`,
      description: "No significant recent moves for this asset.",
    };
  }

  return {
    title: `Why is ${symbol.toUpperCase()} up today? | Financial Warfare`,
    description: event.headline,
    openGraph: {
      title: `${symbol.toUpperCase()} ↑ ${event.priceChange.toFixed(2)}%`,
      description: event.headline,
      type: "article",
      publishedTime: new Date(event.publishedAt || Date.now()).toISOString(),
    },
    twitter: {
      title: `${symbol.toUpperCase()} up ${event.priceChange.toFixed(2)}%`,
      description: event.headline,
      card: "summary",
    },
    robots: {
      index: event.importanceScore >= 60,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  const events = getPublishedEvents(100);
  return events
    .filter((e) => e.priceChange > 0 && e.assetType === "stock")
    .map((e) => ({
      symbol: e.assetSymbol.split("-")[0].toLowerCase(),
    }))
    .slice(0, 50); // Limit to prevent build explosion
}

export default async function WhyIsSymbolUpPage({ params }: PageProps) {
  const { symbol } = await params;
  const asset = Object.values(ASSETS).find((a) => a.symbol.split("-")[0] === symbol.toUpperCase());

  if (!asset) {
    return (
      <PageShell>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <h1 style={{ color: palette.paperDim }}>Asset Not Found</h1>
          <p style={{ color: palette.paperDim }}>Return to War Rooms</p>
          <Link href="/war-room" style={{ color: palette.amber }}>
            Browse All Assets →
          </Link>
        </div>
      </PageShell>
    );
  }

  const events = getPublishedEvents(100);
  const event = events.find((e) => e.assetSymbol === asset.symbol && e.priceChange > 0);

  if (!event || event.importanceScore < 60) {
    return (
      <PageShell>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
          <h1 style={{ color: palette.paperDim }}>No Significant Recent Move</h1>
          <p style={{ color: palette.paperDim }}>
            {asset.name} hasn't had a noteworthy move recently. Check back for updates.
          </p>
          <Link href={`/war-room/${asset.slug}`} style={{ color: palette.amber }}>
            View {asset.name} War Room →
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Headline */}
        <h1 style={{ fontSize: "2.2rem", fontWeight: 600, color: palette.paper, marginBottom: "8px" }}>
          Why is {asset.symbol} up today?
        </h1>

        {/* Price Box */}
        <div
          style={{
            background: palette.panel,
            border: `1px solid ${palette.hairline}`,
            padding: "20px",
            marginBottom: "24px",
            borderRadius: "2px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "8px" }}>
            <div style={{ fontSize: "2.8rem", fontWeight: 700, color: palette.paper }}>
              ${event.openPrice?.toFixed(2) || "—"}
            </div>
            <div style={{ fontSize: "1.4rem", color: palette.green, fontWeight: 600 }}>
              ↑ {event.priceChange.toFixed(2)}%
            </div>
          </div>
          <div style={{ color: palette.paperDim, fontSize: "0.9rem" }}>
            {asset.name} · {new Date(event.publishedAt || Date.now()).toLocaleString()}
          </div>
        </div>

        {/* Why It Moved */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "12px" }}>
            Why it moved
          </h2>
          <p style={{ color: palette.paper, lineHeight: 1.6, fontSize: "1rem" }}>{event.whyItMoved}</p>
        </section>

        {/* Why It Matters */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "12px" }}>
            Why it matters
          </h2>
          <p style={{ color: palette.paper, lineHeight: 1.6, fontSize: "1rem" }}>{event.whyItMatters}</p>
        </section>

        {/* Market Context */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "12px" }}>
            Market context
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div style={{ background: palette.panel, padding: "16px", borderRadius: "2px" }}>
              <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                {asset.name}
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.green }}>
                {event.priceChange >= 0 ? "+" : ""}{event.priceChange.toFixed(2)}%
              </div>
            </div>
            {event.volumeRatio && (
              <div style={{ background: palette.panel, padding: "16px", borderRadius: "2px" }}>
                <div style={{ color: palette.paperDim, fontSize: "0.85rem", marginBottom: "4px" }}>
                  Volume
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber }}>
                  {(event.volumeRatio * 100).toFixed(0)}% of avg
                </div>
              </div>
            )}
          </div>
        </section>

        {/* What to Watch */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "12px" }}>
            What to watch next
          </h2>
          <p style={{ color: palette.paper, lineHeight: 1.6, fontSize: "1rem" }}>{event.whatToWatch}</p>
        </section>

        {/* Related News */}
        {event.relatedNews && event.relatedNews.length > 0 && (
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: palette.amber, marginBottom: "12px" }}>
              Related news
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {event.relatedNews.slice(0, 3).map((article, idx) => (
                <a
                  key={idx}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: palette.panel,
                    padding: "16px",
                    borderRadius: "2px",
                    textDecoration: "none",
                    color: palette.paper,
                    borderLeft: `3px solid ${palette.amber}`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = `${palette.panel}dd`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = palette.panel;
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>{article.title}</div>
                  <div style={{ fontSize: "0.85rem", color: palette.paperDim }}>
                    {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div
          style={{
            background: `${palette.amber}11`,
            border: `1px solid ${palette.amber}44`,
            padding: "24px",
            borderRadius: "2px",
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: palette.paper, marginBottom: "12px" }}>
            Want the full intelligence briefing?
          </h3>
          <Link
            href={`/war-room/${asset.slug}`}
            style={{
              display: "inline-block",
              background: palette.amber,
              color: palette.bg,
              padding: "12px 24px",
              borderRadius: "2px",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            }}
          >
            Open {asset.name} War Room →
          </Link>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: `1px solid ${palette.hairline}` }}>
          <div style={{ fontSize: "0.85rem", color: palette.paperDim }}>
            Last updated {new Date(event.publishedAt || Date.now()).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.8rem", color: palette.amberDim, marginTop: "8px" }}>
            Financial Warfare • Intelligence briefings updated every minute
          </div>
        </div>
      </div>
    </PageShell>
  );
}
