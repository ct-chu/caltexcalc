import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/caltexcalc",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
