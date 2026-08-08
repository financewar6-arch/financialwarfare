import { WarRoom } from "@/components/warroom/WarRoom";
import { xrpEditorial } from "@/content/xrp";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "XRP War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.xrp;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={xrpEditorial} />;
}
