import { WarRoom } from "@/components/warroom/WarRoom";
import { brentcrudeEditorial } from "@/content/brentcrudeoil";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "Brent Crude Oil War Room — Financial Warfare",
};

export default function BrentCrudeOilWarRoom() {
  const asset = ASSETS.brentcrudeoil;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={brentcrudeEditorial} />;
}
