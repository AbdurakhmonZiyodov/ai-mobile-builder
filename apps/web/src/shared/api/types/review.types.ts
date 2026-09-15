/**
 * Do'kon tekshiruvining turlari.
 *
 * Nega bu turlar `@amb/contracts` dan kelmaydi: tekshiruv qoidalari faqat
 * backendda yashaydi (`apps/api/src/modules/review`) va ularning ichki
 * turlari (`CheckerInput`, `Rule`) web'ga umuman kerak emas. Shartnoma
 * paketiga hammasini ko'chirish web'ni backend ichki tuzilishiga
 * bog'lab qo'yardi — bu yerda faqat SIM ORQALI o'tadigan shakl bor.
 */

/** Apple bandining og'irligi. `blocker` — ilova albatta rad etiladi. */
export type ReviewSeverity = "blocker" | "warning" | "info";

export interface ReviewFinding {
  /** Apple App Store Review Guidelines bandi, masalan `4.2` yoki `5.1.1(v)`. */
  clause: string;
  severity: ReviewSeverity;
  /** Mijozga sodda tilda: «rad etish sababi» emas, «nima qilish kerak». */
  titleUz: string;
  detailUz: string;
  files: string[];
}

export interface CheckReviewResponse {
  /** Bloklovchi topilma yo'qmi. */
  ok: boolean;
  /** Do'konda birinchi urinishda o'tish ehtimoli, 0..1. */
  passLikelihood: number;
  findings: ReviewFinding[];
}
