import type { ReactNode } from "react";

/**
 * Sarlavhaning gradient bilan ajratilgan qismi.
 *
 * QOIDA: bir sarlavhada faqat bir-ikki so'z. Butun jumlaga qo'yilsa
 * matn o'qish qiyinlashadi va gradient aksent bo'lishdan to'xtaydi.
 *
 * Nega alohida komponent, faqat CSS sinfi emas: `-webkit-background-clip`
 * ishlamagan brauzerda matn butunlay yo'qolib qolardi. `text-accent`
 * zaxira rangi shuni oldini oladi — gradient qo'llanmasa ham so'z
 * ko'rinib turadi.
 */
export function GradientText({ children }: { children: ReactNode }) {
  return <span className="gradient-text text-accent">{children}</span>;
}
