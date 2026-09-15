import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter,
} from "@nestjs/common";
import type { Request, Response } from "express";

/** Javobga o'tkaziladigan qo'shimcha maydonlar — `messageUz` dan tashqari. */
const PASSTHROUGH_KEYS = ["fields", "clause", "warningsUz"] as const;

/**
 * Global xato filtri.
 *
 * Nega kerak: mijoz — texnik bo'lmagan biznes egasi. Unga «Internal Server
 * Error» hech narsa aytmaydi va qo'rqitadi. Har javob o'zbek tilida, nima
 * bo'lgani va nima qilish kerakligi bilan qaytadi.
 *
 * Texnik tafsilot faqat development'da qo'shiladi — ishlab chiqarishda u
 * ichki tuzilma haqida ma'lumot sizdiradi.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly isDev: boolean) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = exception instanceof HttpException ? exception.getResponse() : null;

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url}`, stackOf(exception));
    }

    response.status(status).json({
      ok: false,
      messageUz: extractMessage(exception, body),
      // Maydon xatolari va band raqami mijozga aynan kerak: ular unga
      // nima noto'g'ri ekanini aniq ko'rsatadi.
      ...extractExtras(body),
      ...(this.isDev && exception instanceof Error ? { detail: exception.message } : {}),
      path: request.url,
      at: new Date().toISOString(),
    });
  }
}

function extractMessage(exception: unknown, body: unknown): string {
  if (!(exception instanceof HttpException)) {
    return "Kutilmagan xatolik yuz berdi. Bu o'zgarish hisoblanmadi.";
  }
  if (typeof body === "string") return body;

  if (isRecord(body)) {
    const candidate = body.messageUz ?? body.message;
    if (typeof candidate === "string") return candidate;
    if (Array.isArray(candidate)) return candidate.join(", ");
  }
  return exception.message;
}

function extractExtras(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) return {};

  const extras: Record<string, unknown> = {};
  for (const key of PASSTHROUGH_KEYS) {
    if (body[key] !== undefined) extras[key] = body[key];
  }
  return extras;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stackOf(exception: unknown): string {
  return exception instanceof Error ? (exception.stack ?? exception.message) : String(exception);
}
