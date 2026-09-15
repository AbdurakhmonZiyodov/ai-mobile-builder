import type { DomainPack } from "@amb/domains";

/**
 * Ilova nomini yasaydi.
 *
 * Nega mijozdan so'ralmaydi: u g'oyasini aytmoqchi, nom haqida hali
 * o'ylamagan. Har qo'shimcha maydon boshlanishdagi to'siq.
 *
 * Nega promptning birinchi so'zlaridan OLINMAYDI: «Salom, sen nima
 * qilasan?» degan jumladan «Salom sen nima» degan nom chiqadi — bu
 * mijozga ham, `app.json` ga ham yaramaydi va Apple 4.3 bandi bo'yicha
 * ogohlantirish beradi.
 *
 * Shuning uchun nom aniqlangan sohadan olinadi. Mijoz uni keyin bir
 * bosishda o'zgartira oladi.
 */
export function buildProjectName(pack: DomainPack | null): string {
  return pack ? DOMAIN_NAMES[pack.id] ?? `${pack.nameUz} ilovasi` : "Yangi ilova";
}

/** Domen uchun tabiiy o'zbekcha nom. */
const DOMAIN_NAMES: Record<string, string> = {
  booking: "Bron ilovasi",
  shop: "Do'kon ilovasi",
  courses: "Kurs ilovasi",
  delivery: "Yetkazib berish ilovasi",
  internal: "Ichki vosita",
};
