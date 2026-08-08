import { WarRoom } from "@/components/warroom/WarRoom";
import { copperEditorial } from "@/content/copper";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Copper War Room — Financial Warfare",
};

export default function CopperWarRoom() {
  const asset = ASSETS.copper;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={copperEditorial} />;
}
