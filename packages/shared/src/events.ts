import { z } from "zod";
import { taskKindSchema } from "./changes.js";

/**
 * Agent tsikli SSE orqali bitta oqimda uzatiladi.
 * Web faqat shu hodisalarni biladi — boshqa yo'l yo'q.
 */

export const agentEventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("run.started"), runId: z.string(), at: z.number() }),

  /** Tasniflash natijasi — mijoz "bu hisoblanadimi?" degan javobni darhol ko'radi. */
  z.object({
    type: z.literal("run.classified"),
    kind: taskKindSchema,
    billable: z.boolean(),
    summaryUz: z.string(),
  }),

  /** Noaniq so'rov — agent savol beradi, hisoblanmaydi. */
  z.object({
    type: z.literal("clarify"),
    questionUz: z.string(),
    options: z.array(z.string()).default([]),
  }),

  z.object({ type: z.literal("plan"), steps: z.array(z.string()) }),

  /** Model matn oqimi. */
  z.object({ type: z.literal("text"), delta: z.string() }),

  z.object({
    type: z.literal("tool.started"),
    tool: z.string(),
    argsPreview: z.string(),
  }),
  z.object({
    type: z.literal("tool.finished"),
    tool: z.string(),
    ok: z.boolean(),
    summary: z.string(),
  }),

  /** Nuqtali diff — to'liq qayta yozish taqiqlangan (spek 17.3). */
  z.object({
    type: z.literal("file.changed"),
    path: z.string(),
    action: z.enum(["create", "edit", "delete"]),
    added: z.number(),
    removed: z.number(),
  }),

  z.object({
    type: z.literal("verify.started"),
    step: z.enum(["typecheck", "lint", "bundle"]),
  }),
  z.object({
    type: z.literal("verify.finished"),
    step: z.enum(["typecheck", "lint", "bundle"]),
    ok: z.boolean(),
    /** Qadam bajarilmadi (kichik tahrirda bundle, yoki vosita topilmadi).
     *  "O'tdi" deb ko'rsatish yolg'on bo'lardi — mahsulotning butun va'dasi ishonchda. */
    skipped: z.boolean().default(false),
    errors: z.array(z.string()).default([]),
  }),

  /** Xato tuzatish urinishi — bepul, ko'pi bilan 3 marta (spek 8.3). */
  z.object({
    type: z.literal("repair.attempt"),
    attempt: z.number(),
    max: z.number(),
    errorPreview: z.string(),
  }),
  /** Halol to'xtash. */
  z.object({
    type: z.literal("repair.gaveUp"),
    messageUz: z.string(),
    lastGoodVersionId: z.string().nullable(),
  }),

  z.object({
    type: z.literal("preview.ready"),
    path: z.enum(["web", "expo_go", "eas_go", "dev_client"]),
    url: z.string().nullable(),
    reasonUz: z.string(),
  }),

  /** Hisob — har run oxirida, doim. */
  z.object({
    type: z.literal("charge"),
    units: z.number(),
    reasonUz: z.string(),
    remaining: z.number(),
    balanceLabelUz: z.string(),
  }),

  z.object({
    type: z.literal("run.finished"),
    runId: z.string(),
    ok: z.boolean(),
    versionId: z.string().nullable(),
    durationMs: z.number(),
  }),

  z.object({ type: z.literal("error"), messageUz: z.string(), detail: z.string().optional() }),
]);

export type AgentEvent = z.infer<typeof agentEventSchema>;
