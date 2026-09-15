/**
 * Bo'lim yorlig'i: «01 — LANDING», chiziq bilan.
 * Dizayn kanvasidagi naqsh — u sahifani bo'limlarga ajratadi.
 */
export function SectionLabel({ left, right }: { left: string; right?: string }) {
  return (
    <div className="flex items-center gap-3.5 label-mono">
      <span className="text-ink">{left}</span>
      <span className="h-px flex-1 bg-line" />
      {right ? <span>{right}</span> : null}
    </div>
  );
}
