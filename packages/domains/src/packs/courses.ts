import type { DomainPack } from "../types.js";

/** Kurs va ta'lim. DIQQAT: raqamli kontent -> IAP majburiy (3.1.1). */
export const courses: DomainPack = {
  id: "courses",
  nameUz: "Kurs va ta'lim",
  descriptionUz: "Darslar, video, test va progress.",
  examplesUz: ["Onlayn kurs", "Til maktabi", "Repetitor platformasi"],
  recommendedBlocks: ["auth", "data", "payments_iap", "onboarding", "navigation"],
  // Kursga kirish huquqi — raqamli kontent. Payme/Click bu yerda rad etishga olib keladi.
  sells: "digital",
  minScreens: 7,
  entities: [
    {
      name: "Course",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "title", type: "text", required: true },
        { name: "lessonCount", type: "int", required: true },
      ],
    },
    {
      name: "Lesson",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "courseId", type: "uuid", required: true },
        { name: "videoUrl", type: "text", required: false },
        { name: "order", type: "int", required: true },
      ],
    },
    {
      name: "Progress",
      fields: [
        { name: "userId", type: "uuid", required: true, noteUz: "RLS: faqat o'zi ko'radi" },
        { name: "lessonId", type: "uuid", required: true },
        { name: "completedAt", type: "timestamptz", required: false },
      ],
    },
  ],
  flows: [
    { id: "learn", nameUz: "O'qish", steps: ["Kurslar", "Kurs", "Dars", "Progress"] },
    { id: "purchase", nameUz: "Sotib olish", steps: ["Kurs", "Paywall (IAP)", "Ochilgan kurs"] },
  ],
  evals: [
    {
      id: "progress",
      titleUz: "Dars tugatilgani saqlanadimi",
      steps: ["Kursga kir", "Birinchi darsni och", "Tugatdim tugmasini bos", "Orqaga qayt"],
      expectUz: "Dars yonida belgi paydo bo'ladi va ilova qayta ochilganda ham turadi.",
      critical: true,
    },
    {
      id: "paywall-iap",
      titleUz: "To'lov In-App Purchase orqalimi",
      steps: ["Yopiq kursni och"],
      expectUz: "Paywall ochiladi va tashqi to'lov havolasi (Payme/Click/brauzer) YO'Q.",
      critical: true,
    },
  ],
};
