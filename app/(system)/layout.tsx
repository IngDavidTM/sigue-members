import { heebo, roboto } from "@/lib/fonts";
import { siteMetadata } from "@/lib/site-metadata";
import "../globals.css";

export const metadata = siteMetadata;

export default function SystemLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${heebo.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
