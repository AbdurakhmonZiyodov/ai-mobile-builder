/**
 * Model qatlamining xatolari.
 *
 * Nega o'z turimiz: mijozga «AI_InvalidPromptError» yoki «401
 * Unauthorized» ko'rsatib bo'lmaydi. Lekin bizga aniq sabab kerak —
 * kalit muammosimi, kvota tugadimi yoki bizning kodimizda xatomi.
 */
export type LlmErrorKind =
  /** Kalit yo'q, noto'g'ri yoki muddati tugagan */
  | "auth"
  /** Hisobda mablag' yoki byudjet qolmagan */
  | "quota"
  /** So'rovlar chegarasi yoki provayder band */
  | "rate_limit"
  /** Bizning so'rovimiz noto'g'ri tuzilgan — kod xatosi */
  | "bad_request"
  | "unknown";

export class LlmError extends Error {
  constructor(
    readonly kind: LlmErrorKind,
    /** Mijozga ko'rsatiladigan matn */
    readonly messageUz: string,
    /** Log uchun asl xato. `Error.cause` ni qayta e'lon qilamiz. */
    override readonly cause: unknown,
  ) {
    super(messageUz);
    this.name = "LlmError";
  }
}

/**
 * Provayder xatosini turkumlaydi.
 *
 * Xabarlar ataylab «bu bizning tomondan» deb ochiq aytadi: mijoz
 * o'z so'rovida xato qildim deb o'ylamasligi kerak.
 */
export function classifyLlmError(err: unknown): LlmError {
  const raw = err instanceof Error ? `${err.name}: ${err.message}` : String(err);

  if (/401|unauthorized|invalid api key|invalid_api_key|authentication/i.test(raw)) {
    return new LlmError(
      "auth",
      "Model xizmatiga ulanib bo'lmadi — sozlama muammosi bizning tomonda. O'zgarish saqlanmadi va hisoblanmadi.",
      err,
    );
  }

  if (/402|insufficient|credit|budget|quota exceeded/i.test(raw)) {
    return new LlmError(
      "quota",
      "Model xizmatida mablag' tugadi — bu bizning tomondagi muammo. O'zgarish hisoblanmadi, tez orada tuzatamiz.",
      err,
    );
  }

  if (/429|rate.?limit|overloaded|capacity/i.test(raw)) {
    return new LlmError(
      "rate_limit",
      "Hozir juda ko'p so'rov bor. Bir daqiqadan keyin qayta urinib ko'ring — bu o'zgarish hisoblanmadi.",
      err,
    );
  }

  if (/InvalidPrompt|invalid.?request|400/i.test(raw)) {
    return new LlmError(
      "bad_request",
      "So'rovni modelga yuborishda xatolik bo'ldi — bu bizning kodimizdagi nosozlik. O'zgarish hisoblanmadi.",
      err,
    );
  }

  return new LlmError(
    "unknown",
    "Model javob bermadi. O'zgarish saqlanmadi va hisoblanmadi — qayta urinib ko'ring.",
    err,
  );
}
