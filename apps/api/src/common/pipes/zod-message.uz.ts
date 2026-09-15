import type { $ZodIssue } from "zod/v4/core";

/**
 * Zod xabarlarini o'zbek tiliga o'giradi.
 *
 * Nega markazlashtirilgan tarjima, har sxemada `.message()` emas:
 * xabarlar o'nlab sxemada takrorlanardi va ularning bir qismi albatta
 * inglizcha qolib ketardi. Mahsulotning butun mazmuni esa mijoz o'z
 * tilida ishlashida.
 */
export function translateIssue(issue: $ZodIssue): string {
  switch (issue.code) {
    case "invalid_type":
      return issue.input === undefined
        ? "To'ldirilishi shart."
        : `Noto'g'ri tur: ${expectedUz(issue.expected)} kutilgan edi.`;

    case "too_small":
      return typeof issue.minimum === "number" && issue.origin === "string"
        ? `Kamida ${issue.minimum} ta belgi bo'lsin.`
        : `Juda kichik: kamida ${String(issue.minimum)} bo'lsin.`;

    case "too_big":
      return typeof issue.maximum === "number" && issue.origin === "string"
        ? `Ko'pi bilan ${issue.maximum} ta belgi bo'lsin.`
        : `Juda katta: ko'pi bilan ${String(issue.maximum)} bo'lsin.`;

    case "invalid_value":
      return "Ruxsat etilmagan qiymat.";

    case "invalid_format":
      return "Format noto'g'ri.";

    case "unrecognized_keys":
      return "Noma'lum maydon yuborildi.";

    default:
      return issue.message;
  }
}

function expectedUz(expected: string): string {
  const names: Record<string, string> = {
    string: "matn",
    number: "raqam",
    boolean: "ha/yo'q",
    array: "ro'yxat",
    object: "obyekt",
  };
  return names[expected] ?? expected;
}
