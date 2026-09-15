import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import { recordChange, type ToolContext } from "./tool.types.js";

/**
 * Nuqtali diff — faylning ANIQ bir parchasini almashtirish.
 *
 * Nega to'liq qayta yozish yo'q:
 *  1. Narx. 400 qatorli ekranni qayta yozish ~6000 token, nuqtali diff ~200.
 *  2. Sifat. Model faylni qaytadan yozganda tegishi shart bo'lmagan joyni
 *     ham o'zgartiradi va ishlab turgan kodni buzadi.
 *
 * `oldText` fayl ichida aynan BIR MARTA uchrashi shart. Ko'p uchrasa,
 * drayver xato beradi va modeldan ko'proq kontekst so'raydi.
 */
export function editFileTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "edit_file",
    description:
      "Fayl ichidagi ANIQ bir parchani almashtirish. oldText fayl ichida aynan bir marta uchrashi shart. To'liq faylni qayta yozish taqiqlangan.",
    parameters: z.object({
      path: z.string(),
      oldText: z.string().describe("Fayldagi aniq matn, bo'sh joylari bilan"),
      newText: z.string().describe("O'rniga yoziladigan matn"),
    }),
    execute: async ({ path, oldText, newText }) => {
      if (oldText === newText) {
        return { ok: false, output: "oldText va newText bir xil — o'zgarish yo'q." };
      }
      try {
        const result = await ctx.ws.edit(path, oldText, newText);
        recordChange(ctx, result);
        return {
          ok: true,
          output: `Tahrirlandi: ${path} (+${result.added} / -${result.removed})`,
          summary: `${path} +${result.added}/-${result.removed}`,
        };
      } catch (err) {
        return { ok: false, output: err instanceof Error ? err.message : String(err) };
      }
    },
  });
}
