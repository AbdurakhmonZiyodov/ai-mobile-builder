import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import type { ToolContext } from "./tool.types.js";

/**
 * Faylni o'qish, qator raqamlari bilan.
 *
 * Nega qator raqami: `edit_file` fayldagi ANIQ matnni talab qiladi.
 * Raqamlar modelga qaysi qismni tanlashni aniqlashtirishga yordam beradi.
 */
export function readFileTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "read_file",
    description:
      "Faylni o'qish. edit_file dan OLDIN doim shuni chaqir — aniq matn nusxasi kerak.",
    parameters: z.object({
      path: z.string(),
      startLine: z.number().int().positive().optional(),
      endLine: z.number().int().positive().optional(),
    }),
    execute: async ({ path, startLine, endLine }) => {
      try {
        const content = await ctx.ws.read(path);
        const lines = content.split("\n");
        const from = Math.max(1, startLine ?? 1);
        const to = Math.min(lines.length, endLine ?? lines.length);
        const body = lines
          .slice(from - 1, to)
          .map((line, idx) => `${from + idx}\t${line}`)
          .join("\n");

        return {
          ok: true,
          output: body,
          summary: `${path} (${from}-${to} / ${lines.length} qator)`,
        };
      } catch (err) {
        return { ok: false, output: `Faylni o'qib bo'lmadi: ${String(err)}` };
      }
    },
  });
}
