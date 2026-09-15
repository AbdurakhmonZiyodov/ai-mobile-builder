import { Module } from "@nestjs/common";
import { WorkspaceModule } from "../../infrastructure/workspace/workspace.module.js";
import { ProjectsModule } from "../projects/projects.module.js";
import { ReviewController } from "./review.controller.js";
import { ReviewService } from "./review.service.js";

@Module({
  imports: [WorkspaceModule, ProjectsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
