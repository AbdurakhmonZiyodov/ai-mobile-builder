export type VerifyStep = "typecheck" | "lint" | "bundle";

export interface StepResult {
  step: VerifyStep;
  ok: boolean;
  /** Modelga beriladigan xatolar — qisqartirilgan, eng muhimi birinchi. */
  errors: string[];
  durationMs: number;
  /**
   * Qadam bajarilmadi.
   * Buni «o'tdi» deb ko'rsatish yolg'on bo'lardi — mahsulotning butun
   * va'dasi ishonchda, shuning uchun UI'ga alohida uzatiladi.
   */
  skipped: boolean;
  skipReasonUz?: string;
  /** Vosita topilmadi — bu muhit nosozligi, kod xatosi emas. */
  unavailable?: boolean;
}

export interface VerifyReport {
  ok: boolean;
  steps: StepResult[];
  /** Model uchun bitta matn — tuzatish tsikliga shu beriladi. */
  errorDigest: string;
  /**
   * Tekshiruvni O'TKAZIB BO'LMADI — vosita topilmadi yoki muhit buzuq.
   *
   * Bu modelning xatosi emas, shuning uchun tuzatish tsikli ishga
   * tushmaydi: agent muhit xatosini tuzata olmaydi va uchta bepul
   * urinishni bekorga sarflaydi.
   *
   * `ok` doim `false` bo'ladi — tekshirilmagan kod uchun pul olinmaydi.
   */
  unavailable: boolean;
  /** Mijozga ko'rsatiladigan sabab (faqat `unavailable` bo'lganda). */
  unavailableReasonUz?: string;
}

export interface VerifyOptions {
  skipBundle?: boolean;
  timeoutMs?: number;
  onStepStart?: (step: VerifyStep) => void;
  onStepEnd?: (result: StepResult) => void;
}

/** Mijozga ko'rsatiladigan sodda til — «typecheck» so'zi ishlatilmaydi. */
export function verifyLabelUz(step: VerifyStep): string {
  switch (step) {
    case "typecheck":
      return "Kodni tekshiryapman";
    case "lint":
      return "Qoidalarga moslikni tekshiryapman";
    case "bundle":
      return "Ilovani yig'yapman";
  }
}
