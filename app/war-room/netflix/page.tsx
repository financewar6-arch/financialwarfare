import { WarRoom } from "@/components/warroom/WarRoom";
import { netflixContent } from "@/content/netflix";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Netflix War Room — Financial Warfare",
};

export default function NetflixWarRoomPage() {
  const asset = ASSETS.netflix;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={netflixContent} />;
}
