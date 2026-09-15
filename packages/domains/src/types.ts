import type { BlockIdLike } from "./block-id.js";

export interface Entity {
  name: string;
  fields: Array<{ name: string; type: string; required: boolean; noteUz?: string }>;
  noteUz?: string;
}

export interface Flow {
  id: string;
  nameUz: string;
  /** Ekranlar ketma-ketligi */
  steps: string[];
}

/**
 * Eval — "tayyor" so'zining o'lchovi. E2E tekshiruv agenti AYNAN shu ro'yxat
 * bo'yicha tekshiradi (spek 4.3, 12.1).
 */
export interface Evaluation {
  id: string;
  /** Mijozga ko'rsatiladigan sodda til — "E2E" so'zi ishlatilmaydi (spek 15.2) */
  titleUz: string;
  /** Maestro uchun qadamlar */
  steps: string[];
  /** Vision model shu savolga javob beradi */
  expectUz: string;
  critical: boolean;
}

export interface DomainPack {
  id: string;
  nameUz: string;
  descriptionUz: string;
  examplesUz: string[];
  /** Bu soha uchun tavsiya etiladigan bloklar */
  recommendedBlocks: BlockIdLike[];
  sells: "digital" | "physical_or_service";
  entities: Entity[];
  flows: Flow[];
  evals: Evaluation[];
  /** 4.2 bandi — minimum functionality. Kamida shuncha mazmunli ekran bo'lishi kerak. */
  minScreens: number;
}
