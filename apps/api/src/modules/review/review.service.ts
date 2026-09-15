import { Injectable } from "@nestjs/common";
import { getDomainPack } from "@amb/domains";
import { WorkspaceService } from "../../infrastructure/workspace/workspace.service.js";
import { ProjectsService } from "../projects/projects.service.js";
import { ALL_RULES } from "./rules/index.js";
import type { CheckerFile, CheckerInput, Finding, ReviewReport, Severity } from "./review.types.js";

/** Tekshiriladigan fayllarning eng ko'p soni — katta loyihada ham tez ishlasin. */
const MAX_FILES = 300;

/** Har blokerning o'tish ehtimoliga ta'siri. */
const BLOCKER_WEIGHT = 0.35;
const WARNING_WEIGHT = 0.08;

/**
 * Review Checker.
 *
 * Bu ixtiyoriy vosita emas — kafolatning SHARTI. «Apple rad qilsa, bepul
 * tuzatamiz» deb va'da berish uchun birinchi urinishda o'tish darajasi
 * kamida 50% bo'lishi kerak. 70% maqsad qilingan.
 *
 * Har qoida sof funksiya (`rules/` papkasida), shuning uchun yangi rad
 * etish holati uchragach, faqat bitta fayl qo'shiladi.
 */
@Injectable()
export class ReviewService {
  constructor(
    private readonly projects: ProjectsService,
    private readonly workspaces: WorkspaceService,
  ) {}

  async check(projectId: string): Promise<ReviewReport> {
    const project = await this.projects.findOrFail(projectId);
    const ws = this.workspaces.get(project.id);

    const files = await this.collectFiles(ws);
    const appConfig = await this.readAppConfig(ws);
    const pack = getDomainPack(project.domainPack);

    return this.runRules({
      files,
      appConfig,
      blocks: project.blocks,
      sells: project.sells === "digital" ? "digital" : "physical_or_service",
      minScreens: pack?.minScreens ?? 5,
    });
  }

  /** Sof qism — testda workspace'siz chaqiriladi. */
  runRules(input: CheckerInput): ReviewReport {
    const findings = ALL_RULES.flatMap((rule) => rule(input));

    const blockers = findings.filter((f) => f.severity === "blocker").length;
    const warnings = findings.filter((f) => f.severity === "warning").length;

    return {
      ok: blockers === 0,
      findings: findings.sort((a, b) => weight(b.severity) - weight(a.severity)),
      passLikelihood: Math.max(0, 1 - blockers * BLOCKER_WEIGHT - warnings * WARNING_WEIGHT),
    };
  }

  private async collectFiles(ws: {
    tree: () => Promise<Array<{ path: string; type: string }>>;
    read: (p: string) => Promise<string>;
  }): Promise<CheckerFile[]> {
    const entries = (await ws.tree()).filter(
      (e) => e.type === "file" && /\.(tsx?|jsx?|json)$/.test(e.path),
    );

    const files: CheckerFile[] = [];
    for (const entry of entries.slice(0, MAX_FILES)) {
      try {
        files.push({ path: entry.path, content: await ws.read(entry.path) });
      } catch {
        // O'qib bo'lmagan fayl tekshiruvni to'xtatmaydi.
      }
    }
    return files;
  }

  private async readAppConfig(ws: { read: (p: string) => Promise<string> }): Promise<Record<string, unknown>> {
    try {
      return JSON.parse(await ws.read("app.json")) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
}

function weight(severity: Severity): number {
  return severity === "blocker" ? 3 : severity === "warning" ? 2 : 1;
}

export type { Finding, ReviewReport };
