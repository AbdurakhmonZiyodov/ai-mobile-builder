import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

/**
 * RIVO tugmasi.
 *
 * `primary` — terrakota. Sahifada FAQAT BITTA asosiy amal bo'ladi:
 * agar ikkitasi bo'lsa, mijoz qaysi birini bosishni bilmaydi.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-surface hover:opacity-90",
  secondary: "bg-surface text-ink border border-line hover:bg-surface-alt",
  ghost: "text-ink hover:bg-surface-alt",
  dark: "bg-ink text-surface hover:opacity-90",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  // 44px — bosish maydonining eng kichik qulay o'lchami.
  md: "h-11 px-5 text-[15px]",
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  );
}
