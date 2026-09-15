import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { BLOCKS, checkPaymentChoice, requiresDevClient, type BlockId } from "@amb/blocks";
import {
  DEFAULT_SDK,
  EXPO_GO_APP_STORE_SDK,
  ID,
  PLANS,
  decidePreviewPath,
  type PreviewDecision,
} from "@amb/core-rules";
import { getDomainPack, guessDomainPack } from "@amb/domains";
import { WorkspaceService } from "../../infrastructure/workspace/workspace.service.js";
import type { Project, Version } from "../../infrastructure/database/schema/index.js";
import { ProjectsRepository } from "./projects.repository.js";
import { seedProjectDocs } from "./project-docs.builder.js";
import { buildProjectName } from "./project-name.builder.js";
import type { CreateProjectDto } from "./dto/create-project.dto.js";
import { toProjectSummary, type ProjectSummaryDto } from "./dto/project-summary.dto.js";

export interface CreatedProject {
  projectId: string;
  domainPack: string | null;
  blocks: string[];
  preview: PreviewDecision;
  /** Mijoz blok tanlashdan OLDIN preview turini ko'rishi kerak. */
  blockInfo: Array<{ id: string; nameUz: string; preview: string }>;
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly repository: ProjectsRepository,
    private readonly workspaces: WorkspaceService,
  ) {}

  /**
   * Yangi loyiha.
   *
   * Mijozdan HECH QANDAY texnik savol so'ralmaydi: u faqat biznesini
   * bir-ikki jumlada aytadi. Domen, bloklar, SDK va preview yo'li shu
   * jumladan kelib chiqadi va har birining sababi tushuntiriladi.
   */
  async create(userId: string, dto: CreateProjectDto): Promise<CreatedProject> {
    const packId = dto.domainPack ?? guessDomainPack(dto.prompt);
    const pack = getDomainPack(packId);

    const blocks = dto.blocks.length > 0 ? dto.blocks : (pack?.recommendedBlocks ?? ["navigation"]);
    const sells = pack?.sells ?? "physical_or_service";

    // Apple 3.1.1 qorovuli: raqamli kontent tashqi to'lov bilan sotilsa,
    // ilova ALBATTA rad etiladi. Buni boshida to'xtatgan arzonroq.
    const payment = checkPaymentChoice(blocks, sells);
    if (!payment.ok) {
      throw new UnprocessableEntityException({ messageUz: payment.messageUz, clause: "3.1.1" });
    }

    // Mijoz nom bermagan bo'lsa, aniqlangan sohadan yasaymiz.
    const name = dto.name ?? buildProjectName(pack);

    const projectId = ID.project();
    const sdk = dto.sdk ?? DEFAULT_SDK;
    const plan = PLANS.trial;

    const preview = decidePreviewPath({
      requiresDevClient: requiresDevClient(blocks),
      projectSdk: sdk,
      expoGoSdk: EXPO_GO_APP_STORE_SDK,
      hasAppleAccount: false,
    });

    await this.repository.create({
      id: projectId,
      userId,
      name,
      status: "draft",
      sdk,
      domainPack: packId ?? null,
      blocks,
      sells,
      plan: plan.id,
      includedChanges: plan.includedChanges,
      previewPath: preview.path,
    });

    await this.repository.addMessage(ID.message(), projectId, "user", dto.prompt);

    // Workspace shablondan yaratiladi va hujjatlar bilan birinchi commit qilinadi.
    const ws = await this.workspaces.ensure(projectId);
    await seedProjectDocs(ws, { name, prompt: dto.prompt, pack, blocks });
    await ws.commit("Loyiha hujjatlari");

    this.logger.log(`Loyiha yaratildi: ${projectId} (${packId ?? "domen aniqlanmadi"})`);

    return {
      projectId,
      domainPack: packId ?? null,
      blocks,
      preview,
      blockInfo: blocks.map((id) => {
        const block = BLOCKS[id as BlockId];
        return {
          id,
          nameUz: block?.nameUz ?? id,
          preview: block?.preview ?? "expo_go",
        };
      }),
    };
  }

  async findOrFail(projectId: string): Promise<Project> {
    const project = await this.repository.findById(projectId);
    if (!project) throw new NotFoundException({ messageUz: "Loyiha topilmadi." });
    return project;
  }

  async summary(projectId: string): Promise<ProjectSummaryDto> {
    return toProjectSummary(await this.findOrFail(projectId));
  }

  async list(userId: string): Promise<ProjectSummaryDto[]> {
    const rows = await this.repository.listByUser(userId);
    return rows.map(toProjectSummary);
  }

  /**
   * Oldingi versiyaga qaytarish.
   *
   * Nega kerak: agent xato qilishi mumkin va mijoz buni darhol qaytara
   * olishi kerak. Bu ishonchning asosi — «buzilsa, qaytaraman» degan bilim.
   */
  async revert(projectId: string, versionId: string): Promise<Version> {
    await this.findOrFail(projectId);
    const version = await this.repository.findVersion(projectId, versionId);
    if (!version) throw new NotFoundException({ messageUz: "Bunday versiya topilmadi." });

    await this.workspaces.get(projectId).revertTo(version.gitSha);
    return version;
  }
}
