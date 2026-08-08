import { WarRoom } from "@/components/warroom/WarRoom";
import { daxEditorial } from "@/content/dax";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "DAX War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.dax;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={daxEditorial} />;
}
