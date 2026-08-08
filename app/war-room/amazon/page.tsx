import { WarRoom } from "@/components/warroom/WarRoom";
import { amazonEditorial } from "@/content/amazon";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Amazon War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.amazon;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={amazonEditorial} />;
}
