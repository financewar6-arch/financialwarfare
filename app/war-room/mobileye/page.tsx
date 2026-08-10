import { WarRoom } from "@/components/warroom/WarRoom";
import { mobileyeEditorial } from "@/content/mobileye";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Mobileye War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.mobileye;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={mobileyeEditorial} />;
}
