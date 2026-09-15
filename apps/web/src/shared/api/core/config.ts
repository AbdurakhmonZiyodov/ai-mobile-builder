/**
 * API manzili — yagona manba.
 *
 * Nega alohida fayl, `http-client.ts` ichida emas: bu qiymat qatlamning
 * eng pastki bo'g'ini va uni endpoint class'lari ham, `api.ts` ham,
 * hatto JSX ham (xato xabarida «backend ishlab turibdimi?») o'qiydi.
 * Agar u `HttpClient` ichida yashasa, shu joylarning har biri transport
 * faylini import qilishga majbur bo'lardi.
 *
 * `process.env.NEXT_PUBLIC_API_URL` aynan shu ko'rinishda yozilgan:
 * Next uni build paytida matn sifatida almashtiradi, shuning uchun
 * `process.env[name]` kabi dinamik o'qish brauzerda `undefined` beradi.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
