import type { ModelTier } from "./llm.types.js";

/**
 * Model reestri.
 *
 * ID'lar AI Gateway'ning `provider/model` formatida va jonli ro'yxatdan
 * olingan (`GET https://ai-gateway.vercel.sh/v1/models`). Ular sozlamadan
 * keladi — model yangilansa yoki provayder o'zgarsa, kod tegilmaydi.
 *
 * Narxlar ham o'sha ro'yxatdan, 1 million token uchun AQSh sentida.
 * Bular mahsulot narxi emas, BIZNING xarajatimiz: bitta o'zgarishning
 * o'rtacha tannarxi $0,60 dan oshsa, $5 lik narx marjani yo'qotadi.
 */
export const PRICE_PER_MTOK_CENTS: Record<ModelTier, { input: number; output: number }> = {
  // anthropic/claude-haiku-4.5 — $1 / $5
  cheap: { input: 100, output: 500 },
  // anthropic/claude-sonnet-5 — $2 / $10
  standard: { input: 200, output: 1000 },
  // anthropic/claude-opus-5 — $5 / $25
  strong: { input: 500, output: 2500 },
};

export function estimateCostCents(
  tier: ModelTier,
  inputTokens: number,
  outputTokens: number,
): number {
  const price = PRICE_PER_MTOK_CENTS[tier];
  return (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;
}

/**
 * Qaysi vazifaga qaysi tier.
 *
 * `cheap`    — tasniflash. Har xabarda ishlaydi, shuning uchun eng arzoni.
 * `standard` — kundalik tahrir va savolga javob.
 * `strong`   — katta o'zgarish; va bir xil xato ikki marta takrorlansa,
 *              arzon modeldan shunga o'tamiz.
 */
export const TIER_PURPOSE_UZ: Record<ModelTier, string> = {
  cheap: "So'rovni tasniflash va aniqlashtiruvchi savol",
  standard: "Kichik va o'rta tahrir, mijoz savoliga javob",
  strong: "Katta o'zgarish va qaytalangan xatoni tuzatish",
};
