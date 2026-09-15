import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "solid" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

/**
 * RIVO tugmasi — hammasi pill shaklida.
 *
 * `primary` — gradient va porlash. Sahifada FAQAT BITTA shunday tugma
 * bo'ladi: gradient e'tiborni tortadi, ikkitasi bo'lsa mijoz qaysi
 * birini bosishni bilmaydi va to'xtaydi.
 *
 * Gradient ustidagi matn quyuq (`accent-ink`), oq emas: gradientning
 * eng yorug' nuqtasi oltin sariq va oq matn u yerda o'qilmay qoladi.
 * Quyuq matn butun gradient bo'ylab 7:1 dan yuqori kontrast beradi.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "gradient-surface gradient-glow hover:brightness-110 active:brightness-95",
  /** Quyuq fondagi kuchli ikkinchi amal — oqish tugma. */
  solid: "bg-ink text-paper hover:bg-white",
  secondary: "bg-surface-alt text-ink border border-line hover:bg-surface-high hover:border-line-strong",
  ghost: "text-ink-muted hover:text-ink hover:bg-surface-alt",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  // 44px — bosish maydonining eng kichik qulay o'lchami.
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  );
}
