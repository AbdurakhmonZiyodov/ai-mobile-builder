import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Ichki karta — biroz ochroq sirt, chunki quyuqroq qilib bo'lmaydi. */
  nested?: boolean;
  /** Ajratilgan karta: tanlangan tarif, asosiy blok. */
  highlighted?: boolean;
}

/**
 * Kontent bloki.
 *
 * Quyuq dizaynda qatlam soya bilan emas, YORUG'LIK bilan ajratiladi:
 * fon bir pog'ona ochroq va chegara juda nozik. Soya qora fonda
 * ko'rinmaydi — shuning uchun ishlatilmaydi.
 */
export function Card({ children, className = "", nested = false, highlighted = false }: CardProps) {
  const surface = nested ? "bg-surface-alt" : "bg-surface";
  const border = highlighted ? "border-line-strong" : "border-line";

  return (
    <div className={`rounded-2xl border ${border} ${surface} ${className}`}>{children}</div>
  );
}
