import { CallHandler, ExecutionContext, Injectable, Logger, type NestInterceptor } from "@nestjs/common";
import type { Request } from "express";
import { tap } from "rxjs";

/**
 * So'rov logi.
 *
 * Nega davomiylik yoziladi: «birinchi preview < 90 soniya» mahsulot
 * metrikasi. Qaysi endpoint sekinlashganini log'dan ko'rmasak, uni
 * o'lchay olmaymiz.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const started = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.logger.log(`${req.method} ${req.url} — ${Date.now() - started} ms`),
        error: (err: unknown) =>
          this.logger.warn(
            `${req.method} ${req.url} — ${Date.now() - started} ms — ${
              err instanceof Error ? err.message : String(err)
            }`,
          ),
      }),
    );
  }
}
