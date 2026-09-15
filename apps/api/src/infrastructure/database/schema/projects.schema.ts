import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Loyiha — mijozning bitta ilovasi.
 *
 * O'zgarishlar hisobi shu jadvalda turadi, alohida `balances` jadvalida emas:
 * balans doim bitta loyihaga tegishli va u bilan birga o'qiladi. Ajratish
 * faqat qo'shimcha JOIN keltirardi.
 */
export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    /** draft | building | ready | failed */
    status: text("status").notNull().default("draft"),

    /**
     * Expo SDK versiyasi — loyiha shunda QOTIRILADI.
     * Avtomatik yangilanish ishlab turgan ilovani buzadi, shuning uchun
     * migratsiya alohida, boshqariladigan amal.
     */
    sdk: integer("sdk").notNull(),

    domainPack: text("domain_pack"),
    blocks: jsonb("blocks").$type<string[]>().notNull().default([]),

    /**
     * Mahsulot turi: digital | physical_or_service.
     * Apple 3.1.1 bandi uchun hal qiluvchi — raqamli kontent faqat IAP orqali
     * sotiladi. Noto'g'ri tanlov aniq rad etishga olib keladi.
     */
    sells: text("sells").notNull().default("physical_or_service"),

    plan: text("plan").notNull().default("trial"),

    /** Tarifga kiradigan o'zgarishlar */
    includedChanges: integer("included_changes").notNull().default(0),
    usedChanges: integer("used_changes").notNull().default(0),
    /** Dona-dona sotib olingan qo'shimchalar — muddatsiz, yonmaydi */
    extraPurchased: integer("extra_purchased").notNull().default(0),
    extraUsed: integer("extra_used").notNull().default(0),

    previewPath: text("preview_path").notNull().default("web"),
    previewUrl: text("preview_url"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("projects_user_idx").on(t.userId, t.createdAt)],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
