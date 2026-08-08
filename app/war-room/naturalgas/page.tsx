import { WarRoom } from "@/components/warroom/WarRoom";
import { naturalgasEditorial } from "@/content/naturalgas";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Natural Gas War Room — Financial Warfare",
};

export default function NaturalGasWarRoom() {
  const asset = ASSETS.naturalgas;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={naturalgasEditorial} />;
}
