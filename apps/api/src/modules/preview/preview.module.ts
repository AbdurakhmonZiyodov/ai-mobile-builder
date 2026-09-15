import { Module } from "@nestjs/common";
import { WorkspaceModule } from "../../infrastructure/workspace/workspace.module.js";
import { ProjectsModule } from "../projects/projects.module.js";
import { PreviewController } from "./preview.controller.js";
import { PreviewService } from "./preview.service.js";
import { PreviewStaticController } from "./preview-static.controller.js";

@Module({
  imports: [WorkspaceModule, ProjectsModule],
  controllers: [PreviewController, PreviewStaticController],
  providers: [PreviewService],
})
export class PreviewModule {}
