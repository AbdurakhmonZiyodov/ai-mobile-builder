import { BLOCKS, type BlockId } from "@amb/blocks";
import type { DomainPack } from "@amb/domains";
import type { WorkspaceDriver } from "../../infrastructure/workspace/drivers/driver.interface.js";

/**
 * `PROJECT.md` va `DESIGN.md` — agent kontekstining poydevori.
 *
 * Nega fayl, bazada emas: agent ularni o'qiy oladi va kerak bo'lsa
 * yangilaydi. Mijoz kodni eksport qilganda ular ham ketadi — dasturchi
 * loyihaning maqsadini o'sha yerdan tushunadi.
 */
export async function seedProjectDocs(
  ws: WorkspaceDriver,
  input: { name: string; prompt: string; pack: DomainPack | null; blocks: readonly string[] },
): Promise<void> {
  await ws.write("PROJECT.md", buildProjectMd(input));
  await ws.write("DESIGN.md", buildDesignMd(input.pack));
}

function buildProjectMd(input: {
  name: string;
  prompt: string;
  pack: DomainPack | null;
  blocks: readonly string[];
}): string {
  const readyWhen = input.pack?.evals.map((e) => `- ${e.titleUz}`) ?? ["- Asosiy oqim ishlaydi"];

  return [
    `# ${input.name}`,
    "",
    "## Mijoz nima so'radi",
    input.prompt,
    "",
    "## Domen paketi",
    input.pack ? `${input.pack.nameUz} — ${input.pack.descriptionUz}` : "Aniqlanmagan",
    "",
    "## Bloklar",
    ...input.blocks.map((id) => `- ${BLOCKS[id as BlockId]?.nameUz ?? id}`),
    "",
    "## Tayyor deb hisoblanadi, agar",
    ...readyWhen,
    "",
  ].join("\n");
}

function buildDesignMd(pack: DomainPack | null): string {
  const screens = pack?.flows.flatMap((flow) => [
    `### ${flow.nameUz}`,
    ...flow.steps.map((step) => `- ${step}`),
    "",
  ]) ?? [];

  return [
    "# Dizayn qarorlari",
    "",
    "## Ekranlar",
    ...screens,
    "## Uslub",
    "- Ranglar: mijoz brendidan olinadi (hali belgilanmagan)",
    "- Primitivlar: @expo/ui — iOS'da SwiftUI, Android'da Jetpack Compose",
    "- Til: o'zbek (lotin). Ikkinchi til: rus",
    "- Pul formati: so'm, uch xonali bo'linma bilan",
    "",
  ].join("\n");
}
