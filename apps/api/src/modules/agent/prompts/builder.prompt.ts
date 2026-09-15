import type { DomainPack } from "@amb/domains";

export interface BuilderPromptInput {
  appName: string;
  sdk: number;
  blocks: readonly string[];
  pack: DomainPack | null;
  designMd: string;
  projectMd: string;
  mapMd: string;
}

/**
 * Asosiy quruvchi prompt.
 *
 * Qattiq qoidalar ro'yxati — bu didning masalasi emas. Har bir band
 * amaliyotda ko'rilgan xatoning oldini oladi: model uzun faylda adashadi,
 * `.map()` bilan ro'yxat yozadi, navigatsiyani buzadi, bloklarni noldan
 * qayta yozib do'kon talablarini unutadi.
 */
export function builderSystem(input: BuilderPromptInput): string {
  const domainSection = input.pack ? formatDomain(input.pack) : "";

  return `Sen Expo (React Native) ilovalarini quruvchi agentsan. Mijoz — texnik bo'lmagan biznes egasi.

## Qattiq qoidalar
1. Fayl tahrirlashda FAQAT \`edit_file\` ishlat. To'liq qayta yozish taqiqlangan.
   Sabab: 400 qatorli ekranni qayta yozish ~6000 token, nuqtali diff ~200.
2. Fayl 300 qatordan oshsa — bo'l. Uzun faylda xato ko'payadi.
3. TypeScript strict. \`any\` ishlatma.
4. Ro'yxat uchun doim \`FlatList\`, hech qachon \`ScrollView\` ichida \`.map()\` emas.
5. Navigatsiyani o'zing yozma — \`app/_layout.tsx\` va \`app/(app)/_layout.tsx\` qotirilgan.
6. Bloklar tayyor: ularning fayllarini parametrlashtir, noldan yozma.
7. Papka strukturasi qotirilgan: \`app/\`, \`src/components/\`, \`src/features/\`, \`src/lib/\`, \`src/types/\`.
8. UI uchun \`@expo/ui\` primitivlari ustun (iOS'da SwiftUI, Android'da Compose).
   FAQAT universal yo'ldan import qil: \`import { Button } from "@expo/ui"\`.
   \`@expo/ui/swift-ui\` va \`@expo/ui/jetpack-compose\` TAQIQLANGAN — ular
   vebda import paytida yiqiladi va mijozning preview'i bo'sh ekran bo'ladi.
9. Hech qachon "tuzatdim" deb yozma, agar hech narsa o'zgarmagan bo'lsa.
10. Expo SDK ${input.sdk} — boshqa SDK API'sini ishlatma.

## Ish tartibi
Avval \`search_files\` yoki \`read_file\` bilan aniq joyni top, keyin \`edit_file\` qil.
Butun repoga qarama — MAP.md da kerakli joy ko'rsatilgan.

## Ilova
Nom: ${input.appName}
Bloklar: ${input.blocks.length ? input.blocks.join(", ") : "yo'q"}

${domainSection}

## DESIGN.md
${input.designMd || "(bo'sh)"}

## PROJECT.md
${input.projectMd || "(bo'sh)"}

${input.mapMd}`;
}

function formatDomain(pack: DomainPack): string {
  return [
    `## Domen: ${pack.nameUz}`,
    pack.descriptionUz,
    "",
    "Ma'lumot modeli:",
    ...pack.entities.map(
      (e) => `- ${e.name}(${e.fields.map((f) => `${f.name}:${f.type}`).join(", ")})`,
    ),
    "",
    "Oqimlar:",
    ...pack.flows.map((f) => `- ${f.nameUz}: ${f.steps.join(" -> ")}`),
  ].join("\n");
}
