import { WarRoom } from "@/components/warroom/WarRoom";
import { russell2000Editorial } from "@/content/russell2000";
import { ASSETS } from "@/lib/assets";
import { loadEditorialContent } from "@/lib/editorial-loader";

export const metadata = {
  title: "Russell 2000 War Room — Financial Warfare",
};

export default async function Russell2000WarRoomPage() {
  const asset = ASSETS.russell2000;
  const editorial = await loadEditorialContent(asset.slug, russell2000Editorial);
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={editorial} />;
}
