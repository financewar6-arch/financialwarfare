"use client";

import { useCallback, useEffect, useState } from "react";
import type { AssetFeedData } from "@/lib/providers/types";

export type FeedStatus = "loading" | "live" | "error";

export interface FeedState {
  status: FeedStatus;
  data: AssetFeedData | null;
  error: string | null;
  updatedAt: Date | null;
}

export function useAssetFeed(assetSlug: string, rangeDays: string) {
  const [state, setState] = useState<FeedState>({ status: "loading", data: null, error: null, updatedAt: null });

  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch(`/api/warroom/${assetSlug}?range=${rangeDays}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Feed unavailable");
      }
      setState({ status: "live", data: json, error: null, updatedAt: new Date() });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        status: prev.data ? "live" : "error",
        error: err instanceof Error ? err.message : "Feed unavailable",
      }));
    }
  }, [assetSlug, rangeDays]);

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 60000);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  return state;
}
