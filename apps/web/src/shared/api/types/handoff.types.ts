/**
 * Dasturchiga topshirish paketining turlari.
 *
 * Nega `generated` va `included` alohida maydonlar: birinchisi — shu
 * chaqiruvda YOZILGAN fayllar, ikkinchisi — loyihada allaqachon bor va
 * paketga kiradiganlari. Ularni bitta ro'yxatga qo'shish mijozga
 * `.env.example` ni biz hozir yaratdik degan noto'g'ri taassurot berardi.
 */
export interface GenerateHandoffResponse {
  ok: boolean;
  generated: string[];
  included: string[];
  /** Hujjatlar commit qilingan SHA; commit bo'lmasa `null`. */
  gitSha: string | null;
  messageUz: string;
}
