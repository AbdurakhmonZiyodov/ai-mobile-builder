import type { DomainPack } from "../types.js";

/** Yetkazib berish va buyurtma. */
export const delivery: DomainPack = {
  id: "delivery",
  nameUz: "Yetkazib berish va buyurtma",
  descriptionUz: "Menyu, savat, manzil, buyurtma holati.",
  examplesUz: ["Restoran yetkazib berish", "Oshxona", "Suv yetkazish"],
  recommendedBlocks: ["auth", "data", "notifications", "payments_local", "media", "navigation"],
  sells: "physical_or_service",
  minScreens: 7,
  entities: [
    {
      name: "MenuItem",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "title", type: "text", required: true },
        { name: "priceUzs", type: "bigint", required: true },
        { name: "category", type: "text", required: true },
      ],
    },
    {
      name: "Address",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "userId", type: "uuid", required: true },
        { name: "line", type: "text", required: true },
        { name: "lat", type: "float8", required: false },
        { name: "lng", type: "float8", required: false },
      ],
    },
    {
      name: "Order",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "userId", type: "uuid", required: true },
        { name: "addressId", type: "uuid", required: true },
        { name: "status", type: "text", required: true, noteUz: "new|cooking|on_way|delivered" },
      ],
    },
  ],
  flows: [
    { id: "order", nameUz: "Buyurtma", steps: ["Menyu", "Savat", "Manzil", "To'lov", "Holat"] },
  ],
  evals: [
    {
      id: "order-flow",
      titleUz: "To'liq buyurtma oqimi ishlaydimi",
      steps: ["Menyudan taom tanla", "Savatga qo'sh", "Manzil kirit", "Buyurtmani tasdiqla"],
      expectUz: "Buyurtma holati ekrani ochiladi va buyurtma raqami ko'rinadi.",
      critical: true,
    },
    {
      id: "offline",
      titleUz: "Internet uzilganda ilova qulab tushmaydimi",
      steps: ["Aviarejimni yoq", "Menyuni och"],
      expectUz: "Kesh ko'rsatiladi yoki tushunarli xato matni chiqadi, oq ekran emas.",
      critical: true,
    },
  ],
};
