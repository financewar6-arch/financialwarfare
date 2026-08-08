import { WarRoom } from "@/components/warroom/WarRoom";
import { disneyContent } from "@/content/disney";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Disney War Room — Financial Warfare",
};

export default function DisneyWarRoomPage() {
  const asset = ASSETS.disney;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={disneyContent} />;
}
