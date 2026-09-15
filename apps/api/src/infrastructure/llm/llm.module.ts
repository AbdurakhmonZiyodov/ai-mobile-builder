import { Global, Module } from "@nestjs/common";
import { LlmService } from "./llm.service.js";

/** Global: agent, tasniflagich va tuzatish tsikli — hammasiga kerak. */
@Global()
@Module({
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
