import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { eq } from "drizzle-orm";
import { ID, sendMessageInput, type AgentEvent } from "@amb/shared";
import { runAgent } from "@amb/agent";
import { messages, projects, runs, versions } from "@amb/db";
import { db, workspaces } from "../deps.js";
import { balanceOf, findProject } from "./projects.js";

export const chatRoutes = new Hono();

/**
 * Agent tsikli — bitta SSE oqimi.
 * Web faqat shu hodisalarni biladi; boshqa kanal yo'q (spek 8).
 */
chatRoutes.post("/", async (c) => {
  const parsed = sendMessageInput.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: "Kiritilgan ma'lumot noto'g'ri", detail: parsed.error.issues }, 400);
  }
  const { projectId, text, designMode } = parsed.data;

  const project = await findProject(projectId);
  if (!project) return c.json({ error: "Loyiha topilmadi" }, 404);

  const history = await db()
    .select()
    .from(messages)
    .where(eq(messages.projectId, projectId))
    .orderBy(messages.createdAt)
    .limit(100);

  await db().insert(messages).values({
    id: ID.message(),
    projectId,
    role: "user",
    content: text,
  });

  const ws = await workspaces.ensure(projectId);

  return streamSSE(c, async (stream) => {
    const send = (event: AgentEvent) => {
      void stream.writeSSE({ event: event.type, data: JSON.stringify(event) });
    };

    try {
      const outcome = await runAgent(
        {
          ws,
          projectId,
          appName: project.name,
          sdk: project.sdk,
          blocks: project.blocks,
          domainPack: project.domainPack,
          history: history.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
            createdAt: m.createdAt.getTime(),
          })),
          prompt: text,
          designMode,
          balance: balanceOf(project),
        },
        send,
      );

      await persistOutcome(projectId, text, outcome);
    } catch (err) {
      send({
        type: "error",
        messageUz: "Kutilmagan xatolik yuz berdi. Bu o'zgarish hisoblanmadi.",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  });
});

async function persistOutcome(
  projectId: string,
  prompt: string,
  outcome: Awaited<ReturnType<typeof runAgent>>,
): Promise<void> {
  const database = db();

  if (outcome.assistantText.trim()) {
    await database.insert(messages).values({
      id: ID.message(),
      projectId,
      role: "assistant",
      content: outcome.assistantText,
    });
  }

  let versionRowId: string | null = null;
  if (outcome.versionId) {
    versionRowId = ID.version();
    await database.insert(versions).values({
      id: versionRowId,
      projectId,
      gitSha: outcome.versionId,
      label: prompt.slice(0, 80),
      filesChanged: outcome.changedFiles.map((f) => ({
        path: f.path,
        added: f.added,
        removed: f.removed,
      })),
    });
  }

  await database.insert(runs).values({
    id: outcome.runId,
    projectId,
    kind: outcome.kind,
    prompt,
    verifyStatus: outcome.verify ? (outcome.verify.ok ? "passed" : "failed") : "skipped",
    chargedUnits: outcome.units,
    chargeReasonUz: outcome.chargeReasonUz,
    costCents: Math.round(outcome.costCents),
    durationMs: outcome.durationMs,
    versionId: versionRowId,
    ok: outcome.ok,
  });

  // Hisob faqat verify gate o'tgan va diff bo'lgan holatda oshadi (spek 5.2).
  if (outcome.units === 1) {
    const [row] = await database
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    if (row) {
      const planLeft = row.includedChanges - row.usedChanges;
      if (planLeft > 0) {
        await database
          .update(projects)
          .set({ usedChanges: row.usedChanges + 1, updatedAt: new Date() })
          .where(eq(projects.id, projectId));
      } else {
        await database
          .update(projects)
          .set({ extraUsed: row.extraUsed + 1, updatedAt: new Date() })
          .where(eq(projects.id, projectId));
      }
    }
  }
}
