import path from "node:path";
import fs from "node:fs/promises";
import { LocalWorkspace } from "./local-driver.js";
import type { WorkspaceDriver } from "./types.js";

/**
 * Workspace manager — loyiha ID'sidan drayver beradi.
 * MVP'da LocalWorkspace; keyin Docker/Firecracker drayveri shu yerdan ulanadi.
 */
export class WorkspaceManager {
  constructor(
    private readonly rootDir: string,
    private readonly templateDir: string,
  ) {}

  get(projectId: string): WorkspaceDriver {
    assertSafeId(projectId);
    return new LocalWorkspace(path.join(this.rootDir, projectId));
  }

  async ensure(projectId: string): Promise<WorkspaceDriver> {
    const ws = this.get(projectId);
    if (!(await ws.exists())) {
      await fs.mkdir(this.rootDir, { recursive: true });
      await ws.create(this.templateDir);
    }
    return ws;
  }
}

function assertSafeId(id: string): void {
  if (!/^[a-zA-Z0-9_-]{3,64}$/.test(id)) {
    throw new Error(`Xavfsiz bo'lmagan loyiha ID: ${id}`);
  }
}
