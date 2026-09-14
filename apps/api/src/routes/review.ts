import { Hono } from "hono";
import { runReviewChecker, type CheckerFile } from "@amb/review-checker";
import { getDomainPack } from "@amb/domains";
import { workspaces } from "../deps.js";
import { findProject } from "./projects.js";

export const reviewRoutes = new Hono();

/**
 * Review Checker — spek 13.3.
 * Kafolatning sharti: birinchi urinishda o'tish 50% dan pastga tushsa model buziladi.
 */
reviewRoutes.get("/:id", async (c) => {
  const project = await findProject(c.req.param("id"));
  if (!project) return c.json({ error: "Loyiha topilmadi" }, 404);

  const ws = workspaces.get(project.id);
  const entries = (await ws.tree()).filter(
    (e) => e.type === "file" && /\.(tsx?|jsx?|json)$/.test(e.path),
  );

  const files: CheckerFile[] = [];
  for (const e of entries.slice(0, 300)) {
    try {
      files.push({ path: e.path, content: await ws.read(e.path) });
    } catch {
      // o'qib bo'lmagan faylni tashlab ketamiz
    }
  }

  let appConfig: Record<string, unknown> = {};
  try {
    appConfig = JSON.parse(await ws.read("app.json")) as Record<string, unknown>;
  } catch {
    appConfig = {};
  }

  const pack = getDomainPack(project.domainPack);
  const report = runReviewChecker({
    files,
    appConfig,
    blocks: project.blocks,
    sells: project.sells === "digital" ? "digital" : "physical_or_service",
    minScreens: pack?.minScreens ?? 5,
  });

  return c.json(report);
});
