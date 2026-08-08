import { WarRoom } from "@/components/warroom/WarRoom";
import { visaContent } from "@/content/visa";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Visa War Room — Financial Warfare",
};

export default function VisaWarRoomPage() {
  const asset = ASSETS.visa;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={visaContent} />;
}
