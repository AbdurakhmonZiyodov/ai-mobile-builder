import type { Block, BlockId } from "./types.js";

/**
 * Bloklar reestri — MVP spek 4.2.
 * Agent har safar noldan yozganda detallarni goh unutadi. Blok hech qachon unutmaydi.
 */
export const BLOCKS: Record<BlockId, Block> = {
  auth: {
    id: "auth",
    nameUz: "Kirish va ro'yxatdan o'tish",
    descriptionUz:
      "Email/parol, Apple bilan kirish, akkauntni o'chirish ekrani va maxfiylik matnlari.",
    preview: "expo_go",
    packages: ["@supabase/supabase-js", "expo-apple-authentication", "expo-secure-store"],
    files: [
      "app/(auth)/sign-in.tsx",
      "app/(auth)/sign-up.tsx",
      "app/(app)/settings/delete-account.tsx",
      "lib/auth.ts",
      "lib/rls-policies.sql",
    ],
    storeRequirements: [
      {
        clause: "4.8",
        requirementUz:
          "Uchinchi tomon login bo'lsa (Google/Facebook), Apple bilan kirish ham bo'lishi shart.",
        coveredByBlock: true,
      },
      {
        clause: "5.1.1(v)",
        requirementUz:
          "Akkaunt yaratish imkoni bo'lsa, ilova ichida akkauntni o'chirish ham bo'lishi shart.",
        coveredByBlock: true,
      },
    ],
    generationPolicy: "parameterize_only",
  },

  data: {
    id: "data",
    nameUz: "Ma'lumotlar bazasi",
    descriptionUz: "Supabase sxema, sinovdan o'tgan RLS naqshlari, offline kesh, migratsiya.",
    preview: "expo_go",
    packages: ["@supabase/supabase-js", "@tanstack/react-query", "expo-sqlite"],
    files: ["lib/supabase.ts", "lib/queries.ts", "db/schema.sql", "db/policies.sql"],
    storeRequirements: [],
    // RLS kod emas, blok. Bitta xato butun bazani ochib qo'yadi (spek 9.2).
    generationPolicy: "parameterize_only",
  },

  payments_iap: {
    id: "payments_iap",
    nameUz: "To'lov — In-App Purchase",
    descriptionUz: "Raqamli kontent va obunalar uchun. Apple 3.1.1 bandi bo'yicha majburiy.",
    preview: "dev_client",
    packages: ["react-native-purchases"],
    files: ["lib/iap.ts", "app/(app)/paywall.tsx"],
    storeRequirements: [
      {
        clause: "3.1.1",
        requirementUz:
          "Raqamli kontent, obuna, premium funksiya, virtual tovar — faqat In-App Purchase orqali.",
        coveredByBlock: true,
      },
    ],
    generationPolicy: "parameterize_only",
    allowedGoods: "digital",
  },

  payments_local: {
    id: "payments_local",
    nameUz: "To'lov — Payme / Click / Uzum",
    descriptionUz:
      "Faqat jismoniy tovar va real dunyo xizmati uchun: yetkazib berish, bron, do'kondan xarid.",
    preview: "expo_go",
    packages: [],
    files: ["lib/payments/payme.ts", "lib/payments/click.ts", "app/(app)/checkout.tsx"],
    storeRequirements: [
      {
        clause: "3.1.1",
        requirementUz:
          "Raqamli kontent uchun tashqi to'lov RAD ETILADI. Bu blok faqat jismoniy tovar va xizmat uchun.",
        coveredByBlock: true,
      },
    ],
    generationPolicy: "parameterize_only",
    allowedGoods: "physical_or_service",
  },

  notifications: {
    id: "notifications",
    nameUz: "Bildirishnomalar",
    descriptionUz: "Ruxsatni kontekst bilan so'rash, sozlamalar ekrani, opt-out.",
    preview: "dev_client",
    packages: ["expo-notifications", "expo-device"],
    files: ["lib/notifications.ts", "app/(app)/settings/notifications.tsx"],
    storeRequirements: [
      {
        clause: "5.1.1",
        requirementUz: "Ruxsat sababsiz so'ralmasin — kontekst ko'rsatilsin.",
        coveredByBlock: true,
      },
    ],
    generationPolicy: "parameterize_only",
  },

  media: {
    id: "media",
    nameUz: "Kamera va galereya",
    descriptionUz: "Rasm olish va tanlash, NSUsageDescription matnlari to'ldirilgan.",
    preview: "dev_client",
    packages: ["expo-image-picker", "expo-camera", "expo-image"],
    files: ["lib/media.ts", "components/image-picker.tsx"],
    storeRequirements: [
      {
        clause: "5.1.1",
        requirementUz:
          "NSCameraUsageDescription va NSPhotoLibraryUsageDescription mazmunli to'ldirilsin.",
        coveredByBlock: true,
      },
    ],
    generationPolicy: "parameterize_only",
  },

  analytics: {
    id: "analytics",
    nameUz: "Analitika",
    descriptionUz: "Ixtiyoriy, rozilik bilan. Privacy labels avtomatik to'ldiriladi.",
    preview: "expo_go",
    packages: [],
    files: ["lib/analytics.ts"],
    storeRequirements: [
      {
        clause: "Privacy",
        requirementUz: "App Privacy nutrition labels to'ldirilishi shart.",
        coveredByBlock: true,
      },
    ],
    generationPolicy: "parameterize_only",
  },

  onboarding: {
    id: "onboarding",
    nameUz: "Onboarding",
    descriptionUz: "Kirish oqimi va ruxsatlarni to'g'ri tartibda so'rash.",
    preview: "expo_go",
    packages: [],
    files: ["app/(onboarding)/index.tsx", "app/(onboarding)/permissions.tsx"],
    storeRequirements: [],
    generationPolicy: "extend_allowed",
  },

  navigation: {
    id: "navigation",
    nameUz: "Navigatsiya",
    descriptionUz:
      "Expo Router asosidagi qotirilgan navigatsiya. AI eng ko'p shu yerda xato qiladi (spek 17.2).",
    preview: "expo_go",
    packages: ["expo-router"],
    files: ["app/_layout.tsx", "app/(app)/_layout.tsx"],
    storeRequirements: [],
    // Agent navigatsiyani generatsiya qilmaydi.
    generationPolicy: "parameterize_only",
  },
};

