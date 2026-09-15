import { BadRequestException, Injectable, type PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";
import { translateIssue } from "./zod-message.uz.js";

/**
 * Zod sxemasi bo'yicha kiruvchi ma'lumotni tekshiradi.
 *
 * Nega class-validator emas: sxemalar `@amb/contracts` da yashaydi va
 * frontend ham aynan o'shalarni ishlatadi. Ikkita alohida tekshiruv
 * qatlami (backend'da dekoratorlar, frontend'da zod) vaqt o'tib
 * bir-biridan uzoqlashadi.
 *
 * Xabarlar o'zbek tiliga o'giriladi: mijoz «Expected string, received
 * undefined» degan matnni tushunmaydi.
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;

    throw new BadRequestException({
      messageUz: "Kiritilgan ma'lumot to'g'ri emas.",
      fields: result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(ildiz)",
        messageUz: translateIssue(issue),
      })),
    });
  }
}
