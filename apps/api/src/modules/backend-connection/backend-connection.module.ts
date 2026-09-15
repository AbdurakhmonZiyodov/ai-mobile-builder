import { Module } from "@nestjs/common";
import { ProjectsModule } from "../projects/projects.module.js";
import { BackendConnectionController } from "./backend-connection.controller.js";
import { BackendConnectionRepository } from "./backend-connection.repository.js";
import { BackendConnectionService } from "./backend-connection.service.js";

@Module({
  imports: [ProjectsModule],
  controllers: [BackendConnectionController],
  providers: [BackendConnectionService, BackendConnectionRepository],
})
export class BackendConnectionModule {}
