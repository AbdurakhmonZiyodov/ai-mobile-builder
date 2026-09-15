import { Injectable, Logger } from "@nestjs/common";
import {
  EXPO_GO_APP_STORE_SDK,
  PREVIEW_PATHS,
  decidePreviewPath,
  type PreviewDecision,
} from "@amb/core-rules";
import { requiresDevClient } from "@amb/blocks";
import { WorkspaceService } from "../../infrastructure/workspace/workspace.service.js";
import { ProjectsRepository } from "../projects/projects.repository.js";
import { ProjectsService } from "../projects/projects.service.js";

export interface WebPreviewResult {
  ok: boolean;
  url: string | null;
  durationMs: number;
  messageUz: string;
  logTail?: string;
}

/** Veb preview chiqishi shu papkaga yig'iladi. */
const WEB_OUTPUT_DIR = ".amb-web";

@Injectable()
export class PreviewService {
  private readonly logger = new Logger(PreviewService.name);

  constructor(
    private readonly projects: ProjectsService,
    private readonly repository: ProjectsRepository,
    private readonly workspaces: WorkspaceService,
  ) {}

  /**
   * Qaysi preview yo'li va NIMA UCHUN.
   *
   * Qaror `@amb/core-rules` dagi sof funksiyada — u testlanadi va
   * frontend ham xuddi shu mantiqni ko'rsata oladi.
   */
  async decide(projectId: string, hasAppleAccount: boolean) {
    const project = await this.projects.findOrFail(projectId);

    const decision: PreviewDecision = decidePreviewPath({
      requiresDevClient: requiresDevClient(project.blocks),
      projectSdk: project.sdk,
      expoGoSdk: EXPO_GO_APP_STORE_SDK,
      hasAppleAccount,
    });

    return {
      ...decision,
      info: PREVIEW_PATHS[decision.path],
      fallbackInfo: PREVIEW_PATHS[decision.fallback],
      allPaths: Object.values(PREVIEW_PATHS),
    };
  }

  /**
   * Veb preview — birinchi yo'l, darhol.
   *
   * Nega u har doim birinchi: mijoz 90 soniyadan ko'p kutsa, yarmi ketadi.
   * Veb preview native modullarsiz ishlaydi va hech kimga — na Expo'ga,
   * na Apple'ga — bog'liq emas.
   */
  async buildWeb(projectId: string): Promise<WebPreviewResult> {
    const project = await this.projects.findOrFail(projectId);
    const ws = this.workspaces.get(project.id);
    const started = Date.now();

    // `exec` dan keyin `--` majburiy, aks holda npm bayroqlarni o'zi yeb qo'yadi.
    const result = await ws.exec(
      "npm",
      ["exec", "--", "expo", "export", "--platform", "web", "--output-dir", WEB_OUTPUT_DIR],
      { timeoutMs: 300_000 },
    );

    const durationMs = Date.now() - started;

    if (result.code !== 0) {
      this.logger.warn(`Veb preview yig'ilmadi: ${project.id}`);
      return {
        ok: false,
        url: null,
        durationMs,
        messageUz: "Veb preview yig'ilmadi. Bu o'zgarish hisoblanmadi.",
        logTail: result.stderr.slice(-4000),
      };
    }

    const url = `/preview/${project.id}/static/index.html`;
    await this.repository.updatePreview(project.id, project.previewPath, url);

    return {
      ok: true,
      url,
      durationMs,
      messageUz: `Ilovangiz tayyor — ${Math.round(durationMs / 1000)} soniyada yig'ildi.`,
    };
  }
}
