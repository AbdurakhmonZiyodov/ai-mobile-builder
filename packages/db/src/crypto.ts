import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Mijoz kalitlarini shifrlash — spek 9.2, 16.2.
 * MVP'da AES-256-GCM + env'dagi master kalit. Ishlab chiqarishda KMS.
 * `service_role` kaliti hech qachon generatsiya qilingan kodga tushmasligi,
 * faqat serverda turishi va ishlatilgach o'chirilishi shart.
 */

function masterKey(): Buffer {
  const secret = process.env.AMB_SECRET_KEY;
  if (!secret || secret.length < 16) {
    throw new Error("AMB_SECRET_KEY sozlanmagan (kamida 16 belgi).");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", masterKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decryptSecret(payload: string): string {
  const parts = payload.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") throw new Error("Shifr formati noto'g'ri.");
  const iv = Buffer.from(parts[1]!, "base64url");
  const tag = Buffer.from(parts[2]!, "base64url");
  const data = Buffer.from(parts[3]!, "base64url");
  const decipher = createDecipheriv("aes-256-gcm", masterKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
