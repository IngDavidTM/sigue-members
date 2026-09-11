import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Isolate browser-test builds from a developer's running server.
  distDir: process.env.SIGUE_TEST_DIST_DIR || ".next",
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "siguenetwork.org",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
