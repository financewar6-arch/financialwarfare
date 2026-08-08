import { WarRoom } from "@/components/warroom/WarRoom";
import { platinumContent } from "@/content/platinum";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Platinum War Room — Financial Warfare",
};

export default function PlatinumWarRoomPage() {
  const asset = ASSETS.platinum;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={platinumContent} />;
}
