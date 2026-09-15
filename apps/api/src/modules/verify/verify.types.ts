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
}

export interface VerifyReport {
  ok: boolean;
  steps: StepResult[];
  /** Model uchun bitta matn — tuzatish tsikliga shu beriladi. */
  errorDigest: string;
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
