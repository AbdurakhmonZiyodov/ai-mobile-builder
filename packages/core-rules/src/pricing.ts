/**
 * Narx modeli — MVP spek 6-bo'lim.
 * Birlik: token yoki kredit emas, "o'zgarish" (change).
 */

export type PlanId = "trial" | "build" | "live" | "active";

export interface Plan {
  id: PlanId;
  /** Mijozga ko'rsatiladigan nom (uz) */
  nameUz: string;
  /** USD, sent aniqligida butun son */
  priceUsdCents: number;
  /** UZS, so'mda butun son */
  priceUzs: number;
  billing: "once" | "monthly" | "free";
  /** Tarif ichiga kiradigan o'zgarishlar soni */
  includedChanges: number;
  /** Build (EAS) va do'konga chiqarish mumkinmi */
  canBuild: boolean;
  featuresUz: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  trial: {
    id: "trial",
    nameUz: "Sinov",
    priceUsdCents: 0,
    priceUzs: 0,
    billing: "free",
    /**
     * Spekda bu raqam yo'q: 6-bo'limda "Build yo'q" deyilgan, "o'zgarish yo'q" emas.
     * Mijoz g'oyasini ishlab turgan holda ko'rmasa, "Qurish" ga o'tmaydi —
     * shuning uchun sinovga cheklangan miqdor beramiz. Sozlanadigan qiymat.
     */
    includedChanges: 5,
    canBuild: false,
    featuresUz: [
      "Design mode — cheksiz",
      "5 o'zgarish — g'oyangizni ishlab turgan holda ko'rish uchun",
      "Veb preview",
      "Telefonda ko'rish",
      "Kodni ko'rish",
      "Build yo'q",
    ],
  },
  build: {
    id: "build",
    nameUz: "Qurish",
    priceUsdCents: 29900,
    priceUzs: 1_900_000,
    billing: "once",
    includedChanges: 40,
    canBuild: true,
    featuresUz: [
      "To'liq ilova",
      "40 o'zgarish",
      "E2E tekshiruv",
      "TestFlight",
      "Dasturchiga topshirish paketi",
    ],
  },
  live: {
    id: "live",
    nameUz: "Yashash",
    priceUsdCents: 7900,
    priceUzs: 490_000,
    billing: "monthly",
    includedChanges: 10,
    canBuild: true,
    featuresUz: [
      "Oyiga 10 o'zgarish",
      "SDK yangilanishlari",
      "Crash monitoring",
      "Do'kon javoblari",
    ],
  },
  active: {
    id: "active",
    nameUz: "Faol",
    priceUsdCents: 19900,
    priceUzs: 1_200_000,
    billing: "monthly",
    includedChanges: 40,
    canBuild: true,
    featuresUz: ["Oyiga 40 o'zgarish", "Ustuvor navbat"],
  },
};

/** Qo'shimcha dona-dona o'zgarish. Muddatsiz, yonmaydi. */
export const EXTRA_CHANGE_PRICE = {
  usdCents: 500,
  uzs: 45_000,
} as const;

/** Yordam bilan do'konga chiqarish (App Manager roli bilan). */
export const ASSISTED_PUBLISH_PRICE = {
  usdCents: 19900,
  uzs: 1_200_000,
} as const;

/**
 * Mijoz ko'radigan TO'LIQ xarajat jadvali — spek 15.2:
 * «$99 yana alohidami?» degan savol birinchi ekranda javob topishi kerak.
 */
export const THIRD_PARTY_COSTS = [
  { keyUz: "Apple Developer Program", usdCents: 9900, periodUz: "yiliga" },
  { keyUz: "Google Play Developer", usdCents: 2500, periodUz: "bir marta" },
  { keyUz: "Supabase", usdCents: 0, periodUz: "bepul tarif yetadi" },
] as const;
