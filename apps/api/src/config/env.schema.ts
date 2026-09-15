import { z } from "zod";

/**
 * Muhit o'zgaruvchilari — ishga tushishda tekshiriladi.
 *
 * Nega qat'iy: sozlama xatosi ish vaqtida chiqsa, uni mijoz topadi. Ishga
 * tushishda chiqsa, biz topamiz. Server noto'g'ri sozlama bilan umuman
 * ko'tarilmagani afzal.
 *
 * `.env` dagi bo'sh qator (`FOO=`) sozlanmagan deb qaraladi — `??` bo'sh
 * satrni o'tkazib yuboradi va standart qiymat ishlamay qoladi.
 */
const nonEmpty = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v.length > 0, "bo'sh bo'lmasin");

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  /** Postgres ulanishi */
  DATABASE_URL: nonEmpty,

  /**
   * Vercel AI Gateway kaliti.
   * Bittasi bo'lishi SHART — mock model yo'q, chunki soxta natija mijozga
   * ilovasi ishlayotgandek tuyuladi.
   */
  AI_GATEWAY_API_KEY: nonEmpty.optional(),
  VERCEL_OIDC_TOKEN: nonEmpty.optional(),

  /** Tier -> model. Model drifti bo'lganda faqat shular o'zgaradi. */
  AMB_MODEL_CHEAP: z.string().default("anthropic/claude-haiku-4.5"),
  AMB_MODEL_STANDARD: z.string().default("anthropic/claude-sonnet-5"),
  AMB_MODEL_STRONG: z.string().default("anthropic/claude-opus-5"),

  /** Loyihalar katalogi va shablon */
  AMB_WORKSPACE_ROOT: z.string().optional(),
  AMB_TEMPLATE_DIR: z.string().optional(),

  /** Mijoz kalitlarini shifrlash. Ishlab chiqarishda KMS. */
  AMB_SECRET_KEY: nonEmpty.refine((v) => v.length >= 32, {
    message: "kamida 32 belgi bo'lsin (AES-256 kaliti shundan olinadi)",
  }),

  AMB_WEB_ORIGIN: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Bo'sh satrlarni butunlay olib tashlaymiz, keyin tekshiramiz.
 * Xato bo'lsa — tushunarli, o'zbekcha xabar bilan to'xtaymiz.
 */
export function validateEnv(raw: Record<string, unknown>): Env {
  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => typeof v !== "string" || v.trim() !== ""),
  );

  const result = envSchema.safeParse(cleaned);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  · ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Muhit sozlamalari noto'g'ri:\n${lines.join("\n")}\n\n.env faylni tekshiring.`);
  }

  if (!result.data.AI_GATEWAY_API_KEY && !result.data.VERCEL_OIDC_TOKEN) {
    throw new Error(
      "Model kaliti yo'q. AI_GATEWAY_API_KEY ni .env ga qo'shing yoki Vercel loyihasini ulang (`vercel link` + `vercel env pull`).\n" +
        "Soxta (mock) model ataylab qo'yilmagan: u mijozga ilovasi ishlayotgandek ko'rsatadi.",
    );
  }

  return result.data;
}
