import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "s2.coinmarketcap.com",
      },
    ],
  },
};

export default nextConfig;
