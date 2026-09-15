import { Injectable } from "@nestjs/common";
import { WorkspaceService } from "../../infrastructure/workspace/workspace.service.js";
import { ProjectsService } from "../projects/projects.service.js";
import { buildArchitectureMd, buildHandoffMd, buildReadmeMd } from "./handoff.templates.js";

export interface HandoffResult {
  ok: boolean;
  /** Shu run'da YOZILGAN fayllar. */
  generated: string[];
  /** Loyihada allaqachon bor va paketning bir qismi bo'lgan fayllar. */
  included: string[];
  gitSha: string | null;
  messageUz: string;
}

/**
 * Dasturchiga topshirish paketi.
 *
 * Maqsad — kod berish emas, biznes egasiga dasturchi bilan gaplashish
 * uchun TIL berish. U endi «menga ilova kerak» demaydi, «mana kod, mana
 * hujjat, mana qolgan ishlar» deydi. Freelancer narxni aniq ayta oladi.
 *
 * Bu «obuna tugasa loyiha qulflanadi» degan bozor shikoyatiga javobimiz:
 * chiqish yo'li har doim ochiq va hujjatlashtirilgan.
 */
@Injectable()
export class HandoffService {
  constructor(
    private readonly projects: ProjectsService,
    private readonly workspaces: WorkspaceService,
  ) {}

  async generate(projectId: string): Promise<HandoffResult> {
    const project = await this.projects.findOrFail(projectId);
    const ws = this.workspaces.get(project.id);

    const tree = await ws.tree();
    const screens = tree
      .filter((f) => f.path.startsWith("app/") && /\.(tsx|jsx)$/.test(f.path))
      .map((f) => f.path);

    await ws.write("README.md", buildReadmeMd(project));
    await ws.write("ARCHITECTURE.md", buildArchitectureMd(project, screens));
    await ws.write("HANDOFF.md", buildHandoffMd(project));

    const gitSha = await ws.commit("Dasturchiga topshirish paketi");

    return {
      ok: true,
      // Faqat shu yerda yozilganlar. Avval ro'yxatga `.env.example` ham
      // kiritilgan edi — u shablondan keladi, bu run uni yozmaydi.
      generated: ["README.md", "ARCHITECTURE.md", "HANDOFF.md"],
      included: [".env.example", "SDK.md"],
      gitSha,
      messageUz:
        "Topshirish paketi tayyor. Endi dasturchiga «menga ilova kerak» emas, «mana kod, mana hujjat, mana qolgan ishlar» deb ayta olasiz.",
    };
  }
}
