import type { HttpClient } from "../core/http-client";
import type { GenerateHandoffResponse } from "../types/handoff.types";

const BASE = "/handoff";

/**
 * Dasturchiga topshirish paketi.
 *
 * Nega har tarifda mavjud: «obuna tugasa loyiha qulflanadi» bozordagi
 * uchta asosiy shikoyatdan biri. Chiqish yo'li doim ochiq bo'lishi —
 * mijozning bizga ishonishining sababi.
 */
export class HandoffEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * `README.md`, `ARCHITECTURE.md`, `HANDOFF.md` yaratadi va commit qiladi.
   *
   * Nega POST: hujjatlar workspace'ga yoziladi va commit qilinadi — bu
   * holatni o'zgartiradi, ya'ni GET bo'lishi mumkin emas.
   */
  generate(projectId: string): Promise<GenerateHandoffResponse> {
    return this.http.post<GenerateHandoffResponse>(`${BASE}/${projectId}`);
  }
}
