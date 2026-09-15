import { generateText, stepCountIs, tool, type ModelMessage } from "ai";
import { estimateCostCents } from "../model-registry.js";
import type { ChatMessage, GenerateOptions, GenerateResult, ToolResult } from "../llm.types.js";

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

    // AI SDK 7 da `system` rolli xabar `messages` ichida BO'LMAYDI —
    // u alohida `instructions` orqali beriladi. Aks holda so'rov
    // `AI_InvalidPromptError` bilan yiqiladi.
    //
    // Bizning kontekst qatlami tizim qoidalarini bir necha bo'lakka
    // ajratadi (qoidalar, MAP.md, suhbat xulosasi, tegishli fayllar),
    // shuning uchun ularni shu yerda bitta matnga birlashtiramiz.
    const { instructions, conversation } = splitMessages(opts.messages);

    const result = await generateText({
      model: modelId,
      ...(instructions ? { instructions } : {}),
      messages: conversation as ModelMessage[],
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

interface SplitMessages {
  instructions: string | undefined;
  conversation: ChatMessage[];
}

/**
 * `system` xabarlarni suhbatdan ajratadi.
 *
 * Tartib saqlanadi: bo'laklar bir-biriga tayanadi (masalan «qoidalar»
 * dan keyin «loyiha xaritasi»), shuning uchun ular yozilgan ketma-ketlikda
 * birlashtiriladi.
 */
function splitMessages(messages: ChatMessage[]): SplitMessages {
  const systemParts: string[] = [];
  const conversation: ChatMessage[] = [];

  for (const message of messages) {
    if (message.role === "system") {
      systemParts.push(message.content);
    } else {
      conversation.push(message);
    }
  }

  return {
    instructions: systemParts.length > 0 ? systemParts.join("\n\n") : undefined,
    conversation,
  };
}

function preview(args: unknown): string {
  const text = typeof args === "string" ? args : JSON.stringify(args);
  return truncate(text ?? "", 200);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n… (${text.length - max} belgi qisqartirildi)`;
}
