import type { DomainPack } from "../types.js";

/** Ichki vosita — xodimlar uchun, do'kon riski eng past. */
export const internal: DomainPack = {
  id: "internal",
  nameUz: "Ichki vosita",
  descriptionUz: "Xodimlar uchun ro'yxat, forma va hisobot.",
  examplesUz: ["Ombor hisobi", "Sotuvchi ilovasi", "Ish topshiriqlari"],
  recommendedBlocks: ["auth", "data", "media", "navigation"],
  sells: "physical_or_service",
  minScreens: 5,
  entities: [
    {
      name: "Record",
      fields: [
        { name: "id", type: "uuid", required: true },
        { name: "title", type: "text", required: true },
        { name: "assigneeId", type: "uuid", required: false },
        { name: "status", type: "text", required: true },
        { name: "photoUrl", type: "text", required: false },
      ],
    },
  ],
  flows: [
    { id: "crud", nameUz: "Yozuv bilan ishlash", steps: ["Ro'yxat", "Yozuv", "Tahrirlash", "Saqlash"] },
  ],
  evals: [
    {
      id: "crud",
      titleUz: "Yozuv yaratish va tahrirlash ishlaydimi",
      steps: ["Yangi yozuv tugmasini bos", "Nom kirit", "Saqla", "Ro'yxatga qayt", "Yozuvni och"],
      expectUz: "Yangi yozuv ro'yxatda turibdi va ichida kiritilgan nom saqlangan.",
      critical: true,
    },
  ],
};
