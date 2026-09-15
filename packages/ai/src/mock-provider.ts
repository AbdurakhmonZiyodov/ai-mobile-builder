import type { GenerateOptions, GenerateResult, ModelProvider } from "./types.js";

/**
 * Kalitsiz ishlaydigan provayder.
 * Maqsadi — butun agent tsiklini (tasniflash, tool chaqirish, verify gate,
 * o'zgarish hisobi) API kalitisiz uchidan-uchiga sinab ko'rish.
 * Ishlab chiqarishda emas, faqat dev va testda.
 */
export class MockProvider implements ModelProvider {
  readonly id = "mock";

  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    const last = [...opts.messages].reverse().find((m) => m.role === "user");
    const userText = last?.content ?? "";

    // Tasniflash so'rovi bo'lsa — JSON qaytaramiz.
    const system = opts.messages.find((m) => m.role === "system")?.content ?? "";
    if (system.includes("CLASSIFIER")) {
      const kind = guessKind(userText);
      const text = JSON.stringify({
        kind,
        summaryUz: `Taxminiy tasnif (mock): ${kind}`,
        clarifyingQuestionUz:
          kind === "unclear" ? "Aniqroq aytsangiz: qaysi ekranni va nimasini o'zgartiraylik?" : null,
      });
      opts.onText?.(text);
      return done(text, 0);
    }

    const listTool = opts.tools?.find((t) => t.name === "list_files");
    if (listTool) {
      opts.onToolStart?.("list_files", "{}");
      const res = await listTool.execute({ dir: "." } as never);
      opts.onToolEnd?.("list_files", res);
    }

    // "Rang" so'ralganda haqiqiy tahrir qilamiz: shu orqali verify gate, git
    // versiya va o'zgarish hisobi yo'li kalitsiz ham uchidan-uchiga sinaladi.
    const scripted = await this.scriptedColorEdit(userText, opts);
    if (scripted) return scripted;

    const text =
      "Mock rejim: model kaliti sozlanmagan. Kod o'zgarmadi.\n" +
      "Haqiqiy generatsiya uchun AI_GATEWAY_API_KEY yoki ANTHROPIC_API_KEY ni .env ga qo'shing.";
    opts.onText?.(text);
    return done(text, listTool ? 1 : 0);
  }

  /** Dev harness: `lib/theme.ts` dagi asosiy rangni almashtiradi. */
  private async scriptedColorEdit(
    userText: string,
    opts: GenerateOptions,
  ): Promise<GenerateResult | null> {
    const color = COLOR_WORDS.find(([word]) => userText.toLowerCase().includes(word));
    if (!color) return null;

    const readTool = opts.tools?.find((t) => t.name === "read_file");
    const editTool = opts.tools?.find((t) => t.name === "edit_file");
    if (!readTool || !editTool) return null;

    opts.onToolStart?.("read_file", "lib/theme.ts");
    const file = await readTool.execute({ path: "lib/theme.ts" } as never);
    opts.onToolEnd?.("read_file", file);
    if (!file.ok) return null;

    const current = file.output.match(/primary:\s*"(#[0-9A-Fa-f]{6})"/)?.[1];
    if (!current || current === color[1]) return null;

    opts.onToolStart?.("edit_file", `lib/theme.ts ${current} -> ${color[1]}`);
    const edit = await editTool.execute({
      path: "lib/theme.ts",
      oldText: `primary: "${current}"`,
      newText: `primary: "${color[1]}"`,
    } as never);
    opts.onToolEnd?.("edit_file", edit);

    const text = `Asosiy rangni ${color[0]} (${color[1]}) ga o'zgartirdim.`;
    opts.onText?.(text);
    return done(text, 2);
  }
}

const COLOR_WORDS: Array<[string, string]> = [
  ["yashil", "#16A34A"],
  ["qizil", "#DC2626"],
  ["ko'k", "#2563EB"],
  ["sariq", "#CA8A04"],
  ["qora", "#111827"],
];

function guessKind(text: string): string {
  const t = text.toLowerCase().trim();
  if (/\?$|qanday|nima uchun|nega|nima\b/.test(t)) return "question";
  if (t.length < 12 || /chiroyli|yaxshi qil|biror narsa|noto'g'ri/.test(t)) return "unclear";
  if (/qo'sh|yangi ekran|ulash|integratsiya/.test(t)) return "large";
  if (/rang|matn|o'lcham|joyla|almashtir/.test(t)) return "small_edit";
  return "medium";
}

function done(text: string, toolCalls: number): GenerateResult {
  return {
    text,
    toolCalls,
    usage: { inputTokens: 0, outputTokens: 0 },
    costCents: 0,
    finishReason: "stop",
  };
}
