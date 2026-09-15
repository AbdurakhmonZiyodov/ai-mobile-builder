/**
 * Fon porlashi — gradientning eng sokin ko'rinishi.
 *
 * Qora fon o'z holicha tekis va «o'lik» ko'rinadi. Bitta juda xira
 * iliq dog' unga chuqurlik beradi, lekin hech qanday matn bilan
 * raqobatlashmaydi (opaklik 12–18%).
 *
 * `aria-hidden` va `pointer-events-none`: bu sof bezak, ekran
 * o'quvchisi uni o'qimasligi va bosishga xalaqit bermasligi kerak.
 */
export function AmbientGlow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full blur-[120px] ${className}`}
      style={{
        background:
          "radial-gradient(closest-side, var(--color-accent-via) 0%, transparent 100%)",
      }}
    />
  );
}
