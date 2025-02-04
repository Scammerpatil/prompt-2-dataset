import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "w7.pngwing.com",
      },
    ],
  },
};

export default nextConfig;
