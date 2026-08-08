import { WarRoom } from "@/components/warroom/WarRoom";
import { solanaEditorial } from "@/content/solana";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Solana War Room — Financial Warfare",
};

export default function SolanaWarRoom() {
  const asset = ASSETS.solana;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={solanaEditorial} />;
}
