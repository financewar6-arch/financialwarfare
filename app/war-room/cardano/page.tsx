import { WarRoom } from "@/components/warroom/WarRoom";
import { cardanoEditorial } from "@/content/cardano";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Cardano War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.cardano;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={cardanoEditorial} />;
}
