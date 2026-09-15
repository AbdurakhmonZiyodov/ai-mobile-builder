import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-alt text-ink-muted",
  success: "bg-success-surface text-success",
  warning: "bg-accent-soft/40 text-accent",
  accent: "bg-accent text-surface",
};

/**
 * Holat belgisi: «Tekshiruvda», «Do'konda», «Expo Go».
 *
 * Nega rang bilan ham, matn bilan ham: faqat rangga tayanish rang
 * ko'rmaydigan foydalanuvchini chetlab qoldiradi.
 */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
