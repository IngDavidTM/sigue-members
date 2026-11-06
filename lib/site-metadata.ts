import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const siteMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "SIGUE Network",
  description: "SIGUE Network conecta y fortalece líderes y organizaciones que transforman comunidades.",
  applicationName: "SIGUE Network",
  creator: "SIGUE Network",
  publisher: "SIGUE Network",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};
