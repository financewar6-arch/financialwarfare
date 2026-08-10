import { WarRoom } from "@/components/warroom/WarRoom";
import { broadcomEditorial } from "@/content/broadcom";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Broadcom War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.broadcom;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={broadcomEditorial} />;
}
