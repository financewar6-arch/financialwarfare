import { WarRoom } from "@/components/warroom/WarRoom";
import { jnjContent } from "@/content/jnj";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Johnson & Johnson War Room — Financial Warfare",
};

export default function JnjWarRoomPage() {
  const asset = ASSETS.jnj;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={jnjContent} />;
}
