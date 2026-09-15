import { generateText, stepCountIs, tool, type ModelMessage } from "ai";
import { estimateCostCents } from "../model-registry.js";
import type { GenerateOptions, GenerateResult, ToolResult } from "../llm.types.js";

/** Tool javobining modelga qaytadigan eng katta hajmi — kontekst byudjeti (8.2). */
const MAX_TOOL_OUTPUT_CHARS = 16_000;

/**
 * Vercel AI Gateway orqali ishlovchi provayder.
 *
 * Nega gateway: model ID oddiy `provider/model` satri bo'ladi, shuning uchun
 * provayder paketiga (`@ai-sdk/anthropic` va hokazo) bog'lanib qolmaymiz.
 * Zaxira model, kuzatuv va xarajat hisoboti ham shu qatlamdan keladi.
 *
 * Autentifikatsiya AI SDK tomonidan muhitdan olinadi:
 * `AI_GATEWAY_API_KEY` yoki Vercel'da `VERCEL_OIDC_TOKEN`.
 */
export class GatewayProvider {
  constructor(private readonly models: { cheap: string; standard: string; strong: string }) {}

  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const modelId = this.models[opts.tier];

    const tools = Object.fromEntries(
      (opts.tools ?? []).map((spec) => [
        spec.name,
        tool({
          description: spec.description,
          inputSchema: spec.parameters,
          execute: async (args: unknown) => {
            opts.onToolStart?.(spec.name, preview(args));

            let result: ToolResult;
            try {
              result = await spec.execute(args as never);
            } catch (err) {
              // Tool xatosi modelga matn sifatida qaytadi: u o'zini tuzata oladi.
              result = {
                ok: false,
                output: `Tool xatosi: ${err instanceof Error ? err.message : String(err)}`,
              };
            }

            opts.onToolEnd?.(spec.name, result);
            return truncate(result.output, MAX_TOOL_OUTPUT_CHARS);
          },
        }),
      ]),
    );

    const result = await generateText({
      model: modelId,
      messages: opts.messages as ModelMessage[],
      ...(Object.keys(tools).length > 0 ? { tools } : {}),
      stopWhen: stepCountIs(opts.maxSteps ?? 12),
      temperature: opts.temperature ?? 0.2,
      ...(opts.abortSignal ? { abortSignal: opts.abortSignal } : {}),
    });

    if (result.text) opts.onText?.(result.text);

    const inputTokens = result.usage?.inputTokens ?? 0;
    const outputTokens = result.usage?.outputTokens ?? 0;

    return {
      text: result.text,
      toolCalls: result.steps.reduce((n, step) => n + step.toolCalls.length, 0),
      usage: { inputTokens, outputTokens },
      costCents: estimateCostCents(opts.tier, inputTokens, outputTokens),
      finishReason: result.finishReason,
    };
  }
}

function preview(args: unknown): string {
  const text = typeof args === "string" ? args : JSON.stringify(args);
  return truncate(text ?? "", 200);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n… (${text.length - max} belgi qisqartirildi)`;
}
