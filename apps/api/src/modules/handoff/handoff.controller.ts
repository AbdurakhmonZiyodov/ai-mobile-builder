import { Controller, Param, Post } from "@nestjs/common";
import { HandoffService } from "./handoff.service.js";

@Controller("handoff")
export class HandoffController {
  constructor(private readonly handoff: HandoffService) {}

  /**
   * POST /handoff/:id — dasturchiga topshirish paketi.
   *
   * Nega POST: hujjatlar workspace'ga yoziladi va commit qilinadi —
   * bu holatni o'zgartiradi.
   *
   * Nega har tarifda mavjud: «obuna tugasa loyiha qulflanadi» bozordagi
   * uchta asosiy shikoyatdan biri. Chiqish yo'li doim ochiq bo'lishi
   * mijozning bizga ishonishining sababi.
   */
  @Post(":id")
  async generate(@Param("id") id: string) {
    return this.handoff.generate(id);
  }
}
