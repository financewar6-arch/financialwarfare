import { WarRoom } from "@/components/warroom/WarRoom";
import { arkkEditorial } from "@/content/arkk";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "ARK Innovation ETF War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.arkk;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={arkkEditorial} />;
}
