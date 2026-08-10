import { WarRoom } from "@/components/warroom/WarRoom";
import { aristaEditorial } from "@/content/arista";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Arista Networks War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.arista;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={aristaEditorial} />;
}
