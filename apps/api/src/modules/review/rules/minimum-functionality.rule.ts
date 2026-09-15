import type { Rule } from "../review.types.js";

/**
 * 4.2 — Minimum functionality.
 *
 * App Store'dagi eng ko'p uchraydigan rad etish sababi. Apple «veb-sayt
 * nusxasi» yoki «juda sodda» ilovalarni qaytaradi.
 *
 * Nega ekran soni bilan o'lchanadi: bu yagona avtomatik o'lchanadigan
 * ko'rsatkich. Domen paketi har soha uchun o'z chegarasini beradi —
 * bron ilovasi uchun 6 ta, ichki vosita uchun 5 ta yetarli.
 */
export const minimumFunctionality: Rule = (input) => {
  const screens = input.files.filter(
    (f) => f.path.startsWith("app/") && /\.(tsx|jsx)$/.test(f.path) && !f.path.includes("_layout"),
  );

  if (screens.length >= input.minScreens) return [];

  return [
    {
      clause: "4.2",
      severity: "blocker",
      titleUz: "Ilova juda sodda ko'rinishi mumkin",
      detailUz: `Hozir ${screens.length} ta mazmunli ekran bor, bu soha uchun kamida ${input.minScreens} ta kerak. Apple 4.2 bandi bo'yicha "veb-sayt nusxasi" yoki "juda sodda" ilovalarni rad etadi.`,
      files: screens.map((s) => s.path).slice(0, 10),
    },
  ];
};
