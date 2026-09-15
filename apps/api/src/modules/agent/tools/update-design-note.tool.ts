import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import type { ToolContext } from "./tool.types.js";

/**
 * Design mode'da agentga ruxsat etilgan yagona yozish amali.
 *
 * `DESIGN.md` — dizayn qarorlari yozib boriladigan fayl. Ilova kodi
 * tegilmaydi, shuning uchun bu amal hech qachon hisoblanmaydi.
 */
export function updateDesignNoteTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "update_design_note",
    description:
      "DESIGN.md ni yangilash. Design mode'da faqat shu yozish mumkin — ilova kodi tegilmaydi.",
    parameters: z.object({ content: z.string() }),
    execute: async ({ content }) => {
      await ctx.ws.write("DESIGN.md", content);
      return { ok: true, output: "DESIGN.md yangilandi", summary: "DESIGN.md" };
    },
  });
}
