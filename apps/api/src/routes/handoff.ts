import { Hono } from "hono";
import { getDomainPack } from "@amb/domains";
import { BLOCKS } from "@amb/blocks";
import { workspaces } from "../deps.js";
import { findProject } from "./projects.js";

export const handoffRoutes = new Hono();

/**
 * Dasturchiga topshirish paketi — spek 13.4.
 * Maqsad: biznes egasiga dasturchi bilan gaplashish uchun TIL berish.
 */
handoffRoutes.post("/:id", async (c) => {
  const project = await findProject(c.req.param("id"));
  if (!project) return c.json({ error: "Loyiha topilmadi" }, 404);

  const ws = workspaces.get(project.id);
  const pack = getDomainPack(project.domainPack);
  const tree = await ws.tree();
  const screens = tree.filter((f) => f.path.startsWith("app/") && /\.(tsx|jsx)$/.test(f.path));

  const architecture = [
    `# ARCHITECTURE.md`,
    "",
    `**Stek:** Expo SDK ${project.sdk} · React Native · TypeScript strict · Expo Router · @expo/ui`,
    "",
    "## Ekranlar xaritasi",
    ...screens.map((s) => `- \`${s.path}\``),
    "",
    "## Ma'lumot modeli",
    ...(pack?.entities.map(
      (e) => `### ${e.name}\n${e.fields.map((f) => `- ${f.name}: ${f.type}${f.required ? " (majburiy)" : ""}`).join("\n")}`,
    ) ?? ["(domen paketi tanlanmagan)"]),
    "",
    "## Tashqi xizmatlar",
    ...project.blocks.flatMap((b) => {
      const block = BLOCKS[b as keyof typeof BLOCKS];
      return block ? [`- ${block.nameUz}: ${block.packages.join(", ") || "tashqi paketsiz"}`] : [];
    }),
    "",
  ].join("\n");

  const handoff = [
    `# HANDOFF.md`,
    "",
    `Loyiha: **${project.name}**`,
    "",
    "## Nima tugallangan",
    ...project.blocks.map((b) => `- ${BLOCKS[b as keyof typeof BLOCKS]?.nameUz ?? b} bloki ulangan`),
    "",
    "## Nima yo'q",
    "- Murakkab animatsiyalar va o'yin mexanikasi",
    "- Chuqur native integratsiyalar (Bluetooth, NFC, maxsus SDK)",
    "- Og'ir offline sinxronizatsiya konflikt yechimi bilan",
    "- Apple Watch, widget, Live Activities",
    "",
    "## Texnik qarz",
    "- Testlar: faqat E2E oqim tekshiruvi bor, unit testlar yozilmagan",
    "- Xatoliklarni kuzatish (Sentry) ulanmagan",
    "",
    "## Akkauntlar",
    "| Xizmat | Kimda | Izoh |",
    "| --- | --- | --- |",
    "| Apple Developer | Mijozda | Biz App Manager roli bilan kiramiz |",
    "| Google Play | Mijozda | — |",
    "| Supabase | Mijozda | Kalitlar mijoznikida, lock-in yo'q |",
    "",
    "## Keyingi ishlar uchun taxminiy soatlar",
    "| Ish | Soat |",
    "| --- | --- |",
    "| Yangi ekran qo'shish | 4–8 |",
    "| To'lov integratsiyasini kengaytirish | 12–20 |",
    "| Push bildirishnoma backend'i | 8–16 |",
    "",
  ].join("\n");

  const readme = [
    `# ${project.name}`,
    "",
    "AI mobil ilova builder orqali yaratilgan. Kod sizniki.",
    "",
    "## Ishga tushirish",
    "```bash",
    "npm install",
    "npx expo start",
    "```",
    "",
    "## Muhit o'zgaruvchilari",
    "`.env.example` faylidan nusxa oling va `.env` deb nomlang.",
    "",
    `## Expo SDK ${project.sdk}`,
    "Loyiha shu SDK'da qotirilgan. Yangilash alohida ish — avtomatik yangilamang.",
    "",
  ].join("\n");

  await ws.write("ARCHITECTURE.md", architecture);
  await ws.write("HANDOFF.md", handoff);
  await ws.write("README.md", readme);
  const sha = await ws.commit("Dasturchiga topshirish paketi");

  return c.json({
    ok: true,
    files: ["README.md", "ARCHITECTURE.md", "HANDOFF.md", ".env.example"],
    gitSha: sha,
    messageUz:
      "Topshirish paketi tayyor. Endi dasturchiga 'menga ilova kerak' emas, 'mana kod, mana hujjat, mana qolgan ishlar' deb aytishingiz mumkin.",
  });
});
