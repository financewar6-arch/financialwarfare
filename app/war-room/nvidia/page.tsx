import { WarRoom } from "@/components/warroom/WarRoom";
import { nvidiaEditorial } from "@/content/nvidia";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Nvidia War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.nvidia;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={nvidiaEditorial} />;
}
