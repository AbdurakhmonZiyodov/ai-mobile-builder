import { BLOCKS, type BlockId } from "@amb/blocks";
import { getDomainPack } from "@amb/domains";
import type { Project } from "../../infrastructure/database/schema/index.js";

/**
 * Topshirish paketining matnlari.
 *
 * Nega servisdan ajratilgan: matnlar tez-tez o'zgaradi (mijoz fikri,
 * yangi bo'lim), servis mantiqi esa deyarli o'zgarmaydi. Ularni bir
 * faylda saqlash har matn tahririda servisni qayta o'qishga majbur qilardi.
 */

export function buildReadmeMd(project: Project): string {
  return [
    `# ${project.name}`,
    "",
    "AI mobil ilova builder orqali yaratilgan. **Kod sizniki.**",
    "",
    "## Ishga tushirish",
    "",
    "```bash",
    "npm install",
    "npx expo start",
    "```",
    "",
    "## Muhit o'zgaruvchilari",
    "",
    "`.env.example` faylidan nusxa oling va `.env` deb nomlang.",
    "",
    `## Expo SDK ${project.sdk}`,
    "",
    "Loyiha shu SDK'da qotirilgan — avtomatik yangilamang.",
    "Yangi paket qo'shganda `npm install` emas, `npx expo install <paket>` ishlating:",
    "u SDK'ga mos versiyani tanlaydi.",
    "",
  ].join("\n");
}

export function buildArchitectureMd(project: Project, screens: string[]): string {
  const pack = getDomainPack(project.domainPack);

  const dataModel = pack
    ? pack.entities.map((entity) =>
        [
          `### ${entity.name}`,
          ...entity.fields.map(
            (f) => `- \`${f.name}\`: ${f.type}${f.required ? " (majburiy)" : ""}${f.noteUz ? ` — ${f.noteUz}` : ""}`,
          ),
          "",
        ].join("\n"),
      )
    : ["(domen paketi tanlanmagan)"];

  const services = project.blocks.flatMap((id) => {
    const block = BLOCKS[id as BlockId];
    if (!block) return [];
    return [`- **${block.nameUz}** — ${block.packages.join(", ") || "tashqi paketsiz"}`];
  });

  return [
    "# ARCHITECTURE.md",
    "",
    `**Stek:** Expo SDK ${project.sdk} · React Native · TypeScript strict · Expo Router · @expo/ui`,
    "",
    "## Ekranlar xaritasi",
    "",
    ...screens.map((s) => `- \`${s}\``),
    "",
    "## Ma'lumot modeli",
    "",
    ...dataModel,
    "## Tashqi xizmatlar",
    "",
    ...services,
    "",
  ].join("\n");
}

export function buildHandoffMd(project: Project): string {
  const done = project.blocks.map((id) => `- ${BLOCKS[id as BlockId]?.nameUz ?? id} bloki ulangan`);

  return [
    "# HANDOFF.md",
    "",
    `Loyiha: **${project.name}**`,
    "",
    "## Nima tugallangan",
    "",
    ...done,
    "",
    "## Nima yo'q",
    "",
    "- Murakkab animatsiyalar va o'yin mexanikasi",
    "- Chuqur native integratsiyalar: Bluetooth, NFC, maxsus SDK'lar",
    "- Og'ir offline sinxronizatsiya konflikt yechimi bilan",
    "- Real vaqtdagi video yoki ovoz",
    "- Apple Watch, widget, Live Activities",
    "",
    "## Texnik qarz",
    "",
    "- Unit testlar yozilmagan — faqat oqim tekshiruvi bor",
    "- Xatoliklarni kuzatish (Sentry) ulanmagan",
    "",
    "## Akkauntlar",
    "",
    "| Xizmat | Kimda | Izoh |",
    "| --- | --- | --- |",
    "| Apple Developer | Mijozda | Biz App Manager roli bilan kiramiz |",
    "| Google Play | Mijozda | — |",
    "| Supabase | Mijozda | Kalitlar sizda, lock-in yo'q |",
    "",
    "## Keyingi ishlar uchun taxminiy soatlar",
    "",
    "| Ish | Soat |",
    "| --- | --- |",
    "| Yangi ekran qo'shish | 4–8 |",
    "| To'lov integratsiyasini kengaytirish | 12–20 |",
    "| Push bildirishnoma backend'i | 8–16 |",
    "",
  ].join("\n");
}
