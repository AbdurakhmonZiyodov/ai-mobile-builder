/**
 * Narx savollari.
 *
 * Bu ro'yxat non-tech mijoz bilan suhbatlardan olingan. Har ekran uchta
 * savolga javob berishi kerak: qancha turadi, qachon tayyor bo'ladi,
 * ishlamasa nima bo'ladi.
 */
export const PRICING_FAQ_UZ = [
  {
    q: "Nima bitta o'zgarish hisoblanadi?",
    a: "Rangni o'zgartirish — 1. Yangi ekran qo'shish — 1. Savol berish — 0. Xato tuzatish — 0. Tekshiruvdan o'tmasa — 0.",
  },
  {
    q: "$99 yana alohidami?",
    a: "Ha. Apple Developer yiliga $99, Google Play bir marta $25. Bular to'g'ridan-to'g'ri ularga to'lanadi. Supabase'ning bepul tarifi yetadi.",
  },
  {
    q: "Qoldiq yonadimi?",
    a: "Yo'q. Sotib olingan o'zgarishlar muddatsiz — oy oxirida yo'qolmaydi.",
  },
  {
    q: "Obuna tugasa nima bo'ladi?",
    a: "Kod sizda qoladi. GitHub eksport va dasturchiga topshirish paketi hamma tarifda bor.",
  },
  {
    q: "Ilova rad etilsa-chi?",
    a: "O'tgunicha bepul tuzatamiz. Bu kafolat — biz o'z sifatimizni o'lchaymiz.",
  },
] as const;
