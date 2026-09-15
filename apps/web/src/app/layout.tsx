import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RIVO — AI mobil ilova builder",
  description: "Boshqalar tez chiqarish uchun. Biz ishlab turishi uchun.",
};

/**
 * Ildiz layout.
 *
 * Shriftlar Google Fonts'dan `next/font` orqali emas, `<link>` bilan
 * yuklanadi: IBM Plex ikkala oilasi kerak va `next/font` ularni ikki
 * alohida so'rovga bo'lib yuboradi.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
