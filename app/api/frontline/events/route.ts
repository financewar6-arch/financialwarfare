import { detectAndScoreEvents } from "@/lib/frontline";

export async function GET() {
  try {
    const events = await detectAndScoreEvents();
    return Response.json({ events });
  } catch (error) {
    console.error("Event detection API error:", error);
    return Response.json({ events: [], error: "Event detection unavailable" }, { status: 502 });
  }
}
