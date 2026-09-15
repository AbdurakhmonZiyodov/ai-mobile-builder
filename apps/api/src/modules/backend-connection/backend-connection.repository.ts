import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DatabaseService } from "../../infrastructure/database/database.service.js";
import {
  backendConnections,
  type BackendConnection,
} from "../../infrastructure/database/schema/index.js";

@Injectable()
export class BackendConnectionRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByProject(projectId: string): Promise<BackendConnection | null> {
    const [row] = await this.database.db
      .select()
      .from(backendConnections)
      .where(eq(backendConnections.projectId, projectId))
      .limit(1);
    return row ?? null;
  }

  async upsert(values: typeof backendConnections.$inferInsert): Promise<void> {
    const existing = await this.findByProject(values.projectId);
    if (existing) {
      const { id: _id, projectId: _projectId, ...rest } = values;
      await this.database.db
        .update(backendConnections)
        .set(rest)
        .where(eq(backendConnections.projectId, values.projectId));
      return;
    }
    await this.database.db.insert(backendConnections).values(values);
  }

  /**
   * `service_role` kalitini butunlay o'chiradi.
   * Qaytarib bo'lmaydi — mijoz kerak bo'lsa yangisini kiritadi.
   */
  async burnServiceRole(projectId: string): Promise<void> {
    await this.database.db
      .update(backendConnections)
      .set({ serviceRoleKeyEnc: null, serviceRoleDeletedAt: new Date() })
      .where(eq(backendConnections.projectId, projectId));
  }
}
