import { z } from "zod";

/**
 * O'zgarish hisobi — MVP spek 5.2.
 * Yagona qoida: mijoz nima so'rasa, o'sha bitta o'zgarish. Verify gate o'tmasa — 0.
 */

export const taskKinds = [
  "question",      // "Bu qanday ishlaydi?" -> bepul
  "unclear",       // noaniq so'rov -> aniqlashtiruvchi savol, bepul
  "design",        // design mode (kod yo'q) -> bepul
  "small_edit",    // "tugmani yashil qil"
  "medium",        // "ekranga filtr qo'sh"
  "large",         // "yangi ekran qo'sh", "to'lov ulash"
  "repair",        // verify gate xatosini avtomatik tuzatish -> bepul
] as const;

export type TaskKind = (typeof taskKinds)[number];
export const taskKindSchema = z.enum(taskKinds);

/** Qaysi turdagi vazifa hisoblanadi. Faqat shu jadval hisobning yagona manbai. */
const BILLABLE: Record<TaskKind, boolean> = {
  question: false,
  unclear: false,
  design: false,
  small_edit: true,
  medium: true,
  large: true,
  repair: false,
};

export function isBillableKind(kind: TaskKind): boolean {
  return BILLABLE[kind];
}

export const verifyStatuses = ["passed", "failed", "skipped"] as const;
export type VerifyStatus = (typeof verifyStatuses)[number];

export interface ChargeInput {
  kind: TaskKind;
  verify: VerifyStatus;
  /** Agent diff yozdimi. Bo'sh diff hech qachon hisoblanmaydi (spek 8.3). */
  producedDiff: boolean;
}

export interface ChargeDecision {
  units: 0 | 1;
  /** Mijozga ko'rsatiladigan sabab, oddiy til. */
  reasonUz: string;
}

/**
 * Yagona funksiya — hisobni faqat shu yerdan o'tkazamiz.
 * "1 o'zgarish = 1 birlik" va "verify gate o'tmasa hisoblanmaydi" shu yerda yashaydi.
 */
export function decideCharge(input: ChargeInput): ChargeDecision {
  if (!isBillableKind(input.kind)) {
    return { units: 0, reasonUz: reasonForFreeKind(input.kind) };
  }
  if (!input.producedDiff) {
    return { units: 0, reasonUz: "Hech narsa o'zgarmadi — hisoblanmadi." };
  }
  if (input.verify === "failed") {
    return { units: 0, reasonUz: "Tekshiruvdan o'tmadi — hisoblanmadi." };
  }
  return { units: 1, reasonUz: "1 o'zgarish hisoblandi." };
}

function reasonForFreeKind(kind: TaskKind): string {
  switch (kind) {
    case "question":
      return "Savol — bepul.";
    case "unclear":
      return "Aniqlashtiruvchi savol — bepul.";
    case "design":
      return "Design mode — bepul.";
    case "repair":
      return "Xato tuzatish — bepul.";
    default:
      return "Hisoblanmadi.";
  }
}

export interface Balance {
  included: number;
  used: number;
  /** Sotib olingan qo'shimchalar. Muddatsiz, yonmaydi. */
  extraPurchased: number;
  extraUsed: number;
}

export function remaining(b: Balance): number {
  const fromPlan = Math.max(0, b.included - b.used);
  const fromExtra = Math.max(0, b.extraPurchased - b.extraUsed);
  return fromPlan + fromExtra;
}

/** «Bu oy 10 tadan 4 tasi ishlatildi» — spek 5.2 */
export function balanceLabelUz(b: Balance): string {
  const left = remaining(b);
  const extra = Math.max(0, b.extraPurchased - b.extraUsed);
  const base = `Bu oy ${b.included} tadan ${b.used} tasi ishlatildi`;
  return extra > 0 ? `${base} · qo'shimcha ${extra} ta (yonmaydi)` : `${base} · qoldiq ${left}`;
}
