import { Injectable, Logger } from "@nestjs/common";
import { isBillableKind, type TaskKind } from "@amb/core-rules";
import { LlmService } from "../../infrastructure/llm/llm.service.js";
import type { ChatMessage } from "../../infrastructure/llm/llm.types.js";
import { CLASSIFIER_SYSTEM } from "./prompts/index.js";
import type { StoredMessage } from "./context-builder.service.js";

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
  private readonly logger = new Logger(ClassifierService.name);

  constructor(private readonly llm: LlmService) {}

  /**
   * So'rovni tasniflaydi.
   *
   * `history` MAJBURIY. Usiz tasniflagich foydalanuvchining javobini
   * yangi, kontekstsiz so'rov deb ko'radi va yana savol beradi —
   * natijada cheksiz savol halqasi hosil bo'ladi va hech qanday ish
   * bajarilmaydi. Bu amalda uchragan nosozlik.
   */
  async classify(prompt: string, history: StoredMessage[] = []): Promise<Classification> {
    const askedBefore = wasClarifyingQuestion(history);

    const result = await this.llm.generate({
      tier: "cheap",
      messages: [
        { role: "system", content: CLASSIFIER_SYSTEM },
        ...recentTurns(history),
        { role: "user", content: prompt },
      ],
      temperature: 0,
      maxSteps: 1,
    });

    const parsed = safeJson(result.text);
    let kind = pickKind(parsed?.kind);

    /**
     * Qat'iy chegara: oldingi xabarimiz savol bo'lgan bo'lsa, javobga
     * yana savol bilan javob bermaymiz.
     *
     * Promptda ham yozilgan, lekin promptga to'liq ishonib bo'lmaydi —
     * arzon model qoidani unutadi. Bu qatlam kafolat beradi.
     */
    if (kind === "unclear" && askedBefore) {
      this.logger.log("Oldingi xabar savol edi — javobni ish deb qabul qilamiz");
      kind = "medium";
    }

    // «O'zing bilganingday qil» — bu ruxsat, noaniqlik emas.
    if (kind === "unclear" && GIVES_FREE_HAND.test(prompt)) {
      this.logger.log("Foydalanuvchi qaror qabul qilishni bizga qoldirdi");
      kind = "medium";
    }

    return {
      kind,
      summaryUz: pickSummary(kind, asString(parsed?.summaryUz)),
      clarifyingQuestionUz:
        kind === "unclear"
          ? (asString(parsed?.clarifyingQuestionUz) ??
            "Aniqroq aytsangiz: qaysi ekranda va nimani o'zgartiraylik?")
          : null,
      costCents: result.costCents,
    };
  }
}

/** Tasniflagichga beriladigan suhbat bo'lagi — ko'pi ortiqcha xarajat. */
const HISTORY_TURNS = 6;

function recentTurns(history: StoredMessage[]): ChatMessage[] {
  return history.slice(-HISTORY_TURNS).map((m) => ({ role: m.role, content: m.content }));
}

/** Oxirgi javobimiz aniqlashtiruvchi savol bo'lganmi. */
function wasClarifyingQuestion(history: StoredMessage[]): boolean {
  const last = [...history].reverse().find((m) => m.role === "assistant");
  return Boolean(last && last.content.trim().endsWith("?"));
}

/** «O'zing hal qil» ma'nosidagi iboralar. */
const GIVES_FREE_HAND =
  /xoxlagan|xohlagan|o.?zing bilgan|o.?zing hal|farqi yo.?q|sen hal qil|bilganingday|maqul|ixtiyoring/i;

/**
 * Modelning o'zi haqidagi jumlalari.
 *
 * Tasniflagich ba'zan `summaryUz` ga o'zini tasvirlab yuboradi
 * («Men so'rov tasniflagichiman…») — bu ekranda mijozga ko'rinadi va
 * uni chalkashtiradi. Prompt buni taqiqlaydi, lekin promptga to'liq
 * ishonib bo'lmaydi: bu qatlam kafolat beradi.
 */
const SELF_REFERENCE = /\bmen\b|\bmening\b|tasniflagich|yordamchi|assistant|salom|qanday yordam/i;

/**
 * Mijozga ko'rsatiladigan xulosani tanlaydi.
 *
 * Hisoblanmaydigan turlar (savol, noaniq, design) uchun modelning matni
 * UMUMAN ishlatilmaydi — u yerda tasvirlaydigan «o'zgarish» yo'q va
 * model bo'sh joyni o'zi haqidagi gap bilan to'ldiradi.
 */
function pickSummary(kind: TaskKind, modelSummary: string | null): string {
  if (!isBillableKind(kind)) return summaryFor(kind);
  if (!modelSummary || SELF_REFERENCE.test(modelSummary)) return summaryFor(kind);
  return modelSummary;
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
    case "first_build":
      return "Ilovangizni quryapman — bu birinchi qurish, bepul.";
  }
}
