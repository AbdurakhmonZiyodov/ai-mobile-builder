import type { HttpClient } from "../core/http-client";
import type {
  GetPricingResponse,
  ListBlocksResponse,
  ListDomainsResponse,
  ListPreviewPathsResponse,
  ListSdksResponse,
} from "../types/catalog.types";

const BASE = "/catalog";

/**
 * Katalog — o'zgarmaydigan ma'lumot.
 *
 * Nega API orqali olinadi, frontend'ga qo'shib qo'yilmaydi: narx va
 * bloklar ro'yxati mahsulot qarori. Ikkala tomonda nusxa bo'lsa, ular
 * albatta bir-biridan uzoqlashadi va mijoz narx sahifasida bir raqamni,
 * hisob-kitobda boshqasini ko'radi.
 *
 * Ilgari `pricing()` javobi `unknown` edi — ya'ni uni ishlatgan har bir
 * komponent `as` bilan o'ziga moslardi. Endi shakl `catalog.types.ts` da.
 */
export class CatalogEndpoint {
  constructor(private readonly http: HttpClient) {}

  /** Bloklar — preview belgisi bilan (mijoz tanlashdan oldin ko'radi). */
  blocks(): Promise<ListBlocksResponse> {
    return this.http.get<ListBlocksResponse>(`${BASE}/blocks`);
  }

  domains(): Promise<ListDomainsResponse> {
    return this.http.get<ListDomainsResponse>(`${BASE}/domains`);
  }

  /** Narx + uchinchi tomon xarajatlari + FAQ, bitta javobda. */
  pricing(): Promise<GetPricingResponse> {
    return this.http.get<GetPricingResponse>(`${BASE}/pricing`);
  }

  previewPaths(): Promise<ListPreviewPathsResponse> {
    return this.http.get<ListPreviewPathsResponse>(`${BASE}/preview-paths`);
  }

  sdks(): Promise<ListSdksResponse> {
    return this.http.get<ListSdksResponse>(`${BASE}/sdks`);
  }
}
