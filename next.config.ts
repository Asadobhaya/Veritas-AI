import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  agentRules: false,
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
