import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { createProjectInput } from "@amb/contracts";
import { ZodBody } from "../../common/decorators/zod-body.decorator.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { WorkspaceService } from "../../infrastructure/workspace/workspace.service.js";
import { ProjectsRepository } from "./projects.repository.js";
import { ProjectsService } from "./projects.service.js";
import type { CreateProjectDto } from "./dto/create-project.dto.js";

@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly projects: ProjectsService,
    private readonly repository: ProjectsRepository,
    private readonly workspaces: WorkspaceService,
  ) {}

  /**
   * GET /projects — mijozning loyihalari.
   *
   * Nega qoldiq ham qaytadi: «Loyihalarim» ekranida har loyiha yonida
   * «qoldiq 4/10» ko'rinadi. Alohida so'rov qo'shsak, ro'yxat N marta
   * so'rov yuborardi.
   */
  @Get()
  async list(@CurrentUser() userId: string) {
    return { projects: await this.projects.list(userId) };
  }

  /**
   * POST /projects — yangi loyiha.
   *
   * Nega bitta so'rovda hammasi: mijoz bitta jumla yozadi va darhol
   * natijani ko'rishi kerak. Domen aniqlash, blok tanlash va workspace
   * yaratish uchun alohida qadamlar mijozni yo'qotadi.
   */
  @Post()
  async create(@CurrentUser() userId: string, @ZodBody(createProjectInput) dto: CreateProjectDto) {
    return this.projects.create(userId, dto);
  }

  /** GET /projects/:id — bitta loyiha holati va qoldig'i. */
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.projects.summary(id);
  }

  /**
   * GET /projects/:id/files — fayl daraxti.
   *
   * Nega faqat ro'yxat, kontentsiz: workspace'da yuzlab fayl bor va
   * ularning hammasini yuborish bir necha megabayt bo'lardi. Mijoz
   * kerakli faylni bosganda alohida so'rov ketadi.
   */
  @Get(":id/files")
  async files(@Param("id") id: string) {
    await this.projects.findOrFail(id);
    return { files: await this.workspaces.get(id).tree() };
  }

  /** GET /projects/:id/file?path=… — bitta faylning kodi. */
  @Get(":id/file")
  async file(@Param("id") id: string, @Query("path") path: string) {
    await this.projects.findOrFail(id);
    return { path, content: await this.workspaces.get(id).read(path) };
  }

  /** GET /projects/:id/messages — suhbat tarixi (sahifa qayta ochilganda). */
  @Get(":id/messages")
  async messages(@Param("id") id: string) {
    return { messages: await this.repository.listMessages(id) };
  }

  /**
   * GET /projects/:id/versions — versiya tarixi.
   *
   * Mijozga git SHA emas, o'zi yozgan so'rov matni ko'rsatiladi:
   * «Bron tugmasini yashil qil» — u shundan qaysi versiya ekanini biladi.
   */
  @Get(":id/versions")
  async versions(@Param("id") id: string) {
    return { versions: await this.repository.listVersions(id) };
  }

  /**
   * POST /projects/:id/revert — oldingi versiyaga qaytarish.
   *
   * Nega POST: bu holatni o'zgartiradigan amal. Undo tugmasi shunga ulanadi.
   */
  @Post(":id/revert")
  async revert(@Param("id") id: string, @Body("versionId") versionId: string) {
    const version = await this.projects.revert(id, versionId);
    return { ok: true, revertedToUz: version.label };
  }

  /**
   * GET /projects/:id/usage — AI xarajati va o'zgarish boshiga narx.
   *
   * Bu mijozga emas, BIZGA kerak: bitta o'zgarishning tannarxi $0,60 dan
   * oshsa, $5 lik narx marjani yo'qotadi. Metrika kodda o'lchanmasa,
   * buni faqat oy oxirida bilamiz.
   */
  @Get(":id/usage")
  async usage(@Param("id") id: string) {
    const project = await this.projects.findOrFail(id);
    const runs = await this.repository.listRuns(id);

    const totalCostCents = runs.reduce((sum, run) => sum + run.costCents, 0);
    const billed = runs.filter((run) => run.chargedUnits > 0);

    return {
      runs: runs.length,
      chargedUnits: billed.length,
      totalCostCents,
      avgCostPerChangeCents: billed.length > 0 ? totalCostCents / billed.length : 0,
      balance: {
        included: project.includedChanges,
        used: project.usedChanges,
        extraPurchased: project.extraPurchased,
        extraUsed: project.extraUsed,
      },
    };
  }
}
