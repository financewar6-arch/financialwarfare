import { WarRoom } from "@/components/warroom/WarRoom";
import { alphabetEditorial } from "@/content/alphabet";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Alphabet War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.alphabet;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={alphabetEditorial} />;
}
