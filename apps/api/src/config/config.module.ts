import path from "node:path";
import { Global, Module } from "@nestjs/common";
import { APP_CONFIG, buildConfig, type AppConfig } from "./configuration.js";
import { validateEnv } from "./env.schema.js";

/**
 * Global modul: sozlamalar hamma joyda kerak, har modulga alohida import
 * qilish ortiqcha shovqin bo'lardi.
 */
@Global()
@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: (): AppConfig => {
        const env = validateEnv(process.env);
        // apps/api dan repo ildizigacha ikki qadam yuqoriga
        const repoRoot = path.resolve(process.cwd(), "../..");
        return buildConfig(env, repoRoot);
      },
    },
  ],
  exports: [APP_CONFIG],
})
export class AppConfigModule {}