export const ALL_BLOCKS = Object.values(BLOCKS);

/** Tanlangan bloklardan biri dev client talab qiladimi — preview qarori uchun. */
export function requiresDevClient(blockIds: readonly string[]): boolean {
  return blockIds.some((id) => BLOCKS[id as BlockId]?.preview === "dev_client");
}

export function packagesFor(blockIds: readonly string[]): string[] {
  const set = new Set<string>();
  for (const id of blockIds) {
    for (const p of BLOCKS[id as BlockId]?.packages ?? []) set.add(p);
  }
  return [...set].sort();
}

/**
 * 3.1.1 bandi qorovuli — spek 14.2.
 * To'lov blokimiz noto'g'ri tanlovni avtomatik aniqlab, build'ni to'xtatishi SHART.
 */
export function checkPaymentChoice(
  blockIds: readonly string[],
  sells: "digital" | "physical_or_service",
): { ok: boolean; messageUz: string } {
  const hasLocal = blockIds.includes("payments_local");
  const hasIap = blockIds.includes("payments_iap");

  if (sells === "digital" && hasLocal && !hasIap) {
    return {
      ok: false,
      messageUz:
        "Siz raqamli mahsulot sotasiz (obuna, kursga kirish, premium funksiya). Apple 3.1.1 bandi bo'yicha bu faqat In-App Purchase orqali bo'lishi kerak. Payme/Click blokini qo'shsak, ilova aniq rad etiladi.",
    };
  }
  if (sells === "physical_or_service" && hasIap && !hasLocal) {
    return {
      ok: false,
      messageUz:
        "Siz jismoniy tovar yoki real xizmat sotasiz. Apple bunda In-App Purchase'ni talab qilmaydi va 30% komissiya keraksiz — Payme/Click blokidan foydalanish to'g'riroq.",
    };
  }
  return { ok: true, messageUz: "To'lov usuli mahsulot turiga mos." };
}
