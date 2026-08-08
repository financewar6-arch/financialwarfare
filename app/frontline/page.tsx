"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { EventGrid } from "@/components/frontline/EventGrid";
import { MarketRegimeWidget } from "@/components/frontline/MarketRegimeWidget";
import { DailyBriefing } from "@/components/frontline/DailyBriefing";
import { InteractiveEconomicCalendar } from "@/components/site/InteractiveEconomicCalendar";
import { palette } from "@/lib/warroom/palette";
import type { FrontLineEvent, MarketRegimeSnapshot } from "@/lib/frontline";

export default function FrontLine() {
  const [events, setEvents] = useState<FrontLineEvent[]>([]);
  const [regime, setRegime] = useState<MarketRegimeSnapshot | null>(null);
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch events and regime in parallel
        const [eventsRes, regimeRes, briefingRes] = await Promise.all([
          fetch("/api/frontline/events"),
          fetch("/api/frontline/regime"),
          fetch("/api/frontline/briefing"),
        ]);

        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }

        if (regimeRes.ok) {
          const data = await regimeRes.json();
          setRegime(data.regime || null);
        }

        if (briefingRes.ok) {
          const data = await briefingRes.json();
          setBriefing(data.briefing?.summary || "Unable to generate briefing.");
        }
      } catch (error) {
        console.error("Failed to fetch front line data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.4rem", color: palette.amber, letterSpacing: "0.08em" }}>
          THE FRONT LINE
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim, marginTop: "4px" }}>
          What's important RIGHT NOW across the markets — live event detection & market regime
        </div>
      </div>

      {/* Market Regime */}
      <div style={{ marginBottom: "32px" }}>
        {regime ? <MarketRegimeWidget regime={regime} /> : null}
      </div>

      {/* Daily Briefing */}
      <div style={{ marginBottom: "32px" }}>
        <DailyBriefing summary={briefing} loading={loading} />
      </div>

      {/* Events Grid */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
          ▸ Top Events ({events.length > 0 ? `${Math.min(events.length, 20)} detected` : "scanning"})
        </div>
        <EventGrid events={events} loading={loading} />
      </div>

      {/* Economic Calendar */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: palette.amberDim, letterSpacing: "0.1em", marginBottom: "12px", textTransform: "uppercase" }}>
          ▸ Economic Events
        </div>
        <InteractiveEconomicCalendar defaultAssets={["spy", "qqq", "bitcoin"]} />
      </div>

      {/* Refresh info */}
      <div style={{ textAlign: "center", padding: "20px 0", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: palette.paperDim }}>
        REFRESH 60S
      </div>
    </PageShell>
  );
}
