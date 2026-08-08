import { WarRoom } from "@/components/warroom/WarRoom";
import { usdollarEditorial } from "@/content/usdollar";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "US Dollar Index War Room — Financial Warfare",
};

export default function USDollarWarRoom() {
  const asset = ASSETS.usdollar;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={usdollarEditorial} />;
}
