import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * EAS build va do'konga chiqarish.
 *
 * Build 5–15 daqiqa davom etadi, shuning uchun holat bazada kuzatiladi —
 * mijoz sahifani yopib ketsa ham jarayon yo'qolmaydi.
 */
export const builds = pgTable(
  "builds",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    /** development | preview | production | eas-go */
    profile: text("profile").notNull(),
    /** ios | android */
    platform: text("platform").notNull(),
    /** queued | running | finished | failed | cancelled */
    status: text("status").notNull().default("queued"),
    easBuildId: text("eas_build_id"),
    artifactUrl: text("artifact_url"),
    /** Jonli log oxiri — mijozga ko'rsatiladi */
    logTail: text("log_tail"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("builds_project_idx").on(t.projectId, t.createdAt)],
);

export type Build = typeof builds.$inferSelect;
