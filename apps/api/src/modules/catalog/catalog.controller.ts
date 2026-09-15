import { Controller, Get } from "@nestjs/common";
import { ALL_BLOCKS } from "@amb/blocks";
import { ALL_DOMAIN_PACKS } from "@amb/domains";
import {
  ASSISTED_PUBLISH_PRICE,
  EXTRA_CHANGE_PRICE,
  PLANS,
  PREVIEW_PATHS,
  SDK_REGISTRY,
  THIRD_PARTY_COSTS,
} from "@amb/core-rules";
import { PRICING_FAQ_UZ } from "./pricing-faq.js";

/**
 * Katalog — o'zgarmaydigan ma'lumot.
 *
 * Nega API orqali beriladi, frontend'ga qo'shib qo'yilmaydi: narx va
 * bloklar ro'yxati mahsulot qarori, ikkala tomonda nusxa bo'lsa ular
 * albatta bir-biridan uzoqlashadi. Manba bitta — `@amb/core-rules`.
 */
@Controller("catalog")
export class CatalogController {
  /**
   * GET /catalog/blocks — bloklar, preview belgisi bilan.
   *
   * `preview` maydoni hal qiluvchi: mijoz blok TANLASHDAN OLDIN uning
   * telefonda darhol ochilishini yoki dev client kerakligini bilishi kerak.
   * Aks holda «ilovam telefonimda ochilmayapti» degan support oqimi boshlanadi.
   */
  @Get("blocks")
  blocks() {
    return { blocks: ALL_BLOCKS };
  }

  /**
   * GET /catalog/domains — domen paketlari.
   *
   * To'liq `evals` ro'yxati qaytarilmaydi — u ichki tekshiruv uchun va
   * hajmi katta. Mijozga faqat soni ko'rsatiladi: «12 ta tekshiruv».
   */
  @Get("domains")
  domains() {
    return {
      packs: ALL_DOMAIN_PACKS.map((pack) => ({
        id: pack.id,
        nameUz: pack.nameUz,
        descriptionUz: pack.descriptionUz,
        examplesUz: pack.examplesUz,
        recommendedBlocks: pack.recommendedBlocks,
        sells: pack.sells,
        minScreens: pack.minScreens,
        evalCount: pack.evals.length,
      })),
    };
  }

  /**
   * GET /catalog/pricing — narx va BARCHA xarajatlar.
   *
   * Uchinchi tomon xarajatlari (Apple $99/yil, Google $25) ataylab shu
   * javobda: mijozning birinchi savoli «$99 yana alohidami?» bo'ladi va
   * unga javob narx sahifasining o'zida bo'lishi kerak.
   */
  @Get("pricing")
  pricing() {
    return {
      plans: Object.values(PLANS),
      extraChange: EXTRA_CHANGE_PRICE,
      assistedPublish: ASSISTED_PUBLISH_PRICE,
      thirdPartyCosts: THIRD_PARTY_COSTS,
      faqUz: PRICING_FAQ_UZ,
    };
  }

  /** GET /catalog/preview-paths — to'rt yo'l va har birining cheklovi. */
  @Get("preview-paths")
  previewPaths() {
    return { paths: Object.values(PREVIEW_PATHS) };
  }

  /**
   * GET /catalog/sdks — qo'llab-quvvatlanadigan Expo SDK versiyalari.
   *
   * Bir vaqtda ko'pi bilan ikkita: ko'proq bo'lsa test yuki ko'tarilmaydi.
   */
  @Get("sdks")
  sdks() {
    return { sdks: SDK_REGISTRY };
  }
}
