import { WarRoom } from "@/components/warroom/WarRoom";
import { walmartContent } from "@/content/walmart";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Walmart War Room — Financial Warfare",
};

export default function WalmartWarRoomPage() {
  const asset = ASSETS.walmart;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={walmartContent} />;
}
