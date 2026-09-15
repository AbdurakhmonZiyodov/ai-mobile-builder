import type { DomainPack } from "../types.js";

/** Kichik do'kon va katalog. */
export const shop: DomainPack = {
  id: "shop",
  nameUz: "Kichik do'kon va katalog",
  descriptionUz: "Mahsulotlar ro'yxati, savat, buyurtma berish.",
  examplesUz: ["Kiyim do'koni", "Gul do'koni", "Elektronika katalogi"],
  recommendedBlocks: ["auth", "data", "media", "payments_local", "onboarding", "navigation"],
  sells: "physical_or_service",
  minScreens: 6,
  entities: [
    {
      name: "Product",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "title", type: "text", required: true },
        { name: "priceUzs", type: "bigint", required: true },
        { name: "imageUrl", type: "text", required: false },
        { name: "stock", type: "int", required: true },
      ],
    },
    {
      name: "Order",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "userId", type: "uuid", required: true, noteUz: "RLS: faqat o'zi ko'radi" },
        { name: "totalUzs", type: "bigint", required: true },
        { name: "status", type: "text", required: true },
        { name: "paymentProvider", type: "text", required: false, noteUz: "payme|click|uzum|cash" },
      ],
    },
  ],
  flows: [
    { id: "buy", nameUz: "Xarid", steps: ["Katalog", "Mahsulot", "Savat", "Buyurtma", "Tasdiq"] },
  ],
  evals: [
    {
      id: "cart",
      titleUz: "Mahsulotni savatga qo'shib, buyurtma bera oladimi",
      steps: ["Katalogdan mahsulot tanla", "Savatga qo'sh", "Savatga o't", "Buyurtma berish"],
      expectUz: "Savatda mahsulot va to'g'ri summa ko'rinadi, buyurtma yaratiladi.",
      critical: true,
    },
    {
      id: "price-format",
      titleUz: "Narx so'mda to'g'ri formatlanganmi",
      steps: ["Katalogni och"],
      expectUz: "Narxlar '150 000 so'm' ko'rinishida, bo'linmalar bilan.",
      critical: false,
    },
    {
      id: "empty-cart",
      titleUz: "Bo'sh savat holati",
      steps: ["Savatga o't"],
      expectUz: "'Savat bo'sh' matni va katalogga qaytish tugmasi bor.",
      critical: false,
    },
  ],
};
