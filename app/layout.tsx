import type { Metadata } from "next";
import { headers } from "next/headers";
import { heebo, roboto } from "@/lib/fonts";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const requestedLocale = requestHeaders.get("x-next-intl-locale");
  const locale = requestedLocale === "en" ? "en" : "es";

  return (
    <html lang={locale} className={`${heebo.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
