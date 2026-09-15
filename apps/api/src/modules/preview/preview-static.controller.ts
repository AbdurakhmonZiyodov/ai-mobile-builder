import fs from "node:fs/promises";
import path from "node:path";
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { APP_CONFIG, type AppConfig } from "../../config/configuration.js";

/** Servis qiladigan fayl turlari. Ro'yxatda yo'q tur berilmaydi. */
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

@Controller("preview")
export class PreviewStaticController {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  /**
   * GET /preview/:id/static/* — yig'ilgan veb preview fayllari.
   *
   * Nega tayyor statik middleware emas: uning `root` i ish papkasiga
   * nisbatan hisoblanadi, workspace esa absolut yo'lda. Amalda bu 404
   * berdi. O'zimiz bergan holda yo'l chegarasini ham aniq tekshiramiz.
   *
   * Xavfsizlik: yo'l loyihaning `.amb-web` papkasidan CHIQIB ketmasligi
   * tekshiriladi — aks holda `../../` bilan istalgan faylni o'qish mumkin
   * bo'lardi.
   */
  /**
   * Papka manzili (`…/static/`) — ilovaning ildiz marshruti.
   *
   * Nega alohida: manzil `index.html` bilan tugasa, Expo Router uni
   * marshrut deb oladi va «Bunday sahifa yo'q» chiqaradi. Ildiz `/`
   * bo'lishi kerak.
   */
  @Get(":id/static")
  async serveRoot(@Param("id") id: string, @Res() res: Response): Promise<void> {
    return this.sendFile(id, "index.html", res);
  }

  @Get(":id/static/*path")
  async serve(@Param("id") id: string, @Req() req: Request, @Res() res: Response): Promise<void> {
    /**
     * Yo'lning `/static/` dan KEYINGI QISMI.
     *
     * `split("/static/")[1]` ISHLATIB BO'LMAYDI: Expo chiqishida fayllar
     * `_expo/static/js/web/…` ichida yotadi, ya'ni yo'lda `/static/`
     * ikki marta uchraydi. U holda faqat `_expo` olinardi va butun JS
     * bundle 404 berardi — sahifa server tomonda chizilgan holida
     * qotib qolardi, konsolda esa hech qanday xato ko'rinmasdi.
     *
     * Shuning uchun faqat BIRINCHI ajratuvchidan keyingi hamma narsani
     * olamiz.
     */
    const marker = "/static/";
    const at = req.path.indexOf(marker);
    const relative = at === -1 ? "" : req.path.slice(at + marker.length);

    return this.sendFile(id, relative, res);
  }

  /** Fayl yuborish — yo'l chegarasi shu yerda tekshiriladi. */
  private async sendFile(id: string, relative: string, res: Response): Promise<void> {
    if (!/^[a-zA-Z0-9_-]{3,64}$/.test(id)) {
      throw new BadRequestException({ messageUz: "Loyiha manzili noto'g'ri." });
    }

    const base = path.join(this.config.workspaceRoot, id, ".amb-web");
    const target = path.resolve(base, relative || "index.html");

    if (target !== base && !target.startsWith(base + path.sep)) {
      throw new ForbiddenException({ messageUz: "Bu faylga ruxsat yo'q." });
    }

    let file: Buffer;
    try {
      file = await fs.readFile(target);
    } catch {
      throw new NotFoundException({
        messageUz: "Preview topilmadi. Avval veb preview yig'ing.",
      });
    }

    const type = MIME[path.extname(target).toLowerCase()] ?? "application/octet-stream";
    res.setHeader("Content-Type", type);
    // Preview har o'zgarishda yangilanadi — keshlash eski ilovani ko'rsatardi.
    res.setHeader("Cache-Control", "no-store");
    res.send(file);
  }
}
