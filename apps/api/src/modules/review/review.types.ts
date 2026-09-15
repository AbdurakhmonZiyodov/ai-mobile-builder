export interface CheckerFile {
  path: string;
  content: string;
}

export interface CheckerInput {
  files: CheckerFile[];
  /** `app.json` dan olingan konfiguratsiya */
  appConfig: Record<string, unknown>;
  blocks: readonly string[];
  /** Mahsulot turi — 3.1.1 bandi uchun hal qiluvchi */
  sells: "digital" | "physical_or_service";
  /** Domen paketi talab qiladigan eng kam ekran soni */
  minScreens: number;
}

export type Severity = "blocker" | "warning" | "info";

export interface Finding {
  /** Apple App Store Review Guidelines bandi */
  clause: string;
  severity: Severity;
  /** Mijozga sodda tilda: «rad etish sababi» emas, «nima qilish kerak» */
  titleUz: string;
  detailUz: string;
  files: string[];
}

export interface ReviewReport {
  ok: boolean;
  findings: Finding[];
  /** Do'konda birinchi urinishda o'tish ehtimoli, 0..1 */
  passLikelihood: number;
}

/** Qoida — sof funksiya, shuning uchun har biri alohida testlanadi. */
export type Rule = (input: CheckerInput) => Finding[];

/** Obyekt ichidan xavfsiz o'qish: `expo.ios.infoPlist` kabi yo'llar uchun. */
export function getIn(obj: unknown, keys: string[]): unknown {
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** Barcha fayllarni bitta matnga qo'shadi — kalit so'z qidirish uchun. */
export function allSource(input: CheckerInput): string {
  return input.files.map((f) => f.content).join("\n");
}
