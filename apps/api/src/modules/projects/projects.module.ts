import { Module } from "@nestjs/common";
import { WorkspaceModule } from "../../infrastructure/workspace/workspace.module.js";
import { ProjectsController } from "./projects.controller.js";
import { ProjectsRepository } from "./projects.repository.js";
import { ProjectsService } from "./projects.service.js";

@Module({
  imports: [WorkspaceModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  /** Agent va preview modullariga kerak. */
  exports: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
