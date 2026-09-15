import type { Finding, Rule } from "../review.types.js";

const PLACEHOLDER = /lorem ipsum|TODO|FIXME|Coming soon|Tez orada|placeholder text/i;

/** Bosilganda hech narsa qilmaydigan tugma. */
const EMPTY_PRESS =
  /onPress=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}|onPress=\{\s*\(\s*\)\s*=>\s*(?:null|undefined)\s*\}/;

/**
 * 2.1 — To'liqlik.
 *
 * Ko'rikchi ilovani qo'lda ochib, tugmalarni bosib ko'radi. Ishlamaydigan
 * tugma yoki «Lorem ipsum» matni — bu ilovaning tugallanmaganini ko'rsatadi
 * va aniq rad etishga olib keladi.
 *
 * AI aynan shu xatoni tez-tez qiladi: ekranni chizadi, lekin tugmaga
 * mantiq yozishni «keyinga» qoldiradi.
 */
export const completeness: Rule = (input) => {
  const findings: Finding[] = [];

  const withPlaceholder = input.files.filter(
    (f) => /\.(tsx|jsx|ts)$/.test(f.path) && PLACEHOLDER.test(f.content),
  );
  if (withPlaceholder.length > 0) {
    findings.push({
      clause: "2.1",
      severity: "blocker",
      titleUz: "Tugallanmagan matn qolgan",
      detailUz:
        "Ilovada 'Lorem ipsum', 'TODO' yoki 'Tez orada' kabi matnlar bor. Apple bunday ilovani tugallanmagan deb rad etadi.",
      files: withPlaceholder.map((f) => f.path).slice(0, 10),
    });
  }

  const withEmptyPress = input.files.filter(
    (f) => /\.(tsx|jsx)$/.test(f.path) && EMPTY_PRESS.test(f.content),
  );
  if (withEmptyPress.length > 0) {
    findings.push({
      clause: "2.1",
      severity: "blocker",
      titleUz: "Ishlamaydigan tugma bor",
      detailUz:
        "Bosilganda hech narsa qilmaydigan tugma topildi. Ko'rikchi buni bosib ko'radi va ilovani rad etadi.",
      files: withEmptyPress.map((f) => f.path).slice(0, 10),
    });
  }

  return findings;
};
