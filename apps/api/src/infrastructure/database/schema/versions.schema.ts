import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Versiya — workspace'dagi git commit'ning ko'zgusi.
 *
 * Nega bazada ham saqlanadi: mijoz «v13 ga qaytar» deganda unga git SHA emas,
 * o'zi yozgan so'rov matni ko'rsatilishi kerak.
 */
export const versions = pgTable(
  "versions",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    gitSha: text("git_sha").notNull(),
    /** Mijoz ko'radigan nom — uning o'z so'rovi */
    label: text("label").notNull(),
    filesChanged: jsonb("files_changed")
      .$type<Array<{ path: string; added: number; removed: number }>>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("versions_project_idx").on(t.projectId, t.createdAt)],
);

export type Version = typeof versions.$inferSelect;
