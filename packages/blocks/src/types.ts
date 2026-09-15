import type { PreviewPath } from "@amb/core-rules";

export type BlockId =
  | "auth"
  | "data"
  | "payments_iap"
  | "payments_local"
  | "notifications"
  | "media"
  | "analytics"
  | "onboarding"
  | "navigation";

export interface StoreRequirement {
  /** Apple App Store Review Guidelines bandi, masalan "5.1.1(v)" */
  clause: string;
  requirementUz: string;
  /** Blok shu talabni avtomatik qoplaydimi */
  coveredByBlock: boolean;
}

export interface Block {
  id: BlockId;
  nameUz: string;
  descriptionUz: string;
  /** Blok Expo Go'da ishlaydimi yoki dev client kerakmi — spek 4.2.
   *  Mijoz buni blok TANLASHDAN OLDIN ko'rishi kerak. */
  preview: Extract<PreviewPath, "expo_go" | "dev_client">;
  /** Ilovaga qo'shiladigan npm paketlar */
  packages: string[];
  /** Blok generatsiya qiladigan fayllar (shablon ichida) */
  files: string[];
  storeRequirements: StoreRequirement[];
  /** Agent bu blokni noldan yozishi TAQIQLANGAN — faqat parametrlashtiradi. */
  generationPolicy: "parameterize_only" | "extend_allowed";
  /** Faqat shu turdagi mahsulot uchun (spek 14.2 — 3.1.1 bandi) */
  allowedGoods?: "physical_or_service" | "digital";
}
