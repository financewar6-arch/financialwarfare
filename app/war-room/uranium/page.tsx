import { WarRoom } from "@/components/warroom/WarRoom";
import { uraniumEditorial } from "@/content/uranium";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Uranium ETF War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.uranium;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={uraniumEditorial} />;
}
