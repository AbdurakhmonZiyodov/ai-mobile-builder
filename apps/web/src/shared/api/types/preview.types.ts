import type { PreviewDecision, PreviewPathInfo } from "@amb/core-rules";

/**
 * Preview resursining turlari.
 *
 * Qaror mantig'i (`PreviewDecision`) `@amb/core-rules` da — u sof biznes
 * qoidasi va ikkala tomon bir xil javob berishi shart. Bu yerda faqat
 * HTTP javobining QOBIG'I: backend qarorga ma'lumot paketlarini qo'shadi.
 */

// --- So'rovlar ---------------------------------------------------------

export interface DecidePreviewRequest {
  projectId: string;
  /**
   * Mijozda Apple Developer akkaunti bormi.
   *
   * Nega so'rovda: bu qarorni tubdan o'zgartiradi — `eas go` va dev client
   * faqat akkaunt bo'lganda mumkin.
   */
  hasAppleAccount?: boolean;
}

// --- Javoblar ----------------------------------------------------------

export interface DecidePreviewResponse extends PreviewDecision {
  info: PreviewPathInfo;
  /** Darhol ochiladigan zaxira yo'l haqida to'liq ma'lumot. */
  fallbackInfo: PreviewPathInfo;
  allPaths: PreviewPathInfo[];
}

export interface BuildWebPreviewResponse {
  ok: boolean;
  url: string | null;
  durationMs: number;
  messageUz: string;
  /**
   * Yig'ish yiqilganda `stderr` ning oxiri.
   *
   * Nega ixtiyoriy: muvaffaqiyatli javobda umuman kelmaydi va uni majburiy
   * qilish har chaqiruv joyini bo'sh matnga tayyorlashga majbur qilardi.
   */
  logTail?: string;
}
