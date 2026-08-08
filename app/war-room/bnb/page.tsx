import { WarRoom } from "@/components/warroom/WarRoom";
import { bnbEditorial } from "@/content/bnb";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Binance Coin War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.bnb;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={bnbEditorial} />;
}
