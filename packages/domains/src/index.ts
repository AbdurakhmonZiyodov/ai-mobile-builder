import { booking } from "./packs/booking.js";
import { shop } from "./packs/shop.js";
import { courses } from "./packs/courses.js";
import { delivery } from "./packs/delivery.js";
import { internal } from "./packs/internal.js";
import type { DomainPack } from "./types.js";

export * from "./types.js";
export * from "./block-id.js";
export { booking, shop, courses, delivery, internal };

/** Birinchi beshta paket — spek 4.3. */
export const DOMAIN_PACKS: Record<string, DomainPack> = {
  booking,
  shop,
  courses,
  delivery,
  internal,
};

export const ALL_DOMAIN_PACKS = Object.values(DOMAIN_PACKS);

export function getDomainPack(id: string | null | undefined): DomainPack | null {
  if (!id) return null;
  return DOMAIN_PACKS[id] ?? null;
}

/**
 * Mijozning birinchi jumlasidan soha namunasini taxmin qilish
 * (arzon, modelsiz).
 *
 * MUHIM: natija — MASLAHAT, tanlov emas. `null` qaytishi normal holat va
 * xato emas: mijoz istalgan mavzuda ilova so'rashi mumkin, bizning besh
 * namunamiz esa faqat eng ko'p uchraydigan holatlar. Ro'yxatda yo'q mavzu
 * ham xuddi shunday to'liq quriladi — promptlar buni ochiq aytadi.
 *
 * Nega eng KO'P moslik g'olib (ilgari jadvaldagi birinchi qator g'olib
 * edi): «restoran uchun buyurtma qabul qilish va yetkazib berish do'koni»
 * degan jumlada ham `delivery`, ham `shop` bor. Jadval tartibi bo'yicha
 * hal qilinsa, natija so'zlarning kuchiga emas, bizning fayldagi qator
 * tartibiga bog'lanib qolardi.
 *
 * Nega tenglikda `null`: ikki soha barobar moslashsa, taxminimiz shunchaki
 * ishonchsiz. Tavakkal qilib bittasini tanlashdan ko'ra, modelga
 * mijozning o'z jumlasidan xulosa chiqarishga qo'yib berish aniqroq.
 */
export function guessDomainPack(prompt: string): string | null {
  const p = prompt.toLowerCase();
  const table: Array<[string, string[]]> = [
    ["booking", ["bron", "navbat", "sartarosh", "klinika", "shifokor", "avtoservis", "salon", "запис"]],
    ["delivery", ["yetkaz", "dostavka", "restoran", "taom", "oshxona", "kuryer", "достав"]],
    ["shop", ["do'kon", "dokon", "magazin", "katalog", "mahsulot", "savat", "магазин"]],
    ["courses", ["kurs", "dars", "ta'lim", "talim", "o'qit", "maktab", "курс"]],
    ["internal", ["ichki", "xodim", "ombor", "hisobot", "topshiriq", "сотрудник"]],
  ];

  let bestId: string | null = null;
  let bestHits = 0;
  let tied = false;

  for (const [id, keys] of table) {
    const hits = keys.filter((k) => p.includes(k)).length;
    if (hits === 0) continue;

    if (hits > bestHits) {
      bestId = id;
      bestHits = hits;
      tied = false;
    } else if (hits === bestHits) {
      tied = true;
    }
  }

  return tied ? null : bestId;
}
