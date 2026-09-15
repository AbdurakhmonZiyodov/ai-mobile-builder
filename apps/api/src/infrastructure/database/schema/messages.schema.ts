import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Suhbat tarixi.
 *
 * Agent kontekstiga oxirgi 5 xabar to'liq, qolgani xulosa sifatida kiradi —
 * shuning uchun tartib bo'yicha indeks kerak.
 */
export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    /** user | assistant */
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_project_idx").on(t.projectId, t.createdAt)],
);

export type Message = typeof messages.$inferSelect;
