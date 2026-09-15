import { generateText, stepCountIs, tool, type ModelMessage } from "ai";
import { MODEL_IDS, estimateCostCents } from "./models.js";
import type { GenerateOptions, GenerateResult, ModelProvider, ToolResult } from "./types.js";

/**
 * Vercel AI Gateway orqali ishlovchi provayder.
 * Model ID'lari "provider/model" satri — provayder paketiga bog'lanmaymiz.
 */
export class GatewayProvider implements ModelProvider {
  readonly id = "gateway";

  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const modelId = MODEL_IDS[opts.tier];

    const tools = Object.fromEntries(
      (opts.tools ?? []).map((t) => [
        t.name,
        tool({
          description: t.description,
          inputSchema: t.parameters,
          execute: async (args: unknown) => {
            opts.onToolStart?.(t.name, preview(args));
            let res: ToolResult;
            try {
              res = await t.execute(args as never);
            } catch (err) {
              res = { ok: false, output: `Tool xatosi: ${String(err)}` };
            }
            opts.onToolEnd?.(t.name, res);
            // Tool javobi 4 000 tokendan oshmasin (spek 8.2)
            return truncate(res.output, 16_000);
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
      toolCalls: result.steps.reduce((n, s) => n + s.toolCalls.length, 0),
      usage: { inputTokens, outputTokens },
      costCents: estimateCostCents(opts.tier, inputTokens, outputTokens),
      finishReason: result.finishReason,
    };
  }
}

function preview(args: unknown): string {
  const s = typeof args === "string" ? args : JSON.stringify(args);
  return truncate(s ?? "", 200);
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max)}\n… (${s.length - max} belgi qisqartirildi)`;
}
