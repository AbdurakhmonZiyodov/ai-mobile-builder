/**
 * `@/shared/api` — qatlamning ommaviy yuzi.
 *
 * Komponentlar FAQAT shu fayldan import qiladi. Ichki tuzilma
 * (`core/`, `types/`, `endpoints/`) muallif uchun: fayllar resurs
 * bo'yicha bo'linadi va hech biri o'smaydi. Foydalanuvchi uchun esa
 * bitta manzil qoladi — ichki papkalar o'zgarsa, chaqiruv joylari
 * tegilmaydi.
 */

// Transport va sozlama — `API_URL` JSX'da ham kerak bo'ladi
// («backend ishlab turibdimi?» xabari).
export { API_URL } from "./core/config";
export { ApiRequestError } from "./core/api-error";
export type { ApiErrorBody, ApiFieldError } from "./core/api-error";
export { HttpClient } from "./core/http-client";
export type { QueryParams, QueryValue, RequestOptions } from "./core/http-client";
export { SseClient } from "./core/sse-client";
export type { SseEventHandler, SseStreamOptions } from "./core/sse-client";

// Endpoint class'lari — testda alohida yasash uchun.
export * from "./endpoints";

// So'rov va javob turlari.
export * from "./types";

// Ilova ishlatadigan mijoz.
export { ApiClient, api } from "./api";
