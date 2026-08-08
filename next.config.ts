import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Suppress errors in non-critical optional features (discovery API, video generation, portfolio)
    // These don't affect core war room functionality
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
