import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/config.module.js";
import { CryptoModule } from "./infrastructure/crypto/crypto.module.js";
import { DatabaseModule } from "./infrastructure/database/database.module.js";
import { LlmModule } from "./infrastructure/llm/llm.module.js";
import { AgentModule } from "./modules/agent/agent.module.js";
import { BackendConnectionModule } from "./modules/backend-connection/backend-connection.module.js";
import { BillingModule } from "./modules/billing/billing.module.js";
import { CatalogModule } from "./modules/catalog/catalog.module.js";
import { HandoffModule } from "./modules/handoff/handoff.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { PreviewModule } from "./modules/preview/preview.module.js";
import { ProjectsModule } from "./modules/projects/projects.module.js";
import { ReviewModule } from "./modules/review/review.module.js";

/**
 * Ildiz moduli.
 *
 * Tartib qatlamlarni ko'rsatadi:
 *   config -> infrastructure -> modules
 *
 * Bog'liqlik faqat pastga yo'naladi. Modul infratuzilmani ishlatadi,
 * infratuzilma esa modul haqida hech narsa bilmaydi. Teskarisi bo'lsa,
 * baza almashtirish butun biznes mantiqqa tegib ketardi.
 */
@Module({
  imports: [
    AppConfigModule,

    // Infratuzilma — global, chunki deyarli hamma joyda kerak
    DatabaseModule,
    CryptoModule,
    LlmModule,

    // Biznes modullari
    HealthModule,
    CatalogModule,
    ProjectsModule,
    BillingModule,
    AgentModule,
    PreviewModule,
    ReviewModule,
    BackendConnectionModule,
    HandoffModule,
  ],
})
export class AppModule {}
