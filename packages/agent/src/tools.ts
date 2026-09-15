import { z } from "zod";
import { defineTool, type ToolSpec } from "@amb/ai";
import type { EditResult, WorkspaceDriver } from "@amb/workspace";

export interface ToolContext {
  ws: WorkspaceDriver;
  /**
   * Design mode — kod O'ZGARMAYDI va hech qachon hisoblanmaydi (spek 5.2).
   * Shuning uchun tahrir tool'lari berilmaydi: aks holda "design mode" belgisi
   * cheksiz bepul o'zgarish eshigiga aylanadi.
   */
  readOnly?: boolean;
  /** Bu run davomida o'zgargan fayllar — hisob va diff uchun. */
  changes: EditResult[];
  onFileChanged?: (e: EditResult) => void;
}

/**
 * Agent tool to'plami — spek 8.1.
 * `edit_file` nuqtali diff; to'liq qayta yozish (`write_file`) ataylab yo'q.
 */
export function buildTools(ctx: ToolContext): ToolSpec[] {
  const record = (e: EditResult) => {
    ctx.changes.push(e);
    ctx.onFileChanged?.(e);
  };

  const readTools: ToolSpec[] = [
    defineTool({
      name: "list_files",
      description: "Papkadagi fayllar ro'yxati. Loyihani o'rganish uchun birinchi qadam.",
      parameters: z.object({ dir: z.string().default(".").describe("Loyihaga nisbatan yo'l") }),
      execute: async ({ dir }) => {
        const items = await ctx.ws.list(dir);
        return {
          ok: true,
          output: items.map((i) => `${i.type === "dir" ? "d" : "f"} ${i.path}`).join("\n") || "(bo'sh)",
          summary: `${items.length} element`,
        };
      },
    }),

    defineTool({
      name: "read_file",
      description:
        "Faylni o'qish. edit_file dan OLDIN doim shuni chaqir — aniq matn nusxasi kerak.",
      parameters: z.object({
        path: z.string(),
        startLine: z.number().int().optional(),
        endLine: z.number().int().optional(),
      }),
      execute: async ({ path, startLine, endLine }) => {
        try {
          const content = await ctx.ws.read(path);
          const lines = content.split("\n");
          const from = Math.max(1, startLine ?? 1);
          const to = Math.min(lines.length, endLine ?? lines.length);
          const slice = lines.slice(from - 1, to);
          const numbered = slice.map((l, idx) => `${from + idx}\t${l}`).join("\n");
          return {
            ok: true,
            output: numbered,
            summary: `${path} (${from}-${to} / ${lines.length} qator)`,
          };
        } catch (err) {
          return { ok: false, output: `Faylni o'qib bo'lmadi: ${String(err)}` };
        }
      },
    }),

    defineTool({
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
    }),

  ];

  if (ctx.readOnly) {
    return [...readTools, designNoteTool(ctx)];
  }

  return [
    ...readTools,
    defineTool({
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
          const res = await ctx.ws.edit(path, oldText, newText);
          record(res);
          return {
            ok: true,
            output: `Tahrirlandi: ${path} (+${res.added} / -${res.removed})`,
            summary: `${path} +${res.added}/-${res.removed}`,
          };
        } catch (err) {
          return { ok: false, output: String(err instanceof Error ? err.message : err) };
        }
      },
    }),

    defineTool({
      name: "create_file",
      description: "YANGI fayl yaratish. Mavjud faylni bu bilan qayta yozma — edit_file ishlat.",
      parameters: z.object({ path: z.string(), content: z.string() }),
      execute: async ({ path, content }) => {
        try {
          await ctx.ws.read(path);
          return {
            ok: false,
            output: `"${path}" allaqachon mavjud. Uni o'zgartirish uchun edit_file ishlat.`,
          };
        } catch {
          const res = await ctx.ws.write(path, content);
          record(res);
          return { ok: true, output: `Yaratildi: ${path}`, summary: path };
        }
      },
    }),

    defineTool({
      name: "delete_file",
      description: "Faylni o'chirish. Ehtiyot bo'l — faqat aniq keraksiz fayl uchun.",
      parameters: z.object({ path: z.string() }),
      execute: async ({ path }) => {
        try {
          const res = await ctx.ws.remove(path);
          record(res);
          return { ok: true, output: `O'chirildi: ${path}`, summary: path };
        } catch (err) {
          return { ok: false, output: String(err) };
        }
      },
    }),
  ];
}

/** Design mode'da agent faqat DESIGN.md ni yangilay oladi. */
function designNoteTool(ctx: ToolContext): ToolSpec {
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
