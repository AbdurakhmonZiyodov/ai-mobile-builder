import { Injectable } from "@nestjs/common";
import { and, eq, or, sql } from "drizzle-orm";
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
   * Ikki narsa SQL ichida hal qilinadi:
   *
   * 1. **Qaysi hisobdan.** Avval tarif qoldig'i, keyin sotib olingan
   *    qo'shimchalar (ular yonmaydi, shuning uchun oxirida sarflansa
   *    mijoz uchun foydaliroq).
   *
   * 2. **Qoldiq bormi.** `WHERE` sharti ikki parallel so'rovning bitta
   *    qoldiqni ikki marta sarflashiga yo'l qo'ymaydi: ikkinchisi hech
   *    qanday qatorni yangilamaydi.
   *
   * Qaytadi: hisob amalga oshdimi.
   */
  async consumeOneChange(projectId: string): Promise<boolean> {
    const updated = await this.database.db
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
      .where(
        and(
          eq(projects.id, projectId),
          // Qoldiq bo'lmasa yangilanish umuman bo'lmaydi — shu bilan
          // `extraUsed` hech qachon `extraPurchased` dan oshmaydi.
          or(
            sql`${projects.usedChanges} < ${projects.includedChanges}`,
            sql`${projects.extraUsed} < ${projects.extraPurchased}`,
          ),
        ),
      )
      .returning({ id: projects.id });

    return updated.length > 0;
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
