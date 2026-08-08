import { WarRoom } from "@/components/warroom/WarRoom";
import { cocaContent } from "@/content/coca";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Coca-Cola War Room — Financial Warfare",
};

export default function CocaWarRoomPage() {
  const asset = ASSETS.coca;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={cocaContent} />;
}
