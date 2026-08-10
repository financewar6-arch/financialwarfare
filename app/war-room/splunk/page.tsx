import { WarRoom } from "@/components/warroom/WarRoom";
import { splunkEditorial } from "@/content/splunk";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Splunk War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.splunk;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={splunkEditorial} />;
}
