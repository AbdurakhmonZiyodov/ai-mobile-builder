import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** Mijoz. MVP'da auth yengil — email bo'yicha. */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  nameUz: text("name_uz"),
  locale: text("locale").notNull().default("uz"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    status: text("status").notNull().default("draft"),
    /** Loyiha bitta SDK'da qotiriladi — avtomatik yangilanmaydi (spek 11.4). */
    sdk: integer("sdk").notNull(),
    domainPack: text("domain_pack"),
    blocks: jsonb("blocks").$type<string[]>().notNull().default([]),
    sells: text("sells").notNull().default("physical_or_service"),
    plan: text("plan").notNull().default("trial"),

    /** O'zgarishlar hisobi — spek 5.2. Qoldiq yonmaydi. */
    includedChanges: integer("included_changes").notNull().default(0),
    usedChanges: integer("used_changes").notNull().default(0),
    extraPurchased: integer("extra_purchased").notNull().default(0),
    extraUsed: integer("extra_used").notNull().default(0),

    previewPath: text("preview_path").notNull().default("web"),
    previewUrl: text("preview_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("projects_user_idx").on(t.userId)],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_project_idx").on(t.projectId, t.createdAt)],
);

/** Har agent ishga tushishi. Xarajat shu yerda o'lchanadi (spek 6.1, 19). */
export const runs = pgTable(
  "runs",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    kind: text("kind").notNull(),
    prompt: text("prompt").notNull(),
    verifyStatus: text("verify_status").notNull().default("skipped"),
    repairAttempts: integer("repair_attempts").notNull().default(0),
    chargedUnits: integer("charged_units").notNull().default(0),
    chargeReasonUz: text("charge_reason_uz"),
    /** Bizning ichki xarajat, USD sentda. Marja nazorati uchun. */
    costCents: bigint("cost_cents", { mode: "number" }).notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
    versionId: text("version_id"),
    ok: boolean("ok").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("runs_project_idx").on(t.projectId, t.createdAt)],
);

/** Git commit'lar — Undo/Revert uchun. */
export const versions = pgTable(
  "versions",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    gitSha: text("git_sha").notNull(),
    label: text("label").notNull(),
    filesChanged: jsonb("files_changed").$type<Array<{ path: string; added: number; removed: number }>>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("versions_project_idx").on(t.projectId, t.createdAt)],
);

/**
 * Mijozning backend kalitlari — spek 9.2.
 * `service_role` shifrlangan holda va ishlatilgach O'CHIRILADI.
 */
export const backendConnections = pgTable("backend_connections", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  provider: text("provider").notNull(),
  url: text("url"),
  anonKeyEnc: text("anon_key_enc"),
  serviceRoleKeyEnc: text("service_role_key_enc"),
  serviceRoleDeletedAt: timestamp("service_role_deleted_at", { withTimezone: true }),
  firebaseConfigEnc: text("firebase_config_enc"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Rad etishlar korpusi — spek 3.1, Ustun 2.
 * Bu ma'lumot sotib olinmaydi va nusxa ko'chirilmaydi, faqat vaqt bilan yig'iladi.
 */
export const rejections = pgTable(
  "rejections",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    store: text("store").notNull(),
    clause: text("clause").notNull(),
    domainPack: text("domain_pack"),
    screen: text("screen"),
    reviewerNote: text("reviewer_note"),
    /** Nima yordam berdi — eng qimmatli ustun. */
    resolutionUz: text("resolution_uz"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rejections_clause_idx").on(t.clause, t.domainPack)],
);

export const builds = pgTable(
  "builds",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    profile: text("profile").notNull(),
    platform: text("platform").notNull(),
    status: text("status").notNull().default("queued"),
    easBuildId: text("eas_build_id"),
    artifactUrl: text("artifact_url"),
    logTail: text("log_tail"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("builds_project_idx").on(t.projectId, t.createdAt)],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type Run = typeof runs.$inferSelect;
export type Version = typeof versions.$inferSelect;
