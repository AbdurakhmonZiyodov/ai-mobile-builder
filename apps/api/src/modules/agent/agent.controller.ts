import { ConflictException, Controller, Logger, Param, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { sendMessageInput, type AgentEvent, type SendMessageInput } from "@amb/contracts";
import { ID } from "@amb/core-rules";
import { LlmError } from "../../infrastructure/llm/llm-error.js";
import { ZodBody } from "../../common/decorators/zod-body.decorator.js";
import { BillingService } from "../billing/billing.service.js";
import { ProjectsRepository } from "../projects/projects.repository.js";
import { ProjectsService } from "../projects/projects.service.js";
import { AgentService } from "./agent.service.js";
import type { RunAgentResult } from "./agent.types.js";

@Controller("chat")
export class AgentController {
  private readonly logger = new Logger(AgentController.name);

  constructor(
    private readonly agent: AgentService,
    private readonly projects: ProjectsService,
    private readonly repository: ProjectsRepository,
    private readonly billing: BillingService,
  ) {}

  /**
   * POST /chat — agent tsikli, SSE oqimi.
   *
   * Nega SSE, oddiy JSON emas: bitta o'zgarish 2 soniyadan 3 daqiqagacha
   * davom etadi. Mijoz shu vaqt davomida nima bo'layotganini ko'rishi kerak
   * — «Kodni o'qiyapman», «Tahrirlayapman», «Tekshiryapman». Aks holda u
   * ilova qotib qoldi deb o'ylaydi.
   *
   * Nega WebSocket emas: oqim bir tomonlama va qisqa muddatli. WebSocket
   * qo'shimcha holat va qayta ulanish mantiqini keltirardi, foyda bermay.
   *
   * Nega `@Sse` dekoratori emas: bizga tugagach bazaga yozish kerak, bu esa
   * Observable ichida noqulay. `Response` ni to'g'ridan-to'g'ri boshqarish
   * oqim va yozishni bitta joyda ushlab turadi.
   */
  @Post()
  async chat(@ZodBody(sendMessageInput) dto: SendMessageInput, @Res() res: Response): Promise<void> {
    const project = await this.projects.findOrFail(dto.projectId);
    const history = await this.repository.listMessages(project.id);

    await this.repository.addMessage(ID.message(), project.id, "user", dto.text);

    this.openStream(res);

    const emit = (event: AgentEvent): void => {
      res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
    };

    try {
      const result = await this.agent.run(
        {
          projectId: project.id,
          prompt: dto.text,
          designMode: dto.designMode,
          history: history.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
            createdAt: m.createdAt.getTime(),
          })),
        },
        emit,
      );

      await this.persist(project.id, dto.text, result);
    } catch (err) {
      this.logger.error("Agent tsikli yiqildi", err instanceof Error ? err.stack : String(err));

      // Model xatosi aniq sababga ega — mijozga "kutilmagan xatolik"
      // deyish uni o'z so'rovida xato qildim deb o'ylashga majbur qiladi.
      emit({
        type: "error",
        messageUz:
          err instanceof LlmError
            ? err.messageUz
            : "Kutilmagan xatolik yuz berdi. O'zgarish saqlanmadi va hisoblanmadi.",
      });
    } finally {
      res.end();
    }
  }

  /**
   * POST /chat/build/:id — birinchi qurish, SSE oqimi.
   *
   * Nega alohida endpoint: bu yerda tasniflash yo'q. Mijoz g'oyasini
   * aytdi va ilova qurilishi kerak — so'rov turini aniqlashning hojati
   * yo'q. Avval reja tuziladi va mijozga ko'rsatiladi.
   *
   * Nega bir marta: takroran chaqirilsa mijoz ishini yo'qotardi.
   * Loyihada versiya bo'lsa, 409 qaytadi.
   */
  @Post("build/:id")
  async build(@Param("id") id: string, @Res() res: Response): Promise<void> {
    const project = await this.projects.findOrFail(id);

    if (!(await this.projects.isUnbuilt(project.id))) {
      throw new ConflictException({
        messageUz: "Bu ilova allaqachon qurilgan. O'zgartirish uchun suhbatdan foydalaning.",
      });
    }

    this.openStream(res);
    const emit = (event: AgentEvent): void => {
      res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
    };

    try {
      const result = await this.agent.runFirstBuild(project.id, emit);
      await this.persist(project.id, "birinchi qurish", result);
    } catch (err) {
      this.logger.error("Birinchi qurish yiqildi", err instanceof Error ? err.stack : String(err));
      emit({
        type: "error",
        messageUz:
          err instanceof LlmError
            ? err.messageUz
            : "Ilovani qurib bo'lmadi. Bu hisoblanmadi — qayta urinib ko'ring.",
      });
    } finally {
      res.end();
    }
  }

  /** SSE sarlavhalari — ikkala oqim uchun bir xil. */
  private openStream(res: Response): void {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    // Nginx kabi proksilar SSE'ni buferlaydi va oqim to'xtab qoladi.
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
  }

  /**
   * Run natijasini saqlaydi.
   *
   * Nega oqim tugagach: mijoz natijani darhol ko'rishi kerak, baza yozuvi
   * uni kutib turmaydi. Va agar yozuv yiqilsa, mijoz baribir javobini oldi.
   */
  private async persist(projectId: string, prompt: string, result: RunAgentResult): Promise<void> {
    if (result.assistantText.trim()) {
      await this.repository.addMessage(ID.message(), projectId, "assistant", result.assistantText);
    }

    let versionId: string | null = null;
    if (result.gitSha) {
      versionId = ID.version();
      await this.repository.recordVersion({
        id: versionId,
        projectId,
        gitSha: result.gitSha,
        label: prompt.slice(0, 80),
        filesChanged: result.changedFiles.map((f) => ({
          path: f.path,
          added: f.added,
          removed: f.removed,
        })),
      });
    }

    await this.repository.recordRun({
      id: result.runId,
      projectId,
      kind: result.kind,
      prompt,
      verifyStatus: result.verify ? (result.verify.ok ? "passed" : "failed") : "skipped",
      repairAttempts: result.repairAttempts,
      chargedUnits: result.units,
      chargeReasonUz: result.chargeReasonUz,
      costCents: Math.round(result.costCents),
      durationMs: result.durationMs,
      versionId,
      ok: result.ok,
    });

    await this.billing.commit(projectId, result.units);
  }
}
