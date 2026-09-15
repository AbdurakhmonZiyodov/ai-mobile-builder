import { Controller, Get, Inject } from "@nestjs/common";
import { APP_CONFIG, type AppConfig } from "../../config/configuration.js";
import { DEFAULT_SDK, EXPO_GO_APP_STORE_SDK } from "@amb/core-rules";

@Controller("health")
export class HealthController {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  /**
   * GET /health — server holati.
   *
   * Nega model ID'lari ham qaytadi: sozlama xatosini topishning eng tez
   * yo'li. «Nega javob sekin?» degan savolga «kuchli model tanlangan»
   * javobi shu yerdan ko'rinadi.
   *
   * Kalitning O'ZI hech qachon qaytarilmaydi — faqat «sozlanganmi».
   */
  @Get()
  health() {
    return {
      ok: true,
      models: this.config.models,
      gatewayConfigured: Boolean(this.config.gatewayApiKey),
      defaultSdk: DEFAULT_SDK,
      expoGoSdk: EXPO_GO_APP_STORE_SDK,
      workspaceRoot: this.config.workspaceRoot,
      templateDir: this.config.templateDir,
    };
  }
}
