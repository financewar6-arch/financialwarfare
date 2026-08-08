import { WarRoom } from "@/components/warroom/WarRoom";
import { polkadotEditorial } from "@/content/polkadot";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Polkadot War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.polkadot;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={polkadotEditorial} />;
}
