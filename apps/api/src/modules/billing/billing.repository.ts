import { Injectable } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import { DatabaseService } from "../../infrastructure/database/database.service.js";
import { projects } from "../../infrastructure/database/schema/index.js";

/**
 * Hisob bilan bog'liq baza amallari.
 *
 * Nega repository ajratilgan: servis biznes qoidasini biladi, repository
 * esa SQL'ni. Shunda qoidani testlash uchun bazani ko'tarish shart emas.
 */
@Injectable()
export class BillingRepository {
  constructor(private readonly database: DatabaseService) {}

  /**
   * Bitta o'zgarishni yechadi — bitta atomar so'rovda.
   *
   * Nega SQL ichida shart: o'qib-keyin-yozish ikki parallel so'rovda
   * bitta qoldiqni ikki marta sarflashi mumkin edi. `CASE` bilan qaysi
   * hisobdan yechish bazaning o'zida hal qilinadi.
   */
  async consumeOneChange(projectId: string): Promise<void> {
    await this.database.db
      .update(projects)
      .set({
        usedChanges: sql`CASE WHEN ${projects.usedChanges} < ${projects.includedChanges}
                              THEN ${projects.usedChanges} + 1
                              ELSE ${projects.usedChanges} END`,
        extraUsed: sql`CASE WHEN ${projects.usedChanges} >= ${projects.includedChanges}
                             THEN ${projects.extraUsed} + 1
                             ELSE ${projects.extraUsed} END`,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));
  }

  /** Mijoz qo'shimcha o'zgarish sotib olganda. Qoldiq muddatsiz, yonmaydi. */
  async addExtraChanges(projectId: string, count: number): Promise<void> {
    await this.database.db
      .update(projects)
      .set({
        extraPurchased: sql`${projects.extraPurchased} + ${count}`,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));
  }
}
