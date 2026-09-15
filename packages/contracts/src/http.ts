import { z } from "zod";
import { previewPathSchema } from "@amb/core-rules";

/** HTTP shartnomalari — web va api o'rtasidagi yagona haqiqat manbai. */

export const createProjectInput = z.object({
  name: z.string().min(2).max(60),
  /** Mijozning birinchi jumlasi: "Sartaroshxona uchun bron ilovasi kerak" */
  prompt: z.string().min(3).max(4000),
  domainPack: z.string().optional(),
  blocks: z.array(z.string()).default([]),
  sdk: z.number().int().optional(),
  locale: z.enum(["uz", "ru", "en"]).default("uz"),
});
export type CreateProjectInput = z.infer<typeof createProjectInput>;

export const sendMessageInput = z.object({
  projectId: z.string(),
  text: z.string().min(1).max(8000),
  /** Design mode — kod yozilmaydi, hech qachon hisoblanmaydi. */
  designMode: z.boolean().default(false),
});
export type SendMessageInput = z.infer<typeof sendMessageInput>;

export const projectSummary = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["draft", "building", "ready", "failed"]),
  sdk: z.number(),
  domainPack: z.string().nullable(),
  blocks: z.array(z.string()),
  previewPath: previewPathSchema,
  previewUrl: z.string().nullable(),
  balance: z.object({
    included: z.number(),
    used: z.number(),
    extraPurchased: z.number(),
    extraUsed: z.number(),
  }),
  createdAt: z.string(),
});
export type ProjectSummary = z.infer<typeof projectSummary>;

export const fileNode = z.object({
  path: z.string(),
  type: z.enum(["file", "dir"]),
  size: z.number().optional(),
});
export type FileNode = z.infer<typeof fileNode>;

export const connectBackendInput = z.object({
  projectId: z.string(),
  provider: z.enum(["supabase", "firebase"]),
  /** anon kalit ilovaga tushadi; service_role FAQAT serverda, ishlatilgach o'chiriladi. */
  url: z.string().optional(),
  anonKey: z.string().optional(),
  serviceRoleKey: z.string().optional(),
  firebaseConfig: z.record(z.string(), z.string()).optional(),
});
export type ConnectBackendInput = z.infer<typeof connectBackendInput>;
