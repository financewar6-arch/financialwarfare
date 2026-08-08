import { WarRoom } from "@/components/warroom/WarRoom";
import { ethereumEditorial } from "@/content/ethereum";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Ethereum War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.ethereum;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={ethereumEditorial} />;
}
