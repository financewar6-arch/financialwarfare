"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { darkPalette, lightPalette } from "./warroom/palette";

type Theme = "dark" | "light";

type Palette = typeof darkPalette | typeof lightPalette;

interface ThemeContextType {
  theme: Theme;
  palette: Palette;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  // Update localStorage and document when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const currentPalette = theme === "dark" ? darkPalette : lightPalette;

  // Always provide context to avoid hydration mismatch errors
  return (
    <ThemeContext.Provider value={{ theme, palette: currentPalette, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
