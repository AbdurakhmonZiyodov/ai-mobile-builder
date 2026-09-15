import type { ModelTier } from "./types.js";

/**
 * Tier -> model ID. Gateway "provider/model" ko'rinishida ishlaydi.
 * Env orqali almashtiriladi — model drifti bo'lganda kod tegilmaydi (spek 16.1).
 */
function env(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export const MODEL_IDS: Record<ModelTier, string> = {
  cheap: env("AMB_MODEL_CHEAP", "anthropic/claude-haiku-4.5"),
  standard: env("AMB_MODEL_STANDARD", "anthropic/claude-sonnet-5"),
  strong: env("AMB_MODEL_STRONG", "anthropic/claude-opus-5"),
};

/** Taxminiy narx, 1M token uchun USD sentda. Xarajat dashboard'i uchun. */
export const PRICE_PER_MTOK: Record<ModelTier, { input: number; output: number }> = {
  cheap: { input: 100, output: 500 },
  standard: { input: 300, output: 1500 },
  strong: { input: 1500, output: 7500 },
};

export function estimateCostCents(
  tier: ModelTier,
  inputTokens: number,
  outputTokens: number,
): number {
  const p = PRICE_PER_MTOK[tier];
  return (inputTokens / 1_000_000) * p.input + (outputTokens / 1_000_000) * p.output;
}
