/**
 * Narx — har doim IKKI VALYUTADA.
 *
 * Dizayn qarori: o'zbek mijozi so'mda o'ylaydi, lekin $299 raqami xalqaro
 * kontekst beradi va «bu jiddiy mahsulot» degan signal yuboradi.
 */
export function Money({ uzs, usdCents }: { uzs: number; usdCents: number }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-semibold">{formatUzs(uzs)}</span>
      <span className="text-ink-faint text-sm">({formatUsd(usdCents)})</span>
    </span>
  );
}

export function formatUzs(amount: number): string {
  if (amount === 0) return "0 so'm";
  return `${amount.toLocaleString("uz-UZ").replace(/ /g, " ")} so'm`;
}

export function formatUsd(cents: number): string {
  return cents === 0 ? "$0" : `$${(cents / 100).toFixed(0)}`;
}
