import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import { ID, DEFAULT_SDK, PLANS, createProjectInput, decidePreviewPath, EXPO_GO_APP_STORE_SDK } from "@amb/shared";
import { BLOCKS, requiresDevClient, checkPaymentChoice } from "@amb/blocks";
import { DOMAIN_PACKS, getDomainPack, guessDomainPack } from "@amb/domains";
import { projects, messages, runs, versions } from "@amb/db";
import { db, workspaces } from "../deps.js";
import { env } from "../env.js";

export const projectRoutes = new Hono();

projectRoutes.get("/", async (c) => {
  const rows = await db()
    .select()
    .from(projects)
    .where(eq(projects.userId, env.demoUserId))
    .orderBy(desc(projects.createdAt))
    .limit(50);
  return c.json({ projects: rows.map(toSummary) });
});

projectRoutes.post("/", async (c) => {
  const parsed = createProjectInput.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: "Kiritilgan ma'lumot noto'g'ri", detail: parsed.error.issues }, 400);
  }
  const input = parsed.data;

  // Domen paketi: mijoz tanlamagan bo'lsa birinchi jumladan taxmin qilamiz.
  const packId = input.domainPack ?? guessDomainPack(input.prompt);
  const pack = getDomainPack(packId);

  // Bloklar: mijoz tanlamagan bo'lsa domen tavsiyasini olamiz.
  const blocks = input.blocks.length > 0 ? input.blocks : (pack?.recommendedBlocks ?? ["navigation"]);
  const sells = pack?.sells ?? "physical_or_service";

  // 3.1.1 qorovuli — noto'g'ri to'lov tanlovi bilan boshlamaymiz (spek 14.2).
  const payCheck = checkPaymentChoice(blocks, sells);
  if (!payCheck.ok) {
    return c.json({ error: payCheck.messageUz, clause: "3.1.1" }, 422);
  }

  const id = ID.project();
  const sdk = input.sdk ?? DEFAULT_SDK;
  const plan = PLANS.trial;

  const decision = decidePreviewPath({
    requiresDevClient: requiresDevClient(blocks),
    projectSdk: sdk,
    expoGoSdk: EXPO_GO_APP_STORE_SDK,
    hasAppleAccount: false,
  });

  await db()
    .insert(projects)
    .values({
      id,
      userId: env.demoUserId,
      name: input.name,
      status: "draft",
      sdk,
      domainPack: packId ?? null,
      blocks,
      sells,
      plan: plan.id,
      includedChanges: plan.includedChanges,
      previewPath: decision.path,
    });

  await db().insert(messages).values({
    id: ID.message(),
    projectId: id,
    role: "user",
    content: input.prompt,
  });

  // Workspace shablondan yaratiladi va birinchi commit qilinadi.
  const ws = await workspaces.ensure(id);
  await seedProjectDocs(ws, input.name, input.prompt, packId, blocks);
  await ws.commit("Loyiha hujjatlari");

  return c.json({
    projectId: id,
    domainPack: packId,
    blocks,
    preview: decision,
    /** Mijozga darhol ko'rsatiladigan bloklar jadvali (preview belgisi bilan) */
    blockInfo: blocks.map((b) => {
      const block = BLOCKS[b as keyof typeof BLOCKS];
      return block
        ? { id: block.id, nameUz: block.nameUz, preview: block.preview }
        : { id: b, nameUz: b, preview: "expo_go" };
    }),
  });
});

projectRoutes.get("/:id", async (c) => {
  const row = await findProject(c.req.param("id"));
  if (!row) return c.json({ error: "Loyiha topilmadi" }, 404);
  return c.json(toSummary(row));
});

projectRoutes.get("/:id/files", async (c) => {
  const row = await findProject(c.req.param("id"));
  if (!row) return c.json({ error: "Loyiha topilmadi" }, 404);
  const ws = workspaces.get(row.id);
  return c.json({ files: await ws.tree() });
});

projectRoutes.get("/:id/file", async (c) => {
  const row = await findProject(c.req.param("id"));
  if (!row) return c.json({ error: "Loyiha topilmadi" }, 404);
  const path = c.req.query("path");
  if (!path) return c.json({ error: "path parametri kerak" }, 400);
  try {
    const content = await workspaces.get(row.id).read(path);
    return c.json({ path, content });
  } catch {
    return c.json({ error: "Fayl topilmadi" }, 404);
  }
});

