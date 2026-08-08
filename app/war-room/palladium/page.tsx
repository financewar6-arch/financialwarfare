import { WarRoom } from "@/components/warroom/WarRoom";
import { palladiumEditorial } from "@/content/palladium";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Palladium War Room — Financial Warfare",
};

export default function PalladiumWarRoom() {
  const asset = ASSETS.palladium;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={palladiumEditorial} />;
}
