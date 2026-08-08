import { WarRoom } from "@/components/warroom/WarRoom";
import { microsoftEditorial } from "@/content/microsoft";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Microsoft War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.microsoft;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={microsoftEditorial} />;
}
