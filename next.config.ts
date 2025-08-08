import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "docs.uft.edu.br",
      },
    ]
  }
};

export default nextConfig;
