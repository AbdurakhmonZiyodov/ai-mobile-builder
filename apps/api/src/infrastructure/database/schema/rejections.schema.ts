import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Rad etishlar korpusi — mahsulotning uchinchi ustuni.
 *
 * Bu ma'lumotni sotib olib ham, nusxa ko'chirib ham bo'lmaydi: u faqat vaqt
 * bilan yig'iladi. Har rad etish qaysi band, qaysi soha, qaysi ekran va
 * NIMA YORDAM BERGANI bilan yoziladi — oxirgi ustun eng qimmatlisi, chunki
 * ikkinchi marta o'sha xato takrorlanmaydi.
 */
export const rejections = pgTable(
  "rejections",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull(),
    /** apple | google */
    store: text("store").notNull(),
    /** Masalan: "4.2", "5.1.1(v)", "3.1.1" */
    clause: text("clause").notNull(),
    domainPack: text("domain_pack"),
    screen: text("screen"),
    reviewerNote: text("reviewer_note"),
    /** Nima yordam berdi — korpusning asosiy qiymati */
    resolutionUz: text("resolution_uz"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rejections_clause_idx").on(t.clause, t.domainPack)],
);

export type Rejection = typeof rejections.$inferSelect;
