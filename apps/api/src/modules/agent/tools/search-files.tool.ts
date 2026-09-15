import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import type { ToolContext } from "./tool.types.js";

/**
 * Loyiha bo'ylab matn qidirish.
 *
 * Nega kerak: butun repo modelga HECH QACHON yuborilmaydi. Agent kerakli
 * joyni qidiruv bilan topadi va faqat o'sha fayllarni o'qiydi.
 */
export function searchFilesTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "search_files",
    description:
      "Loyiha bo'ylab matn qidirish. Qaysi faylni tahrirlashni bilmasang shuni ishlat.",
    parameters: z.object({
      query: z.string(),
      glob: z.string().optional().describe("Masalan: app/**/*.tsx"),
    }),
    execute: async ({ query, glob }) => {
      const hits = await ctx.ws.search(query, glob ? { glob } : {});
      return {
        ok: true,
        output: hits.map((h) => `${h.path}:${h.line}: ${h.text}`).join("\n") || "(topilmadi)",
        summary: `${hits.length} natija`,
      };
    },
  });
}
