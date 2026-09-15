import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import type { ToolContext } from "./tool.types.js";

/**
 * Papkadagi fayllar ro'yxati.
 * Agent loyihani o'rganishni odatda shundan boshlaydi.
 */
export function listFilesTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "list_files",
    description: "Papkadagi fayllar ro'yxati. Loyihani o'rganish uchun birinchi qadam.",
    parameters: z.object({
      dir: z.string().default(".").describe("Loyihaga nisbatan yo'l"),
    }),
    execute: async ({ dir }) => {
      const items = await ctx.ws.list(dir);
      return {
        ok: true,
        output: items.map((i) => `${i.type === "dir" ? "d" : "f"} ${i.path}`).join("\n") || "(bo'sh)",
        summary: `${items.length} element`,
      };
    },
  });
}
