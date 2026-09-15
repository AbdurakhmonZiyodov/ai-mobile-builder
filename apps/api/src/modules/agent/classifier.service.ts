import { Injectable } from "@nestjs/common";
import type { TaskKind } from "@amb/core-rules";
import { LlmService } from "../../infrastructure/llm/llm.service.js";
import { CLASSIFIER_SYSTEM } from "./prompts/index.js";

export interface Classification {
  kind: TaskKind;
  summaryUz: string;
  clarifyingQuestionUz: string | null;
  /** Tasniflashning o'zi ham pul turadi — umumiy xarajatga qo'shiladi. */
  costCents: number;
}

const ALLOWED: readonly TaskKind[] = ["question", "unclear", "small_edit", "medium", "large"];

/**
 * So'rovni tasniflaydi — agent tsiklining birinchi qadami.
 *
 * Nega arzon model: bu har xabarda ishlaydi. Kuchli model bilan tasniflash
 * bitta o'zgarishning tannarxini sezilarli oshiradi, aniqlik esa deyarli
 * o'zgarmaydi.
 *
 * Nega bitta chaqiruv: aniqlashtiruvchi savol ham shu javobda keladi.
 * Ikkinchi chaqiruv qo'shimcha kechikish va xarajat bo'lardi.
 */
@Injectable()
export class ClassifierService {
  constructor(private readonly llm: LlmService) {}

  async classify(prompt: string): Promise<Classification> {
    const result = await this.llm.generate({
      tier: "cheap",
      messages: [
        { role: "system", content: CLASSIFIER_SYSTEM },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      maxSteps: 1,
    });

    const parsed = safeJson(result.text);
    const kind = pickKind(parsed?.kind);

    return {
      kind,
      summaryUz: asString(parsed?.summaryUz) ?? summaryFor(kind),
      clarifyingQuestionUz:
        kind === "unclear"
          ? (asString(parsed?.clarifyingQuestionUz) ??
            "Aniqroq aytsangiz: qaysi ekranda va nimani o'zgartiraylik?")
          : null,
      costCents: result.costCents,
    };
  }
}

/**
 * Model kutilmagan qiymat qaytarsa «unclear» tanlaymiz.
 * Noto'g'ri ish qilib pul olgandan ko'ra, savol bergan yaxshi.
 */
function pickKind(value: unknown): TaskKind {
  return typeof value === "string" && (ALLOWED as readonly string[]).includes(value)
    ? (value as TaskKind)
    : "unclear";
}

function safeJson(text: string): Record<string, unknown> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

/** Mijozga ko'rsatiladigan bir jumlalik xulosa. */
export function summaryFor(kind: TaskKind): string {
  switch (kind) {
    case "question":
      return "Savol — bepul javob beraman.";
    case "unclear":
      return "So'rov aniq emas — avval bitta savol beraman, bu bepul.";
    case "design":
      return "Design mode — kod o'zgarmaydi, bepul.";
    case "small_edit":
      return "Kichik tahrir — 1 o'zgarish.";
    case "medium":
      return "O'rta hajmli o'zgarish — 1 o'zgarish.";
    case "large":
      return "Katta o'zgarish — 1 o'zgarish.";
    case "repair":
      return "Xato tuzatish — bepul.";
  }
}
