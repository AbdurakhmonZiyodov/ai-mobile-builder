import { GatewayProvider } from "./gateway-provider.js";
import { MockProvider } from "./mock-provider.js";
import type { ModelProvider } from "./types.js";

export * from "./types.js";
export * from "./models.js";
export { GatewayProvider, MockProvider };

let cached: ModelProvider | null = null;

/**
 * Kalit bor bo'lsa gateway, yo'q bo'lsa mock.
 * Mahsulot kalitsiz ham ishga tushsin — birinchi tajriba to'siqsiz bo'lishi kerak.
 */
export function getModelProvider(): ModelProvider {
  if (cached) return cached;
  // Bo'sh satr (.env da `AMB_MODEL_PROVIDER=`) sozlanmagan deb qaraladi.
  const forced = nonEmpty(process.env.AMB_MODEL_PROVIDER);
  const hasKey = Boolean(nonEmpty(process.env.AI_GATEWAY_API_KEY) ?? nonEmpty(process.env.ANTHROPIC_API_KEY));

  if (forced === "mock" || (!forced && !hasKey)) {
    cached = new MockProvider();
  } else {
    cached = new GatewayProvider();
  }
  return cached;
}

function nonEmpty(value: string | undefined): string | undefined {
  return value && value.trim() !== "" ? value : undefined;
}

export function resetModelProvider(): void {
  cached = null;
}
