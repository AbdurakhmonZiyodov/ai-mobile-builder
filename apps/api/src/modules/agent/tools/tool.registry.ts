import type { ToolSpec } from "../../../infrastructure/llm/llm.types.js";
import { createFileTool } from "./create-file.tool.js";
import { deleteFileTool } from "./delete-file.tool.js";
import { editFileTool } from "./edit-file.tool.js";
import { listFilesTool } from "./list-files.tool.js";
import { readFileTool } from "./read-file.tool.js";
import { searchFilesTool } from "./search-files.tool.js";
import { updateDesignNoteTool } from "./update-design-note.tool.js";
import type { ToolContext } from "./tool.types.js";

/**
 * Agentga beriladigan tool to'plami.
 *
 * Ikkita to'plam bor:
 *  · o'qish  — loyihani o'rganish, hamma rejimda mavjud
 *  · yozish  — faqat hisoblanadigan o'zgarishda
 *
 * Design mode'da yozish to'plami berilmaydi (`readOnly`).
 */
export function buildTools(ctx: ToolContext): ToolSpec[] {
  const readTools: ToolSpec[] = [listFilesTool(ctx), readFileTool(ctx), searchFilesTool(ctx)];

  if (ctx.readOnly) {
    return [...readTools, updateDesignNoteTool(ctx)];
  }

  return [...readTools, editFileTool(ctx), createFileTool(ctx), deleteFileTool(ctx)];
}

export type { ToolContext } from "./tool.types.js";
