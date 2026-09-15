import { Inject, Injectable, Logger, type OnModuleDestroy } from "@nestjs/common";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { APP_CONFIG, type AppConfig } from "../../config/configuration.js";
import * as schema from "./schema/index.js";

export type Database = PostgresJsDatabase<typeof schema>;

/**
 * Bitta ulanish hovuzi butun ilova uchun.
 *
 * Repository'lar shu servisdan `db` ni oladi va drizzle so'rovlarini yozadi.
 * Controller va service baza bilan to'g'ridan-to'g'ri ishlamaydi — faqat
 * repository orqali.
 */
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly sql: ReturnType<typeof postgres>;
  readonly db: Database;

  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.sql = postgres(config.databaseUrl, {
      max: 10,
      onnotice: () => {},
    });
    this.db = drizzle(this.sql, { schema });
    this.logger.log("Postgres ulanishi tayyor");
  }

  async onModuleDestroy(): Promise<void> {
    await this.sql.end({ timeout: 5 });
  }
}
