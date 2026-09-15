/**
 * Backend har xatoda shu shaklni qaytaradi (`docs/API.md`).
 *
 * Nega `ok: false` maydoni ham bor: javobni o'qimasdan turib xatoni
 * ajratish kerak bo'lgan joylar bor (masalan log).
 */
export interface ApiErrorBody {
  ok: false;
  messageUz: string;
  fields?: ApiFieldError[];
}

/** Forma maydoniga bog'langan xato — zod validatsiyasidan keladi. */
export interface ApiFieldError {
  field: string;
  messageUz: string;
}

/**
 * HTTP xatosi.
 *
 * Nega oddiy `Error` emas: komponentga «nima bo'ldi» emas, «mijozga nima
 * deyish kerak» kerak. Shuning uchun `messageUz` — birinchi darajali
 * maydon, `status` esa qaror qabul qilish uchun (404 — «topilmadi»
 * ekrani, 422 — forma xatosi). `fields` bo'lsa, xabarni forma
 * maydonlariga tarqatish mumkin.
 *
 * Nega `instanceof` ishlaydi: `Error` dan meros olganda TS `target: ES2022`
 * da prototip zanjiri buzilmaydi — shuning uchun chaqiruv joylarida
 * `err instanceof ApiRequestError` ishonchli.
 */
export class ApiRequestError extends Error {
  constructor(
    readonly messageUz: string,
    readonly status: number,
    readonly fields?: ApiFieldError[],
  ) {
    super(messageUz);
    this.name = "ApiRequestError";
  }

  /**
   * Javob tanasi haqiqatan ham xato shaklidami.
   *
   * Nega tekshiruv kerak: proksi yoki nginx 502 qaytarsa, tana JSON emas,
   * HTML bo'ladi. Uni `as ApiErrorBody` deb o'qish `messageUz` o'rniga
   * `undefined` beradi va mijoz bo'sh xato ko'radi.
   */
  static isErrorBody(value: unknown): value is ApiErrorBody {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as { messageUz?: unknown }).messageUz === "string"
    );
  }
}
