import type { Plan, PreviewPathInfo, SdkRelease } from "@amb/core-rules";

/**
 * Katalog — o'zgarmaydigan ma'lumot: bloklar, domenlar, narx, SDK'lar.
 *
 * Nega bloklarning to'liq shakli bu yerda takrorlanmaydi: u `@amb/blocks`
 * da va web unga bog'lanmaydi — blok ichki tuzilishi (fayllar, npm
 * paketlari, generatsiya siyosati) faqat agentga kerak. Bu yerda mijoz
 * EKRANDA ko'radigan maydonlar bor. Ortiqcha maydon kelsa, TS uni
 * shikoyatsiz o'tkazadi; kam maydon ishlatish esa xavfsiz.
 *
 * Narx, preview yo'llari va SDK'lar esa `@amb/core-rules` dan import
 * qilinadi — ular sof biznes qoidasi va ikkala tomon uchun bitta.
 */

export interface CatalogBlockStoreRequirement {
  clause: string;
  requirementUz: string;
  /** Blok shu talabni avtomatik qoplaydimi. */
  coveredByBlock: boolean;
}

export interface CatalogBlock {
  id: string;
  nameUz: string;
  descriptionUz: string;
  /**
   * Blok telefonda darhol ochiladimi yoki dev client kerakmi.
   *
   * Hal qiluvchi maydon: mijoz buni blok TANLASHDAN OLDIN bilishi kerak,
   * aks holda «ilovam telefonimda ochilmayapti» degan support oqimi
   * boshlanadi.
   */
  preview: "expo_go" | "dev_client";
  storeRequirements: CatalogBlockStoreRequirement[];
}

export interface CatalogDomainPack {
  id: string;
  nameUz: string;
  descriptionUz: string;
  examplesUz: string[];
  recommendedBlocks: string[];
  sells: "digital" | "physical_or_service";
  /** 4.2 bandi — kamida shuncha mazmunli ekran bo'lishi kerak. */
  minScreens: number;
  /** To'liq ro'yxat emas, faqat soni: «12 ta tekshiruv». */
  evalCount: number;
}

/** USD (sent aniqligida) va UZS — mijoz ikkalasini ham ko'radi. */
export interface CatalogPrice {
  usdCents: number;
  uzs: number;
}

export interface CatalogThirdPartyCost {
  keyUz: string;
  usdCents: number;
  periodUz: string;
}

export interface CatalogFaqItem {
  q: string;
  a: string;
}

export interface ListBlocksResponse {
  blocks: CatalogBlock[];
}

export interface ListDomainsResponse {
  packs: CatalogDomainPack[];
}

export interface GetPricingResponse {
  plans: Plan[];
  extraChange: CatalogPrice;
  assistedPublish: CatalogPrice;
  /**
   * Apple $99/yil, Google $25 — ataylab shu javobda: mijozning birinchi
   * savoli «$99 yana alohidami?» va javob narx sahifasida bo'lishi kerak.
   */
  thirdPartyCosts: CatalogThirdPartyCost[];
  faqUz: CatalogFaqItem[];
}

export interface ListPreviewPathsResponse {
  paths: PreviewPathInfo[];
}

export interface ListSdksResponse {
  sdks: SdkRelease[];
}
