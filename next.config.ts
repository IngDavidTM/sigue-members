import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Baseline security headers for every response. The CSP only sets directives
// that cannot break third-party embeds (Zeffy, YouTube, Google Docs/Maps):
// it blocks other sites from framing ours, plugins (<object>/<embed>) and
// <base> tag hijacking. Script/style sources are intentionally not restricted
// yet; tightening them needs a nonce-based setup and its own testing.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Isolate browser-test builds from a developer's running server.
  distDir: process.env.SIGUE_TEST_DIST_DIR || ".next",
  // Proxy handles WordPress URLs with and without their historical trailing slash
  // so migrations resolve in a single permanent redirect.
  skipTrailingSlashRedirect: true,
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
