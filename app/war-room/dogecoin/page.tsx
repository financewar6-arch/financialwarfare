import { WarRoom } from "@/components/warroom/WarRoom";
import { dogecoinEditorial } from "@/content/dogecoin";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Dogecoin War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.dogecoin;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={dogecoinEditorial} />;
}
