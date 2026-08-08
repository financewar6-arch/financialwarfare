import { WarRoom } from "@/components/warroom/WarRoom";
import { crudeoilEditorial } from "@/content/crudeoil";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Crude Oil War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.crudeoil;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={crudeoilEditorial} />;
}
