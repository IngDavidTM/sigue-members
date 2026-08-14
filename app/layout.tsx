import type { Metadata } from "next";
import { heebo, roboto } from "@/lib/fonts";
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
    <html lang="es" className={`${heebo.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
