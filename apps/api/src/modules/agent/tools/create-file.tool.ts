import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import { recordChange, type ToolContext } from "./tool.types.js";

/**
 * Yangi fayl yaratish.
 *
 * Mavjud faylni bu bilan qayta yozib bo'lmaydi — bu `edit_file` ni chetlab
 * o'tishning eng oson yo'li bo'lardi. Fayl bor bo'lsa, model `edit_file` ga
 * yo'naltiriladi.
 */
export function createFileTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "create_file",
    description: "YANGI fayl yaratish. Mavjud faylni bu bilan qayta yozma — edit_file ishlat.",
    parameters: z.object({
      path: z.string(),
      content: z.string(),
    }),
    execute: async ({ path, content }) => {
      try {
        await ctx.ws.read(path);
        return {
          ok: false,
          output: `"${path}" allaqachon mavjud. Uni o'zgartirish uchun edit_file ishlat.`,
        };
      } catch {
        const result = await ctx.ws.write(path, content);
        recordChange(ctx, result);
        return { ok: true, output: `Yaratildi: ${path}`, summary: path };
      }
    },
  });
}
