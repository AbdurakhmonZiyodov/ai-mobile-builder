import { Injectable, Logger } from "@nestjs/common";
import type { DomainPack } from "@amb/domains";
import { LlmService } from "../../infrastructure/llm/llm.service.js";
import { plannerSystem } from "./prompts/index.js";

export interface PlannedScreen {
  nameUz: string;
  purposeUz: string;
  file: string;
}

export interface BuildPlan {
  appNameUz: string;
  summaryUz: string;
  screens: PlannedScreen[];
  entities: Array<{ name: string; fields: string[] }>;
  costCents: number;
}

/** Ekran soni chegarasi — 4.2 bandi va birinchi qurish vaqti orasidagi muvozanat. */
const MIN_SCREENS = 3;
const MAX_SCREENS = 6;

/**
 * Birinchi qurish uchun reja tuzadi.
 *
 * Nega alohida qadam: model to'g'ridan-to'g'ri kod yozishga kirishsa,
 * ekranlarni bir-biriga bog'lamay yozadi. Reja uni butun ilovani bir
 * marta o'ylashga majbur qiladi.
 *
 * Reja mijozga ham ko'rsatiladi — u kod o'qiy olmaydi, lekin ekranlar
 * ro'yxatini o'qiy oladi.
 */
@Injectable()
export class PlannerService {
  private readonly logger = new Logger(PlannerService.name);

  constructor(private readonly llm: LlmService) {}

  async plan(prompt: string, pack: DomainPack | null): Promise<BuildPlan> {
    const result = await this.llm.generate({
      tier: "strong",
      messages: [
        { role: "system", content: plannerSystem(pack) },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      maxSteps: 1,
    });

    const parsed = safeJson(result.text);
    const screens = normalizeScreens(parsed?.screens);

    this.logger.log(`Reja: ${screens.length} ekran`);

    return {
      appNameUz: asString(parsed?.appNameUz) ?? "Yangi ilova",
      summaryUz: asString(parsed?.summaryUz) ?? "Ilova quriladi",
      screens,
      entities: normalizeEntities(parsed?.entities),
      costCents: result.costCents,
    };
  }
}

/**
 * Ekranlar ro'yxatini tozalaydi.
 *
 * Model ba'zan chegaradan chiqadi yoki yo'lni noto'g'ri yozadi. Bu qatlam
 * rejani ishlatib bo'ladigan holga keltiradi — aks holda quruvchi
 * `app/` dan tashqariga fayl yozishga urinadi.
 */
function normalizeScreens(value: unknown): PlannedScreen[] {
  if (!Array.isArray(value)) return [];

  const screens = value
    .filter((s): s is Record<string, unknown> => typeof s === "object" && s !== null)
    .map((s) => ({
      nameUz: asString(s.nameUz) ?? "Ekran",
      purposeUz: asString(s.purposeUz) ?? "",
      file: normalizeFile(asString(s.file)),
    }))
    .slice(0, MAX_SCREENS);

  return screens.length >= MIN_SCREENS ? screens : screens;
}

/** Yo'l doim `app/(app)/` ichida bo'ladi. */
function normalizeFile(file: string | null): string {
  if (!file) return "app/(app)/index.tsx";
  const clean = file.replace(/^\/+/, "");
  return clean.startsWith("app/") ? clean : `app/(app)/${clean}`;
}

function normalizeEntities(value: unknown): Array<{ name: string; fields: string[] }> {
  if (!Array.isArray(value)) return [];
  return value
    .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
    .map((e) => ({
      name: asString(e.name) ?? "Model",
      fields: Array.isArray(e.fields) ? e.fields.filter((f): f is string => typeof f === "string") : [],
    }));
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
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
