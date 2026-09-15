import type { Rule } from "../review.types.js";

/**
 * 5.1.1(v) — Akkauntni o'chirish.
 *
 * Apple 2022-yildan buni MAJBURIY qildi: ilovada akkaunt yaratish bo'lsa,
 * uni ilova ichidan o'chirish ham bo'lishi shart. Sozlamalarga havola yoki
 * «bizga yozing» yetarli emas.
 *
 * Bu eng oson unutiladigan talab va aniq rad etish sababi, shuning uchun
 * Auth blokimiz uni tayyor holda beradi.
 */
export const accountDeletion: Rule = (input) => {
  if (!input.blocks.includes("auth")) return [];

  const hasDeletion = input.files.some(
    (f) =>
      /delete-account|deleteAccount/i.test(f.path) ||
      /delete-account|deleteAccount|Akkauntni o.?chirish/i.test(f.content),
  );
  if (hasDeletion) return [];

  return [
    {
      clause: "5.1.1(v)",
      severity: "blocker",
      titleUz: "Akkauntni o'chirish ekrani yo'q",
      detailUz:
        "Ilovada ro'yxatdan o'tish bor, lekin akkauntni o'chirish yo'q. Apple 2022-yildan buni majburiy qilgan — bu aniq rad etish.",
      files: [],
    },
  ];
};
