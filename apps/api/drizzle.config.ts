import type { Config } from "drizzle-kit";

/**
 * Drizzle Kit konfiguratsiyasi — migratsiya va `db:push` uchun.
 * Sxema `src/infrastructure/database/schema/` da, har jadval alohida faylda.
 */
export default {
  schema: "./src/infrastructure/database/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://localhost:5432/amb",
  },
} satisfies Config;
