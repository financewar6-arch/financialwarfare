import { WarRoom } from "@/components/warroom/WarRoom";
import { bitcoincashEditorial } from "@/content/bitcoincash";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Bitcoin Cash War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.bitcoincash;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={bitcoincashEditorial} />;
}
