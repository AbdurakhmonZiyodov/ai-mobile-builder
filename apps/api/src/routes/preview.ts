import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { EXPO_GO_APP_STORE_SDK, PREVIEW_PATHS, decidePreviewPath } from "@amb/shared";
import { requiresDevClient } from "@amb/blocks";
import { projects } from "@amb/db";
import { db, workspaces } from "../deps.js";
import { findProject } from "./projects.js";

export const previewRoutes = new Hono();

/**
 * Qaysi preview yo'li — spek 10.4.
 * Har holatda mijozga NIMA UCHUN shunday ekani bir jumlada aytiladi.
 */
previewRoutes.get("/:id", async (c) => {
  const project = await findProject(c.req.param("id"));
  if (!project) return c.json({ error: "Loyiha topilmadi" }, 404);

  const hasAppleAccount = c.req.query("apple") === "1";
  const decision = decidePreviewPath({
    requiresDevClient: requiresDevClient(project.blocks),
    projectSdk: project.sdk,
    expoGoSdk: EXPO_GO_APP_STORE_SDK,
    hasAppleAccount,
  });

  return c.json({
    ...decision,
    info: PREVIEW_PATHS[decision.path],
    fallbackInfo: PREVIEW_PATHS[decision.fallback],
    allPaths: Object.values(PREVIEW_PATHS),
  });
});

/**
 * Veb preview — birinchi yo'l, darhol (spek 10.4: 90 soniyagacha).
 * `expo export --platform web` chiqishini beramiz.
 */
previewRoutes.post("/:id/web", async (c) => {
  const project = await findProject(c.req.param("id"));
  if (!project) return c.json({ error: "Loyiha topilmadi" }, 404);

  const ws = workspaces.get(project.id);
  const started = Date.now();
  const res = await ws.exec(
    "npm",
    // `exec` dan keyin `--` bo'lmasa npm bayroqlarni o'zi yeb qo'yadi.
    ["exec", "--", "expo", "export", "--platform", "web", "--output-dir", ".amb-web"],
    { timeoutMs: 300_000 },
  );

  if (res.code !== 0) {
    return c.json(
      {
        ok: false,
        messageUz: "Veb preview yig'ilmadi. Bu o'zgarish hisoblanmadi.",
        logTail: res.stderr.slice(-4000),
      },
      500,
    );
  }

  const url = `/preview/${project.id}/static/index.html`;
  await db().update(projects).set({ previewUrl: url }).where(eq(projects.id, project.id));

  return c.json({ ok: true, url, durationMs: Date.now() - started });
});
