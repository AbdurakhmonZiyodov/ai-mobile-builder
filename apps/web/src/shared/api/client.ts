/**
 * API mijozi.
 *
 * Nega o'z qatlamimiz, tayyor kutubxona emas: bizga faqat uchta narsa
 * kerak — GET, POST va SSE oqimi. Kutubxona keltiradigan kesh va qayta
 * urinish mantiqi bu yerda foyda bermaydi, chunki agent so'rovlari uzun
 * va takrorlanmaydi.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Backend har xatoda shu shaklni qaytaradi. */
export interface ApiError {
  ok: false;
  messageUz: string;
  fields?: Array<{ field: string; messageUz: string }>;
}

export class ApiRequestError extends Error {
  constructor(
    readonly messageUz: string,
    readonly status: number,
    readonly fields?: ApiError["fields"],
  ) {
    super(messageUz);
    this.name = "ApiRequestError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  return handle<T>(res, path);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return handle<T>(res, path);
}

async function handle<T>(res: Response, path: string): Promise<T> {
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const error = data as ApiError | null;
    throw new ApiRequestError(
      error?.messageUz ?? `So'rov bajarilmadi (${path})`,
      res.status,
      error?.fields,
    );
  }
  return data as T;
}
