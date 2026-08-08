import { WarRoom } from "@/components/warroom/WarRoom";
import { treasury10yEditorial } from "@/content/treasury10y";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "10-Year Treasury Yield War Room — Financial Warfare",
};

export default function Treasury10YWarRoom() {
  const asset = ASSETS.treasury10y;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={treasury10yEditorial} />;
}
