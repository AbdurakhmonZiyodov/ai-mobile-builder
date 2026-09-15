/**
 * Bo'lim yorlig'i: «LOYIHALARIM — 4 TA», chiziq bilan.
 *
 * Chiziq gradientdan boshlanib fonga singib ketadi. Bu gradientning
 * eng kam «ovozli» ishlatilishi: u bo'limni ajratadi, lekin e'tiborni
 * asosiy tugmadan tortib olmaydi.
 */
export function SectionLabel({ left, right }: { left: string; right?: string }) {
  return (
    <div className="label-mono flex items-center gap-4">
      <span className="text-ink">{left}</span>
      <span
        aria-hidden
        className="h-px flex-1 bg-linear-to-r from-accent-via/40 to-transparent"
      />
      {right ? <span>{right}</span> : null}
    </div>
  );
}
