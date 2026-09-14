import { Hono } from "hono";
import {
  ALL_DOMAIN_PACKS,
} from "@amb/domains";
import { ALL_BLOCKS } from "@amb/blocks";
import {
  ASSISTED_PUBLISH_PRICE,
  EXTRA_CHANGE_PRICE,
  PLANS,
  PREVIEW_PATHS,
  SDK_REGISTRY,
  THIRD_PARTY_COSTS,
} from "@amb/shared";

export const catalogRoutes = new Hono();

/** Bloklar — preview belgisi bilan (spek 4.2). Mijoz tanlashdan OLDIN ko'radi. */
catalogRoutes.get("/blocks", (c) => c.json({ blocks: ALL_BLOCKS }));

catalogRoutes.get("/domains", (c) =>
  c.json({
    packs: ALL_DOMAIN_PACKS.map((p) => ({
      id: p.id,
      nameUz: p.nameUz,
      descriptionUz: p.descriptionUz,
      examplesUz: p.examplesUz,
      recommendedBlocks: p.recommendedBlocks,
      sells: p.sells,
      minScreens: p.minScreens,
      evalCount: p.evals.length,
    })),
  }),
);

/** Narx — barcha xarajat bitta jadvalda (spek 15.2). */
catalogRoutes.get("/pricing", (c) =>
  c.json({
    plans: Object.values(PLANS),
    extraChange: EXTRA_CHANGE_PRICE,
    assistedPublish: ASSISTED_PUBLISH_PRICE,
    thirdPartyCosts: THIRD_PARTY_COSTS,
    /** Mijozning uchta savoliga javob — har ekranda bo'lishi kerak. */
    faqUz: [
      { q: "Nima bitta o'zgarish hisoblanadi?", a: "Rangni o'zgartirish — 1. Yangi ekran — 1. Savol berish — 0. Xato tuzatish — 0." },
      { q: "$99 yana alohidami?", a: "Ha. Apple Developer yiliga $99, Google Play bir marta $25. Supabase bepul tarifi yetadi." },
      { q: "Qoldiq yonadimi?", a: "Yo'q. Sotib olingan o'zgarishlar muddatsiz." },
      { q: "Obuna tugasa nima bo'ladi?", a: "Kod sizda qoladi. GitHub eksport hamma tarifda bor." },
    ],
  }),
);

catalogRoutes.get("/preview-paths", (c) => c.json({ paths: Object.values(PREVIEW_PATHS) }));
catalogRoutes.get("/sdks", (c) => c.json({ sdks: SDK_REGISTRY }));
