/** So'm formati — katta summalar bo'linma bilan (spek 14.3). */
export function formatUzs(amount: number): string {
  const rounded = Math.round(amount);
  const withSeparators = rounded.toLocaleString("uz-UZ").replace(/ /g, " ");
  return `${withSeparators} so'm`;
}

/** Sana — o'zbek tilida qisqa ko'rinish. */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
