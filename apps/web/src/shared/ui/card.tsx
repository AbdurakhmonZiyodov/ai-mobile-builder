import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Ichki karta uchun — biroz to'qroq fon. */
  nested?: boolean;
}

/** Kontent bloki: oq qog'oz varaqasi, ingichka chegara bilan. */
export function Card({ children, className = "", nested = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-line ${nested ? "bg-surface-alt" : "bg-surface"} ${className}`}
    >
      {children}
    </div>
  );
}
