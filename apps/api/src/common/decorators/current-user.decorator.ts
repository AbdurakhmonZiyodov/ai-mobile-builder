import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

/**
 * MVP'da autentifikatsiya yo'q — birinchi 5 pilot mijoz bilan yuzma-yuz
 * ishlanadi va ro'yxatdan o'tish oqimi ularning yo'lini to'sadi.
 *
 * Dekorator ataylab HOZIRDAN qo'yilgan: auth qo'shilganda faqat shu fayl
 * o'zgaradi, controller'lar tegilmaydi. Aks holda `demoUserId` o'nlab
 * joyga tarqab ketardi.
 */
export const DEMO_USER_ID = "usr_demo";

export const CurrentUser = createParamDecorator((_data: unknown, _ctx: ExecutionContext): string => {
  return DEMO_USER_ID;
});
