import type { EditResult, WorkspaceDriver } from "../../../infrastructure/workspace/drivers/driver.interface.js";

/**
 * Tool'larning umumiy konteksti.
 *
 * `changes` — shu run davomida o'zgargan fayllar. U ikki joyda hal qiluvchi:
 * diff bo'sh bo'lsa o'zgarish HISOBLANMAYDI, va UI'da mijoz nima
 * o'zgarganini ko'radi.
 */
export interface ToolContext {
  ws: WorkspaceDriver;
  changes: EditResult[];
  onFileChanged?: (change: EditResult) => void;
  /**
   * Design mode — kod o'zgarmaydi va hech qachon hisoblanmaydi.
   * Shuning uchun tahrir tool'lari berilmaydi: aks holda «design mode»
   * belgisi cheksiz bepul o'zgarish eshigiga aylanadi.
   */
  readOnly?: boolean;
}

/** Fayl o'zgarishini ro'yxatga qo'shadi va UI'ga xabar beradi. */
export function recordChange(ctx: ToolContext, change: EditResult): void {
  ctx.changes.push(change);
  ctx.onFileChanged?.(change);
}
