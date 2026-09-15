/**
 * Prefiksli identifikatorlar: `prj_1a2b…`, `run_9f0e…`.
 *
 * Nega prefiks: log yoki xato xabarida ID ko'rinsa, qaysi obyekt ekani
 * darhol ma'lum bo'ladi. Qo'llab-quvvatlashda bu ko'p vaqt tejaydi.
 *
 * Nega `node:crypto` emas: bu paketni frontend ham ishlatadi. Web Crypto
 * API Node 19+ va barcha brauzerlarda bor, shuning uchun paket har ikki
 * muhitda bir xil ishlaydi.
 */

interface RandomUuidSource {
  randomUUID(): string;
}

function uuid(): string {
  const source = (globalThis as { crypto?: Partial<RandomUuidSource> }).crypto;
  if (source && typeof source.randomUUID === "function") {
    return source.randomUUID();
  }
  // Eski muhitlar uchun zaxira. ID'lar xavfsizlik uchun emas, ajratish uchun.
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

export function newId(prefix: string): string {
  return `${prefix}_${uuid().replace(/-/g, "").slice(0, 24)}`;
}

export const ID = {
  project: () => newId("prj"),
  session: () => newId("ses"),
  message: () => newId("msg"),
  run: () => newId("run"),
  change: () => newId("chg"),
  version: () => newId("ver"),
  rejection: () => newId("rej"),
  build: () => newId("bld"),
} as const;
