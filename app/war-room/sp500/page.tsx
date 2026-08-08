import { WarRoom } from "@/components/warroom/WarRoom";
import { sp500Editorial } from "@/content/sp500";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "S&P 500 War Room — Financial Warfare",
};

export default function SP500WarRoomPage() {
  const asset = ASSETS.sp500;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={sp500Editorial} />;
}
