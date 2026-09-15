import { Module } from "@nestjs/common";
import { WorkspaceModule } from "../../infrastructure/workspace/workspace.module.js";
import { BillingModule } from "../billing/billing.module.js";
import { ProjectsModule } from "../projects/projects.module.js";
import { VerifyModule } from "../verify/verify.module.js";
import { AgentController } from "./agent.controller.js";
import { AgentService } from "./agent.service.js";
import { ClassifierService } from "./classifier.service.js";
import { ContextBuilderService } from "./context-builder.service.js";
import { RepairService } from "./repair.service.js";

@Module({
  imports: [WorkspaceModule, VerifyModule, BillingModule, ProjectsModule],
  controllers: [AgentController],
  providers: [AgentService, ClassifierService, ContextBuilderService, RepairService],
  exports: [AgentService],
})
export class AgentModule {}
