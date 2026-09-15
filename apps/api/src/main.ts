import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { APP_CONFIG, type AppConfig } from "./config/configuration.js";
import { validateEnv } from "./config/env.schema.js";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor.js";

/**
 * Kirish nuqtasi.
 *
 * Sozlama NestJS ko'tarilishidan OLDIN tekshiriladi. Aks holda xato
 * Nest'ning DI stack trace'i ichida ko'milib qoladi va «AI_GATEWAY_API_KEY
 * yo'q» degan oddiy xabarni topish uchun yigirma qator o'qishga to'g'ri
 * keladi.
 */
async function bootstrap(): Promise<void> {
  // Bu yerda yiqilsa, pastdagi `catch` toza xabar chiqaradi.
  validateEnv(process.env);

  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  const config = app.get<AppConfig>(APP_CONFIG);
  const isDev = config.nodeEnv === "development";

  app.enableCors({ origin: [config.webOrigin], credentials: true });
  app.useGlobalFilters(new HttpExceptionFilter(isDev));
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Global `ValidationPipe` ataylab yo'q: u `class-validator` ni talab qiladi,
  // bizda esa validatsiya zod bilan va sxemalar `@amb/contracts` da —
  // frontend ham aynan o'shalarni ishlatadi. Ikkita alohida tekshiruv
  // qatlami vaqt o'tib bir-biridan uzoqlashadi.

  // SIGTERM'da ochiq ulanishlar toza yopilsin: Postgres hovuzi, SSE oqimlari.
  app.enableShutdownHooks();

  await app.listen(config.port);

  logger.log(`API: http://localhost:${config.port}`);
  logger.log(`Workspace: ${config.workspaceRoot}`);
  logger.log(`Shablon: ${config.templateDir}`);
}

void bootstrap().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\n✗ Server ishga tushmadi\n\n${message}\n`);
  process.exit(1);
});