projectRoutes.get("/:id/messages", async (c) => {
  const rows = await db()
    .select()
    .from(messages)
    .where(eq(messages.projectId, c.req.param("id")))
    .orderBy(messages.createdAt)
    .limit(200);
  return c.json({ messages: rows });
});

projectRoutes.get("/:id/versions", async (c) => {
  const rows = await db()
    .select()
    .from(versions)
    .where(eq(versions.projectId, c.req.param("id")))
    .orderBy(desc(versions.createdAt))
    .limit(50);
  return c.json({ versions: rows });
});

/** Undo / Revert — spek 7. */
projectRoutes.post("/:id/revert", async (c) => {
  const row = await findProject(c.req.param("id"));
  if (!row) return c.json({ error: "Loyiha topilmadi" }, 404);
  const body = (await c.req.json()) as { versionId?: string };
  if (!body.versionId) return c.json({ error: "versionId kerak" }, 400);

  const [version] = await db()
    .select()
    .from(versions)
    .where(and(eq(versions.projectId, row.id), eq(versions.id, body.versionId)))
    .limit(1);
  if (!version) return c.json({ error: "Versiya topilmadi" }, 404);

  await workspaces.get(row.id).revertTo(version.gitSha);
  return c.json({ ok: true, revertedTo: version.label });
});

/** Xarajat va metrikalar — har mijoz uchun AI xarajati (spek 16.3). */
projectRoutes.get("/:id/usage", async (c) => {
  const row = await findProject(c.req.param("id"));
  if (!row) return c.json({ error: "Loyiha topilmadi" }, 404);
  const rows = await db().select().from(runs).where(eq(runs.projectId, row.id));

  const totalCostCents = rows.reduce((n, r) => n + r.costCents, 0);
  const billed = rows.filter((r) => r.chargedUnits > 0);
  return c.json({
    runs: rows.length,
    chargedUnits: billed.length,
    totalCostCents,
    avgCostPerChangeCents: billed.length ? totalCostCents / billed.length : 0,
    balance: balanceOf(row),
  });
});

export async function findProject(id: string) {
  const [row] = await db().select().from(projects).where(eq(projects.id, id)).limit(1);
  return row ?? null;
}

export function balanceOf(row: typeof projects.$inferSelect) {
  return {
    included: row.includedChanges,
    used: row.usedChanges,
    extraPurchased: row.extraPurchased,
    extraUsed: row.extraUsed,
  };
}

function toSummary(row: typeof projects.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    sdk: row.sdk,
    domainPack: row.domainPack,
    blocks: row.blocks,
    sells: row.sells,
    plan: row.plan,
    previewPath: row.previewPath,
    previewUrl: row.previewUrl,
    balance: balanceOf(row),
    createdAt: row.createdAt.toISOString(),
  };
}

/** DESIGN.md va PROJECT.md — agent kontekstining poydevori (spek 8.2). */
async function seedProjectDocs(
  ws: Awaited<ReturnType<typeof workspaces.ensure>>,
  name: string,
  prompt: string,
  packId: string | null,
  blocks: readonly string[],
): Promise<void> {
  const pack = packId ? DOMAIN_PACKS[packId] : null;

  await ws.write(
    "PROJECT.md",
    [
      `# ${name}`,
      "",
      "## Mijoz nima so'radi",
      prompt,
      "",
      `## Domen paketi`,
      pack ? `${pack.nameUz} — ${pack.descriptionUz}` : "Aniqlanmagan",
      "",
      "## Bloklar",
      ...blocks.map((b) => `- ${BLOCKS[b as keyof typeof BLOCKS]?.nameUz ?? b}`),
      "",
      "## Tayyor deb hisoblanadi, agar",
      ...(pack?.evals.map((e) => `- ${e.titleUz}`) ?? ["- Asosiy oqim ishlaydi"]),
      "",
    ].join("\n"),
  );

  await ws.write(
    "DESIGN.md",
    [
      "# Dizayn qarorlari",
      "",
      "## Ekranlar",
      ...(pack?.flows.flatMap((f) => [`### ${f.nameUz}`, ...f.steps.map((s) => `- ${s}`)]) ?? []),
      "",
      "## Uslub",
      "- Ranglar: mijoz brendidan olinadi (hali belgilanmagan)",
      "- Primitivlar: @expo/ui (iOS'da SwiftUI, Android'da Jetpack Compose)",
      "- Til: o'zbek (lotin). Ikkinchi til: rus",
      "- Pul formati: so'm, uch xonali bo'linma bilan",
      "",
    ].join("\n"),
  );
}
