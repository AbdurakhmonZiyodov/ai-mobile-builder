import { Global, Module } from "@nestjs/common";
import { DatabaseService } from "./database.service.js";

/** Global: deyarli har modulga baza kerak. */
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
