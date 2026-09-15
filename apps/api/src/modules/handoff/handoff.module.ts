import { Module } from "@nestjs/common";
import { WorkspaceModule } from "../../infrastructure/workspace/workspace.module.js";
import { ProjectsModule } from "../projects/projects.module.js";
import { HandoffController } from "./handoff.controller.js";
import { HandoffService } from "./handoff.service.js";

@Module({
  imports: [WorkspaceModule, ProjectsModule],
  controllers: [HandoffController],
  providers: [HandoffService],
})
export class HandoffModule {}
