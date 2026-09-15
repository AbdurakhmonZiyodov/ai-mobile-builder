import { ApiRequestError } from "./api-error";

/** So'rov qatoriga tushadigan qiymatlar. `undefined` — maydon umuman qo'shilmaydi. */
export type QueryValue = string | number | boolean | undefined;

export type QueryParams = Record<string, QueryValue>;

export interface RequestOptions {
  query?: QueryParams;
  signal?: AbortSignal;
}

/**
 * HTTP transport.
 *
 * Nega o'z qatlamimiz, tayyor kutubxona emas: bizga faqat GET va POST
 * kerak. Kutubxona keltiradigan kesh, retry va interceptor mantiqi bu
 * yerda foyda bermaydi — agent so'rovlari uzun va takrorlanmaydi,
 * qolganlari esa oddiy CRUD.
 *
 * Nega class, alohida funksiyalar emas: `baseUrl` konstruktorga bir marta
 * beriladi va shundan keyin hech bir chaqiruv uni takrorlamaydi. Bu
 * testda boshqa manzilga yo'naltirish imkonini ham beradi —
 * `new HttpClient("http://localhost:4100")`.
 */
export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  get<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    // `no-store`: loyiha holati va qoldiq har safar yangi bo'lishi shart.
    // Next'ning standart keshi bilan mijoz eski qoldiqni ko'rardi.
    return this.request<TResponse>(path, { method: "GET", cache: "no-store" }, options);
  }

  post<TResponse>(path: string, body?: unknown, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(
      path,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body ?? {}),
      },
      options,
    );
  }

  private async request<TResponse>(
    path: string,
    init: RequestInit,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const url = this.buildUrl(path, options?.query);
    // `signal: undefined` ni ochiq uzatib bo'lmaydi — ba'zi runtime'lar uni
    // «darhol bekor qil» deb tushunadi, shuning uchun shartli qo'shiladi.
    const res = await fetch(url, options?.signal ? { ...init, signal: options.signal } : init);
    return this.parse<TResponse>(res, path);
  }

  /**
   * Manzilni yig'adi va so'rov qatorini KODLAYDI.
   *
   * Nega markazda: avval har endpoint `encodeURIComponent` ni o'zi
   * chaqirardi va bittasini unutish yetardi — `path=app/(tabs)/index.tsx`
   * kabi yo'l serverga buzilib yetib borardi.
   */
  private buildUrl(path: string, query?: QueryParams): string {
    if (!query) return `${this.baseUrl}${path}`;

    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) search.set(key, String(value));
    }

    const suffix = search.toString();
    return suffix ? `${this.baseUrl}${path}?${suffix}` : `${this.baseUrl}${path}`;
  }

  /**
   * Javobni o'qiydi va xatoni `ApiRequestError` ga aylantiradi.
   *
   * Nega xato QAYTARILMAYDI, TASHLANADI: chaqiruv joyi muvaffaqiyatli
   * javobni tekshirmasdan ishlatishi kerak. `Result` turi bo'lsa, har
   * komponent `if (!result.ok)` yozishga majbur bo'lardi va bittasi
   * unutilsa, xato jimgina yo'qolardi.
   */
  private async parse<TResponse>(res: Response, path: string): Promise<TResponse> {
    const data: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const body = ApiRequestError.isErrorBody(data) ? data : null;
      throw new ApiRequestError(
        body?.messageUz ?? `So'rov bajarilmadi (${path})`,
        res.status,
        body?.fields,
      );
    }

    return data as TResponse;
  }
}
