import { WarRoom } from "@/components/warroom/WarRoom";
import { palantirEditorial } from "@/content/palantir";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Palantir War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.palantir;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={palantirEditorial} />;
}
