import { WarRoom } from "@/components/warroom/WarRoom";
import { teslaEditorial } from "@/content/tesla";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Tesla War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.tesla;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={teslaEditorial} />;
}
