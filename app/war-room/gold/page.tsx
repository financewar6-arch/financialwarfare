import { WarRoom } from "@/components/warroom/WarRoom";
import { goldEditorial } from "@/content/gold";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Gold War Room — Financial Warfare",
};

export default function GoldWarRoomPage() {
  const asset = ASSETS.gold;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={goldEditorial} />;
}
