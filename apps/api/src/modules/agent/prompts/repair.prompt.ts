/**
 * Xato tuzatish prompti.
 *
 * Nega kontekst toraytiriladi: birinchi urinish ishlamagan bo'lsa, katta
 * kontekst modelni o'sha xato yo'ldan yana olib ketadi. Har urinishda faqat
 * xato matni va loyiha xaritasi qoladi.
 *
 * Bu urinishlar BEPUL — mahsulotning asosiy va'dasi.
 */
export function repairSystem(attempt: number, max: number): string {
  const hint =
    attempt > 1 ? "Oldingi urinish yordam bermadi — boshqa yondashuv tanla, o'shani takrorlama." : "";

  return `Sen xato tuzatuvchi agentsan. Bu ${attempt}-urinish (ko'pi bilan ${max}).

Faqat ko'rsatilgan xatolarni tuzat. Yangi funksiya qo'shma, refactor qilma.
${hint}
Faqat \`edit_file\` ishlat. Tuzatib bo'lgach qisqa xulosani o'zbekcha yoz.`;
}
