import { WarRoom } from "@/components/warroom/WarRoom";
import { silverEditorial } from "@/content/silver";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Silver War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.silver;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={silverEditorial} />;
}
