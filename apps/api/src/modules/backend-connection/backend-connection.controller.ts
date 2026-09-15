import { Controller, Get, Param, Post } from "@nestjs/common";
import { connectBackendInput } from "@amb/contracts";
import { ZodBody } from "../../common/decorators/zod-body.decorator.js";
import { BackendConnectionService } from "./backend-connection.service.js";
import type { ConnectBackendDto } from "./dto/connect-backend.dto.js";

@Controller("backend")
export class BackendConnectionController {
  constructor(private readonly backend: BackendConnectionService) {}

  /**
   * POST /backend/:id — mijozning Supabase yoki Firebase kalitlarini ulash.
   *
   * Nega kalitlar mijozniki: agar biz loyihani o'zimiz yaratsak, mijoz
   * ketganda ma'lumoti bizda qoladi. Bu lock-in va mahsulot va'damizga zid.
   * Raqobatchilardan biri aynan shu sababdan tanqid qilinadi.
   */
  @Post(":id")
  async connect(@Param("id") id: string, @ZodBody(connectBackendInput) dto: ConnectBackendDto) {
    return this.backend.connect(id, dto);
  }

  /**
   * GET /backend/:id — ulanish holati.
   *
   * Kalitlar QAYTARILMAYDI, faqat «bormi yo'qmi». Kalit bir marta
   * kiritiladi va boshqa hech qachon o'qilmaydi — hatto biz ham.
   */
  @Get(":id")
  async status(@Param("id") id: string) {
    return this.backend.status(id);
  }

  /**
   * POST /backend/:id/burn-service-role — `service_role` kalitini o'chirish.
   *
   * Nega alohida endpoint va nega majburiy: bu kalit RLS'ni butunlay
   * chetlab o'tadi, ya'ni u bilan butun bazani o'qish va o'chirish mumkin.
   * U faqat sxema yaratish paytida kerak. Ish tugagach uni saqlab turish
   * — keraksiz xavf.
   */
  @Post(":id/burn-service-role")
  async burn(@Param("id") id: string) {
    return this.backend.burnServiceRole(id);
  }
}
