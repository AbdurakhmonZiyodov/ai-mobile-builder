import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ID } from "@amb/core-rules";
import { SecretCipher } from "../../infrastructure/crypto/secret-cipher.js";
import { ProjectsService } from "../projects/projects.service.js";
import { BackendConnectionRepository } from "./backend-connection.repository.js";
import type { BackendStatusDto, ConnectBackendDto } from "./dto/connect-backend.dto.js";

export interface ConnectResult {
  ok: boolean;
  provider: string;
  messageUz: string;
  warningsUz: string[];
}

/**
 * Mijozning o'z backend'ini ulash.
 *
 * Uchta qat'iy qoida:
 *
 * 1. Kalitlar MIJOZNIKI. Biz Supabase loyihasini o'zimiz yaratmaymiz —
 *    aks holda mijoz ketganda ma'lumoti bizda qoladi. Bu lock-in va
 *    «kod va ma'lumot sizniki» va'damizga zid.
 *
 * 2. `service_role` RLS'ni butunlay chetlab o'tadi. U hech qachon
 *    generatsiya qilingan kodga tushmaydi va sxema yaratilgach o'chiriladi.
 *
 * 3. Ilovaga faqat `anon` kalit ketadi.
 */
@Injectable()
export class BackendConnectionService {
  private readonly logger = new Logger(BackendConnectionService.name);

  constructor(
    private readonly projects: ProjectsService,
    private readonly repository: BackendConnectionRepository,
    private readonly cipher: SecretCipher,
  ) {}

  async connect(projectId: string, dto: ConnectBackendDto): Promise<ConnectResult> {
    const project = await this.projects.findOrFail(projectId);

    if (dto.provider === "supabase" && (!dto.url || !dto.anonKey)) {
      throw new BadRequestException({
        messageUz: "Supabase uchun loyiha URL'i va anon kalit kerak.",
      });
    }

    await this.repository.upsert({
      id: ID.project().replace("prj", "bcn"),
      projectId: project.id,
      provider: dto.provider,
      url: dto.url ?? null,
      anonKeyEnc: dto.anonKey ? this.cipher.encrypt(dto.anonKey) : null,
      serviceRoleKeyEnc: dto.serviceRoleKey ? this.cipher.encrypt(dto.serviceRoleKey) : null,
      firebaseConfigEnc: dto.firebaseConfig
        ? this.cipher.encrypt(JSON.stringify(dto.firebaseConfig))
        : null,
    });

    this.logger.log(`Backend ulandi: ${project.id} (${dto.provider})`);

    return {
      ok: true,
      provider: dto.provider,
      messageUz:
        "Ulandi. Kalitlaringiz shifrlangan holda saqlandi. service_role kaliti sxema yaratilgach o'chiriladi va hech qachon ilova kodiga tushmaydi.",
      warningsUz:
        dto.provider === "firebase"
          ? [
              "Firebase qo'llab-quvvatlanadi, lekin standart emas: undan chiqish og'ir. Supabase Postgres bo'lgani uchun ma'lumotingizni istalgan payt oddiy SQL dump bilan ko'chira olasiz.",
            ]
          : [],
    };
  }

  async status(projectId: string): Promise<BackendStatusDto> {
    const row = await this.repository.findByProject(projectId);
    if (!row) return { connected: false };

    // Kalitlarning o'zi HECH QACHON qaytarilmaydi.
    return {
      connected: true,
      provider: row.provider,
      url: row.url,
      hasAnonKey: Boolean(row.anonKeyEnc),
      serviceRoleActive: Boolean(row.serviceRoleKeyEnc),
      serviceRoleDeletedAt: row.serviceRoleDeletedAt,
    };
  }

  async burnServiceRole(projectId: string): Promise<{ ok: boolean; messageUz: string }> {
    await this.projects.findOrFail(projectId);
    await this.repository.burnServiceRole(projectId);
    this.logger.log(`service_role o'chirildi: ${projectId}`);
    return { ok: true, messageUz: "service_role kaliti o'chirildi." };
  }
}
