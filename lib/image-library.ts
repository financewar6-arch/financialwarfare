// War Room Image Library
// Curated, licensed images for all asset types
// All images are CC0/CC-BY/public domain or licensed for commercial use

export interface ImageAsset {
  url: string;
  caption: string;
  attribution: string;
  license: "CC0" | "CC-BY" | "CC-BY-SA" | "Public Domain" | "Licensed" | "Company";
  altText: string;
}

export interface AssetImages {
  default: ImageAsset;
  earnings?: ImageAsset;
  announcement?: ImageAsset;
  product?: ImageAsset;
  facility?: ImageAsset;
}

export type AssetType = "stock" | "crypto" | "commodity" | "macro" | "luxury";

interface ImageLibraryData {
  stocks: Record<string, AssetImages>;
  crypto: Record<string, AssetImages>;
  commodities: Record<string, AssetImages>;
  macro: Record<string, AssetImages>;
  luxury: Record<string, AssetImages>;
}

export const imageLibrary: ImageLibraryData = {
  stocks: {
    NVDA: {
      default: {
        url: "https://images.unsplash.com/photo-1591290621749-8ae5f84e4fe0?w=800&q=80",
        caption: "Nvidia GPU Technology",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "NVDA stock — Nvidia GPU data center facility with advanced computing hardware",
      },
    },
    MSFT: {
      default: {
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        caption: "Microsoft Cloud Computing",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "MSFT stock — Microsoft cloud computing and AI technology",
      },
    },
    TSLA: {
      default: {
        url: "https://images.unsplash.com/photo-1560958089-b8a63dd52c3f?w=800&q=80",
        caption: "Tesla Electric Vehicle Technology",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "TSLA stock — Tesla electric vehicle and charging technology",
      },
    },
    AAPL: {
      default: {
        url: "https://images.unsplash.com/photo-1505980612986-d8505dad27b7?w=800&q=80",
        caption: "Apple Technology Innovation",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "AAPL stock — Apple consumer technology and innovation",
      },
    },
    AMZN: {
      default: {
        url: "https://images.unsplash.com/photo-1592238360612-60dd3730141c?w=800&q=80",
        caption: "Amazon Cloud Infrastructure",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "AMZN stock — Amazon AWS cloud computing data center",
      },
    },
    META: {
      default: {
        url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
        caption: "Meta Social Platform Technology",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "META stock — Meta social media and AI technology",
      },
    },
    GOOGL: {
      default: {
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        caption: "Google Search and AI Technology",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "GOOGL stock — Google search engine and AI infrastructure",
      },
    },
    NFLX: {
      default: {
        url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
        caption: "Netflix Streaming Technology",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "NFLX stock — Netflix streaming and content technology",
      },
    },
    DIS: {
      default: {
        url: "https://images.unsplash.com/photo-1489599849228-5e04541a2e56?w=800&q=80",
        caption: "Disney Entertainment Studio",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "DIS stock — Disney entertainment and theme park operations",
      },
    },
    JNJ: {
      default: {
        url: "https://images.unsplash.com/photo-1585432294174-e0e90c79e213?w=800&q=80",
        caption: "Johnson & Johnson Pharmaceutical Research",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "JNJ stock — Johnson & Johnson pharmaceutical and healthcare",
      },
    },
    KO: {
      default: {
        url: "https://images.unsplash.com/photo-1554866585-a5f87d49a5ef?w=800&q=80",
        caption: "Coca-Cola Beverage Production",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "KO stock — Coca-Cola beverage manufacturing and distribution",
      },
    },
    V: {
      default: {
        url: "https://images.unsplash.com/photo-1556742333812-6f3149bef7af?w=800&q=80",
        caption: "Visa Payment Processing",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "V stock — Visa payment processing and financial technology",
      },
    },
    MA: {
      default: {
        url: "https://images.unsplash.com/photo-1556742333812-6f3149bef7af?w=800&q=80",
        caption: "Mastercard Payment Network",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "MA stock — Mastercard payment network and fintech",
      },
    },
    WMT: {
      default: {
        url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80",
        caption: "Walmart Retail Operations",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "WMT stock — Walmart retail store operations and supply chain",
      },
    },
    BRK: {
      default: {
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        caption: "Berkshire Hathaway Finance",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "BRK stock — Berkshire Hathaway investment and insurance operations",
      },
    },
  },
  crypto: {
    BTC: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Bitcoin Blockchain Network",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "BTC stock — Bitcoin blockchain network visualization",
      },
    },
    ETH: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Ethereum Smart Contract Platform",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "ETH stock — Ethereum blockchain and smart contract technology",
      },
    },
    SOL: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Solana High-Speed Blockchain",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "SOL stock — Solana blockchain network and technology",
      },
    },
    XRP: {
      default: {
        url: "https://images.unsplash.com/photo-1606890737066-fe79bbe6ef60?w=800&q=80",
        caption: "Ripple Cross-Border Payments",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "XRP stock — Ripple blockchain cross-border payment network",
      },
    },
    ADA: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Cardano Academic Blockchain",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "ADA stock — Cardano blockchain platform",
      },
    },
    DOGE: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Dogecoin Cryptocurrency",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "DOGE stock — Dogecoin meme cryptocurrency",
      },
    },
    LTC: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Litecoin Blockchain",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "LTC stock — Litecoin peer-to-peer currency",
      },
    },
    DOT: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Polkadot Interoperable Blockchain",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "DOT stock — Polkadot multi-chain protocol",
      },
    },
    BNB: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Binance Coin Exchange Token",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "BNB stock — Binance Coin exchange and BSC token",
      },
    },
    BCH: {
      default: {
        url: "https://images.unsplash.com/photo-1605758912968-4286eba63526?w=800&q=80",
        caption: "Bitcoin Cash Cryptocurrency",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "BCH stock — Bitcoin Cash peer-to-peer payments",
      },
    },
  },
  commodities: {
    GOLD: {
      default: {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        caption: "Gold Bullion and Precious Metals",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "GOLD stock — Gold bullion and precious metals",
      },
    },
    NG: {
      default: {
        url: "https://images.unsplash.com/photo-1687345838396-620a4e4b7e7e?w=800&q=80",
        caption: "Natural Gas Production Facility",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "NG stock — Natural gas production and pipeline infrastructure",
      },
    },
    BRENT: {
      default: {
        url: "https://images.unsplash.com/photo-1687345838396-620a4e4b7e7e?w=800&q=80",
        caption: "Oil Refinery and Production",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "BRENT stock — Oil refinery and crude oil production facility",
      },
    },
    BZ: {
      default: {
        url: "https://images.unsplash.com/photo-1687345838396-620a4e4b7e7e?w=800&q=80",
        caption: "Brent Crude Oil Market",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "BZ — Brent crude oil global benchmark",
      },
    },
    HG: {
      default: {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        caption: "Copper Mining and Processing",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "HG stock — Copper mining and industrial metal processing",
      },
    },
    PA: {
      default: {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        caption: "Palladium Precious Metal",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "PA stock — Palladium precious metal and industrial use",
      },
    },
    SILVER: {
      default: {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        caption: "Silver Bullion and Precious Metals",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "SILVER — Silver bullion and precious metal",
      },
    },
    PLATINUM: {
      default: {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        caption: "Platinum Precious Metal",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "PLATINUM — Platinum precious metal and industrial use",
      },
    },
  },
  macro: {
    TNX: {
      default: {
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        caption: "Treasury Market and Government Bonds",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "TNX stock — US Treasury bonds and fixed income market",
      },
    },
    DXY: {
      default: {
        url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf35f?w=800&q=80",
        caption: "Global Currency Markets",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "DXY stock — US Dollar Index and global currency trading",
      },
    },
    IWM: {
      default: {
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        caption: "Russell 2000 Small-Cap Index",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "IWM — Russell 2000 small-cap stock market index",
      },
    },
    DIA: {
      default: {
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        caption: "Dow Jones Industrial Average",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "DIA — Dow Jones Industrial Average index",
      },
    },
    SPY: {
      default: {
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        caption: "S&P 500 Stock Index",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "SPY — S&P 500 large-cap stock market index",
      },
    },
    QQQ: {
      default: {
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        caption: "Nasdaq 100 Technology Index",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "QQQ — Nasdaq 100 technology stock index",
      },
    },
  },
  luxury: {
    ROLEX: {
      default: {
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
        caption: "Luxury Timepiece Collection",
        attribution: "Unsplash / Unsplash License",
        license: "CC0",
        altText: "ROLEX — Luxury watch and timepiece collection",
      },
    },
  },
};

export function getImageForAsset(
  assetType: AssetType,
  assetSymbol: string,
  eventType?: string
): ImageAsset | null {
  const typeKey = assetType as keyof ImageLibraryData;
  const library = imageLibrary[typeKey];

  if (!library) {
    return null;
  }

  // Normalize symbol: remove suffixes like -USD, =F, etc.
  const normalizedSymbol = assetSymbol.split(/[-=]/)[0].toUpperCase();
  const assetImages = library[normalizedSymbol];

  if (!assetImages) {
    return null;
  }

  // Try event-specific image first
  if (eventType && assetImages[eventType as keyof AssetImages]) {
    return assetImages[eventType as keyof AssetImages] || null;
  }

  // Fall back to default
  return assetImages.default || null;
}
