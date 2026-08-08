import { WarRoom } from "@/components/warroom/WarRoom";
import { metaEditorial } from "@/content/meta";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Meta War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.meta;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={metaEditorial} />;
}
