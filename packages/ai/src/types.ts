import type { z } from "zod";

/**
 * Model qatlami — spek 8-bo'lim.
 * Butun tizim faqat shu interfeysni biladi. Provayder almashsa, bu fayldan
 * boshqa hech narsa o'zgarmaydi.
 */

/**
 * Tier — narx/kuch balansi.
 * `cheap`  — tasniflash, qisqa javob. Har xabarda ishlaydi, shuning uchun arzon.
 * `standard` — kundalik tahrir.
 * `strong` — reja, katta o'zgarish, va "bir xil xato ikki marta" holati (spek 8.3).
 */
export type ModelTier = "cheap" | "standard" | "strong";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ToolSpec<TIn extends z.ZodType = z.ZodType> {
  name: string;
  description: string;
  parameters: TIn;
  execute: (args: z.infer<TIn>) => Promise<ToolResult>;
}

/**
 * Tool ta'rifi uchun yordamchi: har tool o'z sxemasidan turini oladi,
 * lekin ro'yxatga bir xil turda tushadi.
 */
export function defineTool<TIn extends z.ZodType>(spec: ToolSpec<TIn>): ToolSpec {
  return spec as unknown as ToolSpec;
}

export interface ToolResult {
  ok: boolean;
  /** Modelga qaytadigan matn. 4 000 tokendan oshsa qisqartiriladi (spek 8.2). */
  output: string;
  /** UI uchun qisqa xulosa */
  summary?: string;
  meta?: Record<string, unknown>;
}

export interface GenerateOptions {
  tier: ModelTier;
  messages: ChatMessage[];
  tools?: ToolSpec[];
  maxSteps?: number;
  temperature?: number;
  /** Matn oqimi UI ga uzatiladi */
  onText?: (delta: string) => void;
  onToolStart?: (name: string, argsPreview: string) => void;
  onToolEnd?: (name: string, result: ToolResult) => void;
  abortSignal?: AbortSignal;
}

export interface GenerateResult {
  text: string;
  toolCalls: number;
  usage: { inputTokens: number; outputTokens: number };
  /** Taxminiy xarajat, USD sentda — birlik iqtisodiyoti uchun (spek 6.1) */
  costCents: number;
  finishReason: string;
}

export interface ModelProvider {
  readonly id: string;
  generate(opts: GenerateOptions): Promise<GenerateResult>;
}
