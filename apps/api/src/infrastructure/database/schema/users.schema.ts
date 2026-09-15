import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Mijoz.
 *
 * MVP'da auth yengil — email bo'yicha. To'liq autentifikatsiya 15-haftada,
 * chunki birinchi 5 pilot mijoz bilan yuzma-yuz ishlanadi va ro'yxatdan
 * o'tish oqimi ularning yo'lini to'sadi.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  nameUz: text("name_uz"),
  /** Interfeys tili: uz | ru | en */
  locale: text("locale").notNull().default("uz"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
