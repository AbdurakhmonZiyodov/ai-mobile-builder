import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Monorepo paketlari TypeScript manbada keladi — Next ularni o'zi
   * kompilyatsiya qilsin, alohida build qadamisiz.
   */
  transpilePackages: ["@amb/contracts", "@amb/core-rules", "@amb/design-tokens", "@amb/blocks", "@amb/domains"],
};

export default nextConfig;
