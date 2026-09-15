import type { DomainPack } from "../types.js";

/** Xizmat va bron: sartaroshxona, klinika, avtoservis. */
export const booking: DomainPack = {
  id: "booking",
  nameUz: "Xizmat va bron",
  descriptionUz: "Mijoz vaqt tanlaydi, bron qiladi, eslatma oladi.",
  examplesUz: ["Sartaroshxona", "Klinika", "Avtoservis", "Go'zallik saloni"],
  recommendedBlocks: ["auth", "data", "notifications", "onboarding", "navigation"],
  sells: "physical_or_service",
  minScreens: 6,
  entities: [
    {
      name: "Service",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "name", type: "text", required: true },
        { name: "durationMin", type: "int", required: true },
        { name: "priceUzs", type: "bigint", required: true, noteUz: "So'mda, butun son" },
        { name: "staffId", type: "uuid", required: false },
      ],
    },
    {
      name: "Staff",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "name", type: "text", required: true },
        { name: "workingHours", type: "jsonb", required: true },
      ],
    },
    {
      name: "Booking",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "userId", type: "uuid", required: true, noteUz: "RLS: faqat o'zi ko'radi" },
        { name: "serviceId", type: "uuid", required: true },
        { name: "startsAt", type: "timestamptz", required: true },
        { name: "status", type: "text", required: true, noteUz: "pending|confirmed|cancelled" },
      ],
    },
  ],
  flows: [
    { id: "book", nameUz: "Bron qilish", steps: ["Xizmatlar", "Vaqt tanlash", "Tasdiqlash", "Mening bronlarim"] },
    { id: "cancel", nameUz: "Bekor qilish", steps: ["Mening bronlarim", "Bron tafsiloti", "Bekor qilish"] },
  ],
  evals: [
    {
      id: "book-happy",
      titleUz: "Yangi mijoz ro'yxatdan o'tib, bron qila oladimi",
      steps: [
        "Ilovani och",
        "Ro'yxatdan o'tish tugmasini bos",
        "Email va parol kirit",
        "Birinchi xizmatni tanla",
        "Bo'sh vaqtni tanla",
        "Tasdiqlash tugmasini bos",
      ],
      expectUz: "Ekranda bron tasdiqlangani ko'rinadi va 'Mening bronlarim' ro'yxatida paydo bo'ladi.",
      critical: true,
    },
    {
      id: "persist",
      titleUz: "Bron ilova qayta ochilganda joyidami",
      steps: ["Ilovani yop", "Qaytadan och", "Mening bronlarim'ga o't"],
      expectUz: "Avval yaratilgan bron ro'yxatda turibdi (Supabase'ga haqiqatan yozilgan).",
      critical: true,
    },
    {
      id: "back-nav",
      titleUz: "Orqaga qaytish buzilmaydimi",
      steps: ["Xizmat tafsilotiga kir", "Orqaga bos", "Yana kir", "Orqaga bos"],
      expectUz: "Har safar oldingi ekranga qaytadi, ilova yopilib ketmaydi.",
      critical: true,
    },
    {
      id: "empty-state",
      titleUz: "Bo'sh holat tushunarlimi",
      steps: ["Yangi akkaunt bilan kir", "Mening bronlarim'ga o't"],
      expectUz: "'Hozircha bron yo'q' degan mazmunli matn bor, bo'sh oq ekran emas.",
      critical: false,
    },
  ],
};
