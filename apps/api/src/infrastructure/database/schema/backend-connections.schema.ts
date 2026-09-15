import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Mijozning o'z backend kalitlari (Supabase yoki Firebase).
 *
 * Uchta qat'iy qoida shu jadvalda ko'rinadi:
 *
 * 1. Kalitlar MIJOZNIKI. Biz Supabase loyihasini o'zimiz yaratmaymiz —
 *    aks holda mijoz ketganda ma'lumoti bizda qoladi, bu lock-in.
 *
 * 2. `service_role` RLS'ni butunlay chetlab o'tadi. U hech qachon
 *    generatsiya qilingan kodga tushmaydi, faqat serverda shifrlangan turadi
 *    va sxema yaratilgach O'CHIRILADI (`serviceRoleDeletedAt`).
 *
 * 3. Ilovaga faqat `anon` kalit ketadi.
 */
export const backendConnections = pgTable("backend_connections", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  /** supabase | firebase */
  provider: text("provider").notNull(),
  url: text("url"),

  /** AES-256-GCM bilan shifrlangan. Ochiq holda hech qachon saqlanmaydi. */
  anonKeyEnc: text("anon_key_enc"),
  serviceRoleKeyEnc: text("service_role_key_enc"),
  /** To'ldirilgan bo'lsa — kalit o'chirilgan, ishlatib bo'lmaydi */
  serviceRoleDeletedAt: timestamp("service_role_deleted_at", { withTimezone: true }),
  firebaseConfigEnc: text("firebase_config_enc"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BackendConnection = typeof backendConnections.$inferSelect;
