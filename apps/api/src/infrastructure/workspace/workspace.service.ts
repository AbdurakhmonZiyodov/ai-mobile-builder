import fs from "node:fs/promises";
import path from "node:path";
import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { APP_CONFIG, type AppConfig } from "../../config/configuration.js";
import { LocalWorkspace } from "./drivers/local.driver.js";
import type { WorkspaceDriver } from "./drivers/driver.interface.js";

/**
 * Loyiha ID'sidan workspace drayverini beradi.
 *
 * MVP'da `LocalWorkspace` — shu mashinaning fayl tizimi. Ishlab chiqarishda
 * bu yerda Firecracker microVM yoki Docker + gVisor drayveri turadi:
 * begona kod bizning infrastrukturada ishlaydi, oddiy Docker yetarli emas.
 * Interfeys o'zgarmaydi, shuning uchun almashtirish bitta faylga tegadi.
 */
@Injectable()
export class WorkspaceService {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  /**
   * Drayverni qaytaradi (papka mavjudligini tekshirmaydi).
   * Faqat o'qish uchun kerak bo'lganda ishlatiladi.
   */
  get(projectId: string): WorkspaceDriver {
    this.assertSafeId(projectId);
    return new LocalWorkspace(path.join(this.config.workspaceRoot, projectId));
  }

  /** Papka yo'q bo'lsa shablondan yaratadi va birinchi commit qiladi. */
  async ensure(projectId: string): Promise<WorkspaceDriver> {
    const ws = this.get(projectId);
    if (!(await ws.exists())) {
      await fs.mkdir(this.config.workspaceRoot, { recursive: true });
      await ws.create(this.config.templateDir);
    }
    return ws;
  }

  async destroy(projectId: string): Promise<void> {
    await this.get(projectId).destroy();
  }

  /**
   * Loyiha ID fayl yo'lining bir qismiga aylanadi, shuning uchun uni
   * hech qachon tekshirmasdan ishlatmaymiz.
   */
  private assertSafeId(id: string): void {
    if (!/^[a-zA-Z0-9_-]{3,64}$/.test(id)) {
      throw new BadRequestException({ messageUz: "Loyiha manzili noto'g'ri." });
    }
  }
}
