import { WarRoom } from "@/components/warroom/WarRoom";
import { appleEditorial } from "@/content/apple";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Apple War Room — Financial Warfare",
};

export default function AppleWarRoomPage() {
  const asset = ASSETS.apple;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={appleEditorial} />;
}
