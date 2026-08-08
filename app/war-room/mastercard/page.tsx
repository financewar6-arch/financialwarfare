import { WarRoom } from "@/components/warroom/WarRoom";
import { mastercardContent } from "@/content/mastercard";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Mastercard War Room — Financial Warfare",
};

export default function MastercardWarRoomPage() {
  const asset = ASSETS.mastercard;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={mastercardContent} />;
}
