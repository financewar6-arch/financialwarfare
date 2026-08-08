"use client";

import { useEffect, useState } from "react";
import { palette } from "@/lib/warroom/palette";

interface SparklineProps {
  assetSlug: string;
  width?: number;
  height?: number;
  isPositive?: boolean;
}

const FALLBACK_POINTS = "0,18 8,12 16,14 24,8 32,11 40,6 48,10 56,4 64,8 70,5";
const FALLBACK_FILL = "0,25 0,18 8,12 16,14 24,8 32,11 40,6 48,10 56,4 64,8 70,5 70,25";

export function TrendingTickerSparkline({ assetSlug, width = 70, height = 25, isPositive }: SparklineProps) {
  const [points, setPoints] = useState<string>(FALLBACK_POINTS);
  const [fillPoints, setFillPoints] = useState<string>(FALLBACK_FILL);
  const [chartColor, setChartColor] = useState<string>(palette.green);

  useEffect(() => {
    fetch(`/api/warroom/${assetSlug}?range=7`)
      .then((res) => res.json())
      .then((data) => {
        if (data.history && Array.isArray(data.history) && data.history.length > 0) {
          const prices = data.history
            .map((h: any) => typeof h.close === "number" ? h.close : null)
            .filter((p: any): p is number => p !== null);

          if (prices.length < 2) {
            throw new Error("Insufficient data");
          }

          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const range = maxPrice - minPrice || 1;

          // Determine color from 7-day trend (first to last)
          const firstPrice = prices[0];
          const lastPrice = prices[prices.length - 1];
          const priceDirection = lastPrice >= firstPrice;
          const defaultColor = priceDirection ? palette.green : palette.red;
          setChartColor(defaultColor);

          const pointCount = Math.min(prices.length, 12);
          const step = Math.max(1, Math.floor(prices.length / pointCount));
          const sampledPrices = prices
            .filter((_: any, i: number) => i % step === 0)
            .slice(0, pointCount);

          if (sampledPrices.length < 2) {
            throw new Error("Insufficient sampled data");
          }

          const xStep = width / (sampledPrices.length - 1);
          const linePoints = sampledPrices
            .map((p: number, i: number) => {
              const x = i * xStep;
              const normalizedPrice = (p - minPrice) / range;
              const y = height - normalizedPrice * height * 0.8 - height * 0.1;
              return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
            })
            .join(" ");

          const firstY = height - ((sampledPrices[0] - minPrice) / range) * height * 0.8 - height * 0.1;
          const lastY = height - ((sampledPrices[sampledPrices.length - 1] - minPrice) / range) * height * 0.8 - height * 0.1;

          const fillPath =
            `0,${height} ` +
            sampledPrices
              .map((p: number, i: number) => {
                const x = i * xStep;
                const normalizedPrice = (p - minPrice) / range;
                const y = height - normalizedPrice * height * 0.8 - height * 0.1;
                return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
              })
              .join(" ") +
            ` ${width},${height}`;

          setPoints(linePoints);
          setFillPoints(fillPath);
        }
      })
      .catch(() => {
        setPoints(FALLBACK_POINTS);
        setFillPoints(FALLBACK_FILL);
      });
  }, [assetSlug, width, height]);

  // Update color when isPositive prop changes (override historical trend)
  useEffect(() => {
    if (isPositive !== undefined) {
      setChartColor(isPositive ? palette.green : palette.red);
    }
  }, [isPositive]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "20px" }} preserveAspectRatio="none">
      {fillPoints && <polyline points={fillPoints} stroke="none" fill={`${chartColor}22`} vectorEffect="non-scaling-stroke" />}
      {points && <polyline points={points} stroke={chartColor} fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}
