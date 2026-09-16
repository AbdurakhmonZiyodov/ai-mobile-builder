import type { DomainPack } from "@amb/domains";

/**
 * Reja tuzuvchi — birinchi qurishning birinchi qadami.
 *
 * Nega avval reja: model to'g'ridan-to'g'ri kod yozishga kirishsa, u
 * ekranlarni bir-biriga bog'lamay, tasodifiy tartibda yozadi. Reja uni
 * butun ilovani bir marta o'ylashga majbur qiladi.
 *
 * Nega mijozga ko'rsatiladi: u kod o'qiy olmaydi, lekin «Menyu, Savat,
 * Buyurtma» degan ro'yxatni o'qiy oladi va o'zi so'ragan narsa ekanini
 * darhol biladi.
 *
 * Javob faqat JSON.
 */
export function plannerSystem(pack: DomainPack | null): string {
  /*
   * Soha maslahati — BUYRUQ EMAS.
   *
   * Paket mijozning jumlasidagi kalit so'zdan taxmin qilinadi va taxmin
   * ko'pincha xato bo'ladi: «topshiriq» so'zi bor jumla ichki jarayonlar
   * paketiga tushadi, mijoz esa vazifa daftarchasini so'ragan bo'ladi.
   * Ilgari bu yerda «Soha aniqlangan» deb yozilardi va model o'sha
   * paketning oqimlarini mijozning g'oyasidan ustun qo'yardi.
   *
   * Endi ustuvorlik ochiq: mijozning jumlasi birinchi, namuna ikkinchi.
   * Mijoz istalgan mavzuda ilova so'rashi mumkin va ro'yxatimizda
   * bo'lmagan mavzu ham xuddi shunday to'liq ishlashi kerak.
   */
  const domainHint = pack
    ? `\nEhtimoliy soha: ${pack.nameUz}. Shu sohadagi ilovalarda odatda uchraydigan oqimlar:\n${pack.flows
        .map((f) => `- ${f.nameUz}: ${f.steps.join(" -> ")}`)
        .join(
          "\n",
        )}\n\nBu taxmin kalit so'z bo'yicha qilingan va XATO bo'lishi mumkin. Mijozning jumlasiga mos kelmasa — e'tiborsiz qoldir va u AYTGAN ilovani rejalashtir.`
    : "\nSoha ro'yxatimizdagi namunalarga to'g'ri kelmadi. Bu muammo emas — mijozning jumlasidan o'zing xulosa chiqar va aynan u so'ragan ilovani rejalashtir.";

  return `Sen mobil ilova rejalashtiruvchisisan. Mijoz o'z biznesini bir-ikki jumlada aytdi.

Vazifang: shu jumladan ishlaydigan ilovaning REJASINI tuzish.
${domainHint}

Javobing FAQAT JSON bo'lsin:

{
  "appNameUz": "Ilova nomi, 2-3 so'z",
  "summaryUz": "Bir jumla: ilova nima qiladi",
  "screens": [
    { "nameUz": "Ekran nomi", "purposeUz": "Nima uchun kerak", "file": "app/(app)/fayl.tsx" }
  ],
  "entities": [
    { "name": "Model", "fields": ["id", "title", "createdAt"] }
  ]
}

Qoidalar:
- 3 tadan 6 tagacha ekran. Kam bo'lsa Apple 4.2 bandi bo'yicha rad etiladi,
  ko'p bo'lsa birinchi qurish cho'ziladi.
- Ekran nomlari MIJOZ TILIDA: "Menyu", "Savat", "Mening bronlarim".
  "HomeScreen", "ListView" kabi texnik nomlar TAQIQLANGAN.
- \`file\` yo'llari \`app/(app)/\` ichida bo'lsin.
- Ma'lumot modeli sodda: mijozga kerak bo'lgan maydonlar, ortiqchasi emas.
- O'zing haqingda hech narsa yozma.`;
}

/** Reja tayyor bo'lgach, quruvchiga beriladigan qo'shimcha ko'rsatma. */
export function firstBuildInstruction(planJson: string): string {
  return `Quyidagi reja bo'yicha ilovani QUR. Bu birinchi qurish — loyihada
hozircha faqat shablon bor.

${planJson}

Tartib:
1. Ma'lumot turlarini yoz: \`src/features/<soha>/types.ts\`
2. Holat mantiqini yoz: \`src/features/<soha>/use-*.ts\`
   Baza ulanmagan bo'lsa AsyncStorage ishlat — ilova birinchi kundan ishlasin.
3. Har ekranni yoz. Mavjud \`app/(app)/index.tsx\` ni \`edit_file\` bilan
   o'zgartir, yangilarini \`create_file\` bilan yarat.
4. Navigatsiya fayllariga TEGMA.

Har ekranda uchta holat bo'lsin: yuklanmoqda, bo'sh, xato.
Bo'sh oq ekran qoldirma — Apple uni rad etadi.`;
}
