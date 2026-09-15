import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger";

/**
 * Holat belgisi: «Tekshiruvda», «Do'konda», «Expo Go».
 *
 * Nega rang bilan ham, matn bilan ham: faqat rangga tayanish rang
 * ko'rmaydigan foydalanuvchini chetlab qoldiradi. Shuning uchun har
 * belgida nuqta ham, yozuv ham bo'ladi — nuqta rang, yozuv ma'no.
 *
 * Gradient ishlatilmaydi: belgi ikkinchi darajali ma'lumot, gradient
 * esa sahifaning yagona asosiy amali uchun saqlanadi.
 */
const TONES: Record<Tone, { chip: string; dot: string }> = {
  neutral: { chip: "bg-surface-alt text-ink-muted border-line", dot: "bg-ink-faint" },
  success: { chip: "bg-success-surface text-success border-success/25", dot: "bg-success" },
  warning: { chip: "bg-accent-surface text-accent-soft border-accent/25", dot: "bg-accent" },
  danger: { chip: "bg-danger-surface text-danger border-danger/25", dot: "bg-danger" },
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  const { chip, dot } = TONES[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${chip}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}
