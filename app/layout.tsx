import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIGUE Network",
  description: "Plataforma de SIGUE Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
