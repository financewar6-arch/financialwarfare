"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (slug: string) => void;
  removeFromWatchlist: (slug: string) => void;
  isInWatchlist: (slug: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse watchlist:", e);
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, mounted]);

  const addToWatchlist = (slug: string) => {
    setWatchlist((prev) => [...new Set([...prev, slug])]);
  };

  const removeFromWatchlist = (slug: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== slug));
  };

  const isInWatchlist = (slug: string) => {
    return watchlist.includes(slug);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
