import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { PreviewService } from "./preview.service.js";

@Controller("preview")
export class PreviewController {
  constructor(private readonly preview: PreviewService) {}

  /**
   * GET /preview/:id — qaysi yo'l va nima uchun.
   *
   * Nega sabab ham qaytadi: mijoz «nega telefonimda ochilmayapti?» deb
   * so'ramasligi kerak. Javob bir jumlada, oldindan beriladi.
   *
   * `?apple=1` — mijozda Apple Developer akkaunti bor. Bu qarorni
   * o'zgartiradi: `eas go` va dev client faqat shunda mumkin.
   */
  @Get(":id")
  async decide(@Param("id") id: string, @Query("apple") apple?: string) {
    return this.preview.decide(id, apple === "1");
  }

  /**
   * POST /preview/:id/web — veb preview yig'ish.
   *
   * Nega POST: yig'ish resurs sarflaydi va fayl tizimini o'zgartiradi.
   * GET bo'lsa, brauzer uni oldindan yuklab, har ochilishda qayta
   * yig'ishga majbur qilardi.
   */
  @Post(":id/web")
  async buildWeb(@Param("id") id: string) {
    return this.preview.buildWeb(id);
  }
}
