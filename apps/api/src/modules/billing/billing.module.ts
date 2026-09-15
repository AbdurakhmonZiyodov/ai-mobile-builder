import { Module } from "@nestjs/common";
import { BillingRepository } from "./billing.repository.js";
import { BillingService } from "./billing.service.js";

@Module({
  providers: [BillingService, BillingRepository],
  exports: [BillingService],
})
export class BillingModule {}
