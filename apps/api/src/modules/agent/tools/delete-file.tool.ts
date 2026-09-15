import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import { recordChange, type ToolContext } from "./tool.types.js";

/** Faylni o'chirish. Git tarixida qolgani uchun qaytarib bo'ladi. */
export function deleteFileTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "delete_file",
    description: "Faylni o'chirish. Ehtiyot bo'l — faqat aniq keraksiz fayl uchun.",
    parameters: z.object({ path: z.string() }),
    execute: async ({ path }) => {
      try {
        const result = await ctx.ws.remove(path);
        recordChange(ctx, result);
        return { ok: true, output: `O'chirildi: ${path}`, summary: path };
      } catch (err) {
        return { ok: false, output: String(err) };
      }
    },
  });
}
