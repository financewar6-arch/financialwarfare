import { WarRoom } from "@/components/warroom/WarRoom";
import { shopifyEditorial } from "@/content/shopify";
import { ASSETS } from "@/lib/assets";

export const metadata = { title: "Shopify War Room — Financial Warfare" };

export default function Page() {
  const asset = ASSETS.shopify;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={shopifyEditorial} />;
}
