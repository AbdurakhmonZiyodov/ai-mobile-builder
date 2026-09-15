import { z } from "zod";
import { defineTool, type ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import { recordChange, type ToolContext } from "./tool.types.js";

/**
 * Design mode'da agentga ruxsat etilgan yagona yozish amali.
 *
 * `DESIGN.md` — dizayn qarorlari yozib boriladigan fayl. Ilova kodi
 * tegilmaydi, shuning uchun bu amal hech qachon hisoblanmaydi
 * (`decideCharge` "design" turini 0 deb belgilaydi).
 *
 * `recordChange` MAJBURIY: usiz o'zgarish ro'yxatga tushmaydi, agent
 * "hech narsa o'zgarmadi" deb xabar beradi, UI'da fayl ko'rinmaydi va
 * DESIGN.md commit qilinmasdan qoladi — keyingi hisoblanadigan run'ning
 * `git add -A` si uni begona versiyaga qo'shib yuboradi.
 */
export function updateDesignNoteTool(ctx: ToolContext): ToolSpec {
  return defineTool({
    name: "update_design_note",
    description:
      "DESIGN.md ni yangilash. Design mode'da faqat shu yozish mumkin — ilova kodi tegilmaydi.",
    parameters: z.object({ content: z.string() }),
    execute: async ({ content }) => {
      const result = await ctx.ws.write("DESIGN.md", content);
      recordChange(ctx, result);
      return {
        ok: true,
        output: `DESIGN.md yangilandi (+${result.added} / -${result.removed})`,
        summary: "DESIGN.md",
      };
    },
  });
}
