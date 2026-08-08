import { WarRoom } from "@/components/warroom/WarRoom";
import { nasdaqEditorial } from "@/content/nasdaq";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Nasdaq War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.nasdaq;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={nasdaqEditorial} />;
}
