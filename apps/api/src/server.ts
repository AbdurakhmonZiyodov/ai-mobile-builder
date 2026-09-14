import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import fs from "node:fs/promises";
import path from "node:path";
import { getModelProvider } from "@amb/ai";
import { env } from "./env.js";
import { projectRoutes } from "./routes/projects.js";
import { chatRoutes } from "./routes/chat.js";
import { previewRoutes } from "./routes/preview.js";
import { reviewRoutes } from "./routes/review.js";
import { handoffRoutes } from "./routes/handoff.js";
import { backendRoutes } from "./routes/backend.js";
import { catalogRoutes } from "./routes/catalog.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: [env.webOrigin], credentials: true }));

app.get("/health", (c) =>
  c.json({
    ok: true,
    modelProvider: getModelProvider().id,
    workspaceRoot: env.workspaceRoot,
    templateDir: env.templateDir,
  }),
);

app.route("/projects", projectRoutes);
app.route("/chat", chatRoutes);
app.route("/preview", previewRoutes);
app.route("/review", reviewRoutes);
app.route("/handoff", handoffRoutes);
app.route("/backend", backendRoutes);
app.route("/catalog", catalogRoutes);

/**
 * Veb preview chiqishi — `expo export` natijasi.
 * `serveStatic` ni ishlatmaymiz: uning `root` i cwd ga nisbatan, workspace esa
 * absolut yo'lda. Faylni o'zimiz beramiz va har yo'lni chegara ichida tekshiramiz.
 */
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

app.get("/preview/:id/static/*", async (c) => {
  const id = c.req.param("id");
  if (!/^[a-zA-Z0-9_-]{3,64}$/.test(id)) return c.json({ error: "Noto'g'ri ID" }, 400);

  const rest = c.req.path.split("/static/")[1] ?? "";
  const base = path.join(env.workspaceRoot, id, ".amb-web");
  const target = path.resolve(base, rest || "index.html");
  if (target !== base && !target.startsWith(base + path.sep)) {
    return c.json({ error: "Ruxsat yo'q" }, 403);
  }

  try {
    const file = await fs.readFile(target);
    const type = MIME[path.extname(target).toLowerCase()] ?? "application/octet-stream";
    return c.body(new Uint8Array(file), 200, { "content-type": type });
  } catch {
    return c.json({ error: "Preview topilmadi. Avval veb preview yig'ing." }, 404);
  }
});

app.notFound((c) => c.json({ error: "Topilmadi" }, 404));

app.onError((err, c) => {
  console.error("[api]", err);
  return c.json({ error: "Server xatosi", detail: err.message }, 500);
});

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`[api] http://localhost:${info.port}`);
  console.log(`[api] model provayder: ${getModelProvider().id}`);
  console.log(`[api] workspace: ${env.workspaceRoot}`);
});

export type AppType = typeof app;
