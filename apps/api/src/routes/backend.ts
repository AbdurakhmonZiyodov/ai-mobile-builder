import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { ID, connectBackendInput } from "@amb/shared";
import { backendConnections, encryptSecret } from "@amb/db";
import { db } from "../deps.js";
import { findProject } from "./projects.js";

export const backendRoutes = new Hono();

/**
 * Backend ulanish — spek 9-bo'lim.
 * Uchta qat'iy qoida:
 *  1. Kalitlar MIJOZNIKI (lock-in bo'lmasin).
 *  2. `service_role` RLS'ni chetlab o'tadi — faqat serverda, ishlatilgach o'chiriladi.
 *  3. RLS kod emas, blok — agent uni noldan yozmaydi.
 */
backendRoutes.post("/:id", async (c) => {
  const project = await findProject(c.req.param("id"));
  if (!project) return c.json({ error: "Loyiha topilmadi" }, 404);

  const parsed = connectBackendInput.safeParse({ ...(await c.req.json()), projectId: project.id });
  if (!parsed.success) {
    return c.json({ error: "Kiritilgan ma'lumot noto'g'ri", detail: parsed.error.issues }, 400);
  }
  const input = parsed.data;

  if (input.provider === "supabase" && (!input.url || !input.anonKey)) {
    return c.json(
      { error: "Supabase uchun loyiha URL'i va anon kalit kerak." },
      400,
    );
  }

  const [existing] = await db()
    .select()
    .from(backendConnections)
    .where(eq(backendConnections.projectId, project.id))
    .limit(1);

  const values = {
    provider: input.provider,
    url: input.url ?? null,
    anonKeyEnc: input.anonKey ? encryptSecret(input.anonKey) : null,
    serviceRoleKeyEnc: input.serviceRoleKey ? encryptSecret(input.serviceRoleKey) : null,
    firebaseConfigEnc: input.firebaseConfig ? encryptSecret(JSON.stringify(input.firebaseConfig)) : null,
  };

  if (existing) {
    await db()
      .update(backendConnections)
      .set(values)
      .where(eq(backendConnections.projectId, project.id));
  } else {
    await db().insert(backendConnections).values({
      id: ID.project().replace("prj", "bcn"),
      projectId: project.id,
      ...values,
    });
  }

  return c.json({
    ok: true,
    provider: input.provider,
    messageUz:
      "Ulandi. Kalitlaringiz shifrlangan holda saqlandi. service_role kaliti sxema yaratilgach o'chiriladi va hech qachon ilova kodiga tushmaydi.",
    warnings:
      input.provider === "firebase"
        ? [
            "Firebase qo'llab-quvvatlanadi, lekin standart emas: undan chiqish og'ir. Supabase Postgres bo'lgani uchun ma'lumotingizni istalgan payt SQL dump bilan ko'chira olasiz.",
          ]
        : [],
  });
});

/** service_role kalitini o'chirish — sxema o'zgarishi tugagach MAJBURIY. */
backendRoutes.post("/:id/burn-service-role", async (c) => {
  const project = await findProject(c.req.param("id"));
  if (!project) return c.json({ error: "Loyiha topilmadi" }, 404);

  await db()
    .update(backendConnections)
    .set({ serviceRoleKeyEnc: null, serviceRoleDeletedAt: new Date() })
    .where(eq(backendConnections.projectId, project.id));

  return c.json({ ok: true, messageUz: "service_role kaliti o'chirildi." });
});

backendRoutes.get("/:id", async (c) => {
  const [row] = await db()
    .select()
    .from(backendConnections)
    .where(eq(backendConnections.projectId, c.req.param("id")))
    .limit(1);
  if (!row) return c.json({ connected: false });

  // Kalitlarning o'zi HECH QACHON qaytarilmaydi.
  return c.json({
    connected: true,
    provider: row.provider,
    url: row.url,
    hasAnonKey: Boolean(row.anonKeyEnc),
    serviceRoleActive: Boolean(row.serviceRoleKeyEnc),
    serviceRoleDeletedAt: row.serviceRoleDeletedAt,
  });
});
