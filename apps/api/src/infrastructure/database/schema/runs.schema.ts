import { bigint, boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Agentning har bir ishga tushishi.
 *
 * `costCents` — BIZNING ichki xarajatimiz, mijoznikidan farqli.
 * Bitta o'zgarishning o'rtacha xarajati $0,60 dan oshsa, $5 lik narx
 * marjani yo'qotadi. Shuning uchun har run yoziladi.
 */
export const runs = pgTable(
  "runs",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    /** question | unclear | design | small_edit | medium | large | repair */
    kind: text("kind").notNull(),
    prompt: text("prompt").notNull(),

    /** passed | failed | skipped */
    verifyStatus: text("verify_status").notNull().default("skipped"),
    /** Nechta bepul tuzatish urinishi ketdi — marja ko'rsatkichi */
    repairAttempts: integer("repair_attempts").notNull().default(0),

    chargedUnits: integer("charged_units").notNull().default(0),
    chargeReasonUz: text("charge_reason_uz"),

    costCents: bigint("cost_cents", { mode: "number" }).notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),

    versionId: text("version_id"),
    ok: boolean("ok").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("runs_project_idx").on(t.projectId, t.createdAt)],
);

export type Run = typeof runs.$inferSelect;
