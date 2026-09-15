import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

let sql: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL sozlanmagan. .env faylga qo'shing: postgres://localhost:5432/amb",
    );
  }
  sql = postgres(url, { max: 10, onnotice: () => {} });
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  await sql?.end({ timeout: 5 });
  sql = null;
  dbInstance = null;
}

export type Db = ReturnType<typeof getDb>;
