"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { WatchlistProvider } from "@/lib/watchlist-context";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import React from "react";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <Nav />
        {children}
        <Footer />
      </WatchlistProvider>
    </ThemeProvider>
  );
}
