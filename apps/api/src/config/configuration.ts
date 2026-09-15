import path from "node:path";
import type { Env } from "./env.schema.js";

/**
 * Tekshirilgan muhitdan ilova sozlamalarini yasaydi.
 *
 * Nega alohida qatlam: kod `process.env` ga to'g'ridan-to'g'ri murojaat
 * qilmasligi kerak. Shunda sozlamani testda almashtirish oson va qaysi
 * o'zgaruvchi qayerda ishlatilishi bitta joyda ko'rinadi.
 */
export interface AppConfig {
  nodeEnv: Env["NODE_ENV"];
  port: number;
  databaseUrl: string;
  webOrigin: string;
  secretKey: string;
  workspaceRoot: string;
  templateDir: string;
  models: { cheap: string; standard: string; strong: string };
  gatewayApiKey: string | undefined;
}

export function buildConfig(env: Env, repoRoot: string): AppConfig {
  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    databaseUrl: env.DATABASE_URL,
    webOrigin: env.AMB_WEB_ORIGIN,
    secretKey: env.AMB_SECRET_KEY,
    workspaceRoot: env.AMB_WORKSPACE_ROOT ?? path.join(repoRoot, "workspaces"),
    templateDir: env.AMB_TEMPLATE_DIR ?? path.join(repoRoot, "templates/mobile"),
    models: {
      cheap: env.AMB_MODEL_CHEAP,
      standard: env.AMB_MODEL_STANDARD,
      strong: env.AMB_MODEL_STRONG,
    },
    gatewayApiKey: env.AI_GATEWAY_API_KEY,
  };
}

/** DI tokeni — `@Inject(APP_CONFIG)`. */
export const APP_CONFIG = Symbol("APP_CONFIG");
