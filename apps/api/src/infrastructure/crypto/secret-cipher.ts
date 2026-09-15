import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG, type AppConfig } from "../../config/configuration.js";

/**
 * Mijoz kalitlarini shifrlash — AES-256-GCM.
 *
 * Nega GCM: u shifrlash bilan birga butunlikni ham tekshiradi. Agar bazadagi
 * qiymat o'zgartirilsa, ochishda xato chiqadi — sokin buzilish bo'lmaydi.
 *
 * Nega servis (funksiya emas): master kalit sozlamalardan keladi, testda uni
 * almashtirish kerak bo'ladi.
 *
 * MVP'da master kalit `.env` da. Ishlab chiqarishda KMS — kalit diskka
 * umuman tushmasligi kerak.
 */
@Injectable()
export class SecretCipher {
  private readonly key: Buffer;

  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    // Sozlama tekshiruvi kamida 32 belgi bo'lishini kafolatlaydi.
    this.key = createHash("sha256").update(config.secretKey).digest();
  }

  encrypt(plain: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
  }

  decrypt(payload: string): string {
    const parts = payload.split(".");
    if (parts.length !== 4 || parts[0] !== "v1") {
      throw new Error("Shifr formati noto'g'ri.");
    }
    const iv = Buffer.from(parts[1]!, "base64url");
    const tag = Buffer.from(parts[2]!, "base64url");
    const data = Buffer.from(parts[3]!, "base64url");

    const decipher = createDecipheriv("aes-256-gcm", this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  }
}
