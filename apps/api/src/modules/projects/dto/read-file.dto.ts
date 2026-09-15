import { z } from "zod";

/**
 * Fayl o'qish va versiyaga qaytarish so'rovlari.
 *
 * Nega zod, xom `@Query`/`@Body` emas: parametr berilmasa `undefined`
 * pastki qatlamga tushib, `LocalWorkspace.resolve()` ichida 500 beradi.
 * Mijoz uchun bu «server buzildi» degani, aslida so'rov noto'g'ri edi.
 */

export const readProjectFileQuery = z.object({
  path: z
    .string()
    .min(1, "fayl yo'li ko'rsatilmagan")
    .max(500)
    // Yo'l chegarasi drayverda ham tekshiriladi, bu birinchi to'siq.
    .refine((v) => !v.includes(".."), "yo'lda '..' bo'lishi mumkin emas"),
});
export type ReadProjectFileQuery = z.infer<typeof readProjectFileQuery>;

export const revertProjectBody = z.object({
  versionId: z.string().min(3, "versiya tanlanmagan"),
});
export type RevertProjectBody = z.infer<typeof revertProjectBody>;
