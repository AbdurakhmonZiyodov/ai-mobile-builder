import { Controller, Get, Param } from "@nestjs/common";
import { ReviewService } from "./review.service.js";

@Controller("review")
export class ReviewController {
  constructor(private readonly review: ReviewService) {}

  /**
   * GET /review/:id — do'kon bandlari bo'yicha tekshiruv.
   *
   * Nega do'konga chiqarishdan OLDIN: Apple ko'rigi 1–3 kun davom etadi.
   * Rad etish sababini oldindan topib tuzatsak, mijoz shuncha kun
   * yo'qotmaydi va bizning kafolat xarajatimiz tushadi.
   *
   * Nega GET: tekshiruv hech narsani o'zgartirmaydi va istalgan payt
   * qayta chaqirilishi mumkin.
   */
  @Get(":id")
  async check(@Param("id") id: string) {
    return this.review.check(id);
  }
}
