import { WarRoom } from "@/components/warroom/WarRoom";
import { rippleEditorial } from "@/content/ripple";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Ripple War Room — Financial Warfare",
};

export default function RippleWarRoom() {
  const asset = ASSETS.xrp;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={rippleEditorial} />;
}
