import { getMacroIndicators } from "@/lib/providers/fred";

export async function GET() {
  const indicators = await getMacroIndicators();
  return Response.json({ indicators });
}
