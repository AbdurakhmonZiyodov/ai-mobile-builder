import type { ConnectBackendInput } from "@amb/contracts";

/**
 * Mijozning o'z backend'ini (Supabase / Firebase) ulash turlari.
 *
 * So'rov turi `@amb/contracts` dan olinadi — u yerdagi zod sxemasi
 * serverda AYNAN shu so'rovni tekshiradi. Bu yerda faqat javob shakllari.
 *
 * Eng muhim qaror javob turlarida ko'rinadi: kalitlarning O'ZI hech
 * qachon qaytmaydi, faqat «bormi yo'qmi». Shuning uchun bu yerda
 * `anonKey` yoki `serviceRoleKey` maydonlari yo'q va bo'lmasligi ham
 * kerak — tur shu va'daning kodda yozilgan isboti.
 */

export type BackendProvider = "supabase" | "firebase";

// --- So'rovlar ---------------------------------------------------------

export type ConnectBackendRequest = ConnectBackendInput;

// --- Javoblar ----------------------------------------------------------

export interface ConnectBackendResponse {
  ok: boolean;
  provider: string;
  messageUz: string;
  /** Provayderga xos ogohlantirishlar (masalan Firebase konfiguratsiyasi). */
  warningsUz: string[];
}

export interface BackendStatusResponse {
  connected: boolean;
  provider?: string;
  url?: string | null;
  hasAnonKey?: boolean;
  /** `service_role` hali o'chirilmaganmi — bu xavf ko'rsatkichi. */
  serviceRoleActive?: boolean;
  /** ISO matn: JSON'da `Date` saqlanmaydi. */
  serviceRoleDeletedAt?: string | null;
}

export interface BurnServiceRoleResponse {
  ok: boolean;
  messageUz: string;
}
