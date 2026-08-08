import { WarRoom } from "@/components/warroom/WarRoom";
import { ASSETS } from "@/lib/assets";

export const metadata = {
  title: "S&P 500 War Room — Financial Warfare",
};

const sp500Content = `
> TACTICAL OVERVIEW: The S&P 500 is the broadest US equity index — 500 large-cap companies across all sectors. This is the macro barometer: Fed policy, earnings, and growth expectations drive the index.

> SECTOR ROTATION: Tech (mega-cap), Financials (rate sensitive), Energy (commodity driven), Healthcare (defensive). Watch which sectors lead/lag for regime clues.

> WATCH: Earnings season, Fed meetings, employment reports, consumer spending, corporate guidance on AI investments and capex.
`;

export default function SP500WarRoomPage() {
  const asset = ASSETS.sp500;
  return <WarRoom assetSlug={asset.slug} name={asset.name} symbol={asset.symbol} editorial={sp500Content} />;
}
