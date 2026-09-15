import type { HttpClient } from "../core/http-client";
import type { CheckReviewResponse } from "../types/review.types";

const BASE = "/review";

/**
 * Do'kon tekshiruvi.
 *
 * Nega alohida class, `projects` ichida emas: tekshiruv loyihaning
 * maydoni emas, mustaqil amal. Uni `projects` ga qo'shsak, o'sha class
 * ertaga billing va handoff'ni ham yutib, yana bitta katta faylga
 * aylanardi — aynan biz qochayotgan holat.
 */
export class ReviewEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Apple bandlari bo'yicha tekshiruv.
   *
   * Nega do'konga chiqarishdan OLDIN: Apple ko'rigi 1–3 kun davom etadi.
   * Sababni oldindan topib tuzatsak, mijoz shuncha kun yo'qotmaydi.
   */
  check(projectId: string): Promise<CheckReviewResponse> {
    return this.http.get<CheckReviewResponse>(`${BASE}/${projectId}`);
  }
}
