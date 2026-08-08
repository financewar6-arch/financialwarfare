import { WarRoom } from "@/components/warroom/WarRoom";
import { bitcoinEditorial } from "@/content/bitcoin";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Bitcoin War Room — Financial Warfare",
};

export default function BitcoinWarRoomPage() {
  const asset = ASSETS.bitcoin;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={bitcoinEditorial} />;
}
