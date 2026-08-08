"use client";

import { useState } from "react";
import { getImageForAsset, ImageAsset, AssetType } from "@/lib/image-library";
import { palette } from "@/lib/warroom/palette";

interface WarRoomImageProps {
  assetType: AssetType;
  assetSymbol: string;
  assetSlug?: string;
  eventType?: string;
  fallbackImageUrl?: string;
}

// Map asset slugs to image library symbol keys
const SLUG_TO_IMAGE_KEY: Record<string, string> = {
  gold: "GOLD",
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  ripple: "XRP",
  xrp: "XRP",
  apple: "AAPL",
  nvidia: "NVDA",
  microsoft: "MSFT",
  alphabet: "GOOGL",
  amazon: "AMZN",
  tesla: "TSLA",
  meta: "META",
  berkshire: "BRK",
  netflix: "NFLX",
  disney: "DIS",
  jnj: "JNJ",
  coca: "KO",
  visa: "V",
  mastercard: "MA",
  walmart: "WMT",
  silver: "SILVER",
  platinum: "PLATINUM",
  bnb: "BNB",
  cardano: "ADA",
  dogecoin: "DOGE",
  litecoin: "LTC",
  polkadot: "DOT",
  bitcoincash: "BCH",
  brentcrudeoil: "BRENT",
  crudeoil: "CL",
  dowjones: "DIA",
  russell2000: "IWM",
  nasdaq: "QQQ",
  treasury10y: "TNX",
  usdollar: "DXY",
};

export function WarRoomImage({
  assetType,
  assetSymbol,
  assetSlug,
  eventType,
  fallbackImageUrl,
}: WarRoomImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Try slug-based lookup first, then fall back to symbol
  const lookupSymbol = (assetSlug && SLUG_TO_IMAGE_KEY[assetSlug]) || assetSymbol;
  const image = getImageForAsset(assetType, lookupSymbol, eventType);
  const imageUrl = image?.url || fallbackImageUrl;

  if (!imageUrl || imageError) {
    return null; // Option B: Skip the image if not available
  }

  const handleImageError = () => {
    console.error(`Image failed to load: ${imageUrl}`);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const altText = image?.altText || `${assetSymbol} financial market image`;

  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        overflow: "hidden",
        border: `1px solid ${palette.hairline}`,
        background: palette.panel,
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div
          style={{
            width: "100%",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            background: `linear-gradient(90deg, ${palette.panel} 25%, ${palette.paperDim} 50%, ${palette.panel} 75%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        >
          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      )}

      {/* Image container with responsive sizing */}
      <picture
        style={{
          display: "block",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={imageUrl}
          alt={altText}
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            display: isLoading ? "none" : "block",
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </picture>

      {/* Caption and Attribution */}
      {image && (
        <div
          style={{
            padding: "14px",
            borderTop: `1px solid ${palette.hairline}`,
            fontSize: "0.85rem",
          }}
        >
          {image.caption && (
            <p
              style={{
                margin: "0 0 6px 0",
                color: palette.paper,
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
              }}
            >
              {image.caption}
            </p>
          )}

          {image.attribution && image.license && (
            <small
              style={{
                color: palette.paperDim,
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                display: "block",
              }}
            >
              {image.license === "CC0"
                ? `License: ${image.license}`
                : `${image.attribution} / License: ${image.license}`}
            </small>
          )}
        </div>
      )}
    </div>
  );
}
