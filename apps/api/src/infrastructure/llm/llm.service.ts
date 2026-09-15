import { Inject, Injectable, Logger } from "@nestjs/common";
import { APP_CONFIG, type AppConfig } from "../../config/configuration.js";
import { GatewayProvider } from "./providers/gateway.provider.js";
import { classifyLlmError } from "./llm-error.js";
import type { GenerateOptions, GenerateResult, ModelTier } from "./llm.types.js";

/**
 * Model qatlami — butun tizim faqat shu servisni biladi.
 *
 * Nega abstraksiya: provayder almashsa (Gateway -> to'g'ridan-to'g'ri
 * Anthropic, yoki boshqa model), o'zgarish shu faylda tugaydi. Agent,
 * tasniflagich va tuzatish tsikli tegilmaydi.
 *
 * Soxta (mock) provayder ATAYLAB yo'q. U kalitsiz ham «ishlayapti»
 * taassuroti beradi va eng yomon nosozlikka yo'l ochadi: mijoz ilovasi
 * tayyor deb o'ylaydi, aslida hech narsa yaratilmagan.
 */
@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly provider: GatewayProvider;

  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {
    this.provider = new GatewayProvider(config.models);
    this.logger.log(
      `Modellar: arzon=${config.models.cheap} · standart=${config.models.standard} · kuchli=${config.models.strong}`,
    );
  }

  /**
   * Har chaqiruv `LlmError` bilan yiqiladi — xom provayder xatosi
   * yuqoriga chiqmaydi. Shunda agent tsikli sababni biladi va mijozga
   * to'g'ri xabar beradi.
   */
  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    try {
      return await this.provider.generate(opts);
    } catch (err) {
      const classified = classifyLlmError(err);
      this.logger.error(
        `Model xatosi (${classified.kind}, tier=${opts.tier}): ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      throw classified;
    }
  }

  modelIdFor(tier: ModelTier): string {
    return this.config.models[tier];
  }
}
