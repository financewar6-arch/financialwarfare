import { WarRoom } from "@/components/warroom/WarRoom";
import { litecoinEditorial } from "@/content/litecoin";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Litecoin War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.litecoin;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={litecoinEditorial} />;
}
