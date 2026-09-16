/**
 * Bitta run uchun xarajat chegarasi.
 *
 * Nega kodda, Vercel byudjetiga tayanmasdan:
 *  · Vercel byudjeti butun hisob uchun — bitta buzuq loyiha boshqalarni
 *    ham to'xtatib qo'yadi
 *  · Uni mijoz o'chirib qo'yishi mumkin (amalda shunday bo'ldi)
 *  · Chegaraga urilganda mijozga NIMA bo'lganini aytishimiz kerak,
 *    provayder esa quruq `402` beradi
 *
 * O'lchangan qiymatlar: kichik tahrir ~6 sent, birinchi qurish ~125 sent.
 */
export const RUN_COST_LIMIT_CENTS: Record<"change" | "first_build", number> = {
  change: 60,
  first_build: 250,
};

export class RunCostExceeded extends Error {
  constructor(
    readonly spentCents: number,
    readonly limitCents: number,
  ) {
    super(`Run xarajati chegaradan oshdi: ${spentCents} > ${limitCents} sent`);
    this.name = "RunCostExceeded";
  }
}

/**
 * Chegaradan oshgan bo'lsa xato tashlaydi.
 *
 * Har model chaqiruvidan KEYIN tekshiriladi: keyingisiga o'tishdan oldin
 * to'xtash pulni tejaydi.
 */
export function assertWithinBudget(spentCents: number, kind: keyof typeof RUN_COST_LIMIT_CENTS): void {
  const limit = RUN_COST_LIMIT_CENTS[kind];
  if (spentCents > limit) throw new RunCostExceeded(Math.round(spentCents), limit);
}
