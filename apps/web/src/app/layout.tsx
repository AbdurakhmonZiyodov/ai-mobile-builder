import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI ilova builder",
  description: "Biznes g'oyangizni ilovaga aylantiring va do'konda ushlab turing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
