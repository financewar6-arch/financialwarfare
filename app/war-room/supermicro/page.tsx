import { WarRoom } from "@/components/warroom/WarRoom";
import { supermicroEditorial } from "@/content/supermicro";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Super Micro Computer War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.supermicro;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={supermicroEditorial} />;
}
