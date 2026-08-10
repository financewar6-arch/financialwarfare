import { WarRoom } from "@/components/warroom/WarRoom";
import { fastlyEditorial } from "@/content/fastly";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Fastly War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.fastly;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={fastlyEditorial} />;
}
