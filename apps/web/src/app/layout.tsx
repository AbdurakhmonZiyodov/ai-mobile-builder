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
 * yuklanadi: ikkala oila kerak va `next/font` ularni ikki alohida
 * so'rovga bo'lib yuboradi.
 *
 * `color-scheme: dark` — brauzer scrollbar, input caret va autofill
 * fonini quyuqqa moslaydi. Busiz Chrome oq autofill fonini chizadi va
 * quyuq formada oq dog' paydo bo'ladi.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" style={{ colorScheme: "dark" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
