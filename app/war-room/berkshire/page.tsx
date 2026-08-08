import { WarRoom } from "@/components/warroom/WarRoom";
import { berkshireEditorial } from "@/content/berkshire";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Berkshire Hathaway War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.berkshire;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={berkshireEditorial} />;
}
