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

/** Mijozning birinchi jumlasidan domen paketini taxmin qilish (arzon, modelsiz). */
export function guessDomainPack(prompt: string): string | null {
  const p = prompt.toLowerCase();
  const table: Array<[string, string[]]> = [
    ["booking", ["bron", "navbat", "sartarosh", "klinika", "shifokor", "avtoservis", "salon", "запис"]],
    ["delivery", ["yetkaz", "dostavka", "restoran", "taom", "oshxona", "kuryer", "достав"]],
    ["shop", ["do'kon", "dokon", "magazin", "katalog", "mahsulot", "savat", "магазин"]],
    ["courses", ["kurs", "dars", "ta'lim", "talim", "o'qit", "maktab", "курс"]],
    ["internal", ["ichki", "xodim", "ombor", "hisobot", "topshiriq", "сотрудник"]],
  ];
  for (const [id, keys] of table) {
    if (keys.some((k) => p.includes(k))) return id;
  }
  return null;
}
