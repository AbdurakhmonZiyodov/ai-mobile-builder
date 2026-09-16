import { Injectable } from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";
import { DatabaseService } from "../../infrastructure/database/database.service.js";
import {
  messages,
  projects,
  runs,
  versions,
  type Message,
  type NewProject,
  type Project,
  type Run,
  type Version,
} from "../../infrastructure/database/schema/index.js";

/**
 * Loyiha bilan bog'liq barcha baza amallari.
 *
 * Servis SQL bilmaydi, repository biznes qoidasini bilmaydi. Bu chegara
 * ikki narsani beradi: qoidani bazasiz testlash va SQL'ni bitta joyda
 * optimallashtirish.
 */
@Injectable()
export class ProjectsRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(values: NewProject): Promise<Project> {
    const [row] = await this.database.db.insert(projects).values(values).returning();
    return row!;
  }

  async findById(id: string): Promise<Project | null> {
    const [row] = await this.database.db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return row ?? null;
  }

  async listByUser(userId: string, limit = 50): Promise<Project[]> {
    return this.database.db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt))
      .limit(limit);
  }

  async updatePreview(id: string, previewPath: string, previewUrl: string | null): Promise<void> {
    await this.database.db
      .update(projects)
      .set({ previewPath, previewUrl, updatedAt: new Date() })
      .where(eq(projects.id, id));
  }

  async rename(id: string, name: string): Promise<void> {
    await this.database.db
      .update(projects)
      .set({ name, updatedAt: new Date() })
      .where(eq(projects.id, id));
  }

  async updateStatus(id: string, status: Project["status"]): Promise<void> {
    await this.database.db
      .update(projects)
      .set({ status, updatedAt: new Date() })
      .where(eq(projects.id, id));
  }

  // --- Suhbat -----------------------------------------------------------

  async addMessage(id: string, projectId: string, role: Message["role"], content: string): Promise<void> {
    await this.database.db.insert(messages).values({ id, projectId, role, content });
  }

  async listMessages(projectId: string, limit = 100): Promise<Message[]> {
    return this.database.db
      .select()
      .from(messages)
      .where(eq(messages.projectId, projectId))
      .orderBy(messages.createdAt)
      .limit(limit);
  }

  // --- Run va versiya ---------------------------------------------------

  async recordRun(values: typeof runs.$inferInsert): Promise<void> {
    await this.database.db.insert(runs).values(values);
  }

  async listRuns(projectId: string): Promise<Run[]> {
    return this.database.db.select().from(runs).where(eq(runs.projectId, projectId));
  }

  async recordVersion(values: typeof versions.$inferInsert): Promise<void> {
    await this.database.db.insert(versions).values(values);
  }

  async listVersions(projectId: string, limit = 50): Promise<Version[]> {
    return this.database.db
      .select()
      .from(versions)
      .where(eq(versions.projectId, projectId))
      .orderBy(desc(versions.createdAt))
      .limit(limit);
  }

  async findVersion(projectId: string, versionId: string): Promise<Version | null> {
    const [row] = await this.database.db
      .select()
      .from(versions)
      .where(and(eq(versions.projectId, projectId), eq(versions.id, versionId)))
      .limit(1);
    return row ?? null;
  }
}
