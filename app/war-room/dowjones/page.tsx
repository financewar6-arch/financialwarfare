import { WarRoom } from "@/components/warroom/WarRoom";
import { dowjonesEditorial } from "@/content/dowjones";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Dow Jones War Room — Financial Warfare",
};

export default function DowJonesWarRoom() {
  const asset = ASSETS.dowjones;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={dowjonesEditorial} />;
}
