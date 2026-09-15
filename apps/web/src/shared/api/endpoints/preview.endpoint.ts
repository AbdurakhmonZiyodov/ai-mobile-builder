import type { HttpClient } from "../core/http-client";
import type {
  BuildWebPreviewResponse,
  DecidePreviewRequest,
  DecidePreviewResponse,
} from "../types/preview.types";

const BASE = "/preview";

/**
 * Preview endpointlari.
 *
 * Mijoz «nega telefonimda ochilmayapti?» deb so'ramasligi kerak —
 * shuning uchun bu resursning har javobida sabab (`reasonUz`) bor va u
 * ixtiyoriy emas.
 */
export class PreviewEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Qaysi yo'l va nima uchun.
   *
   * `hasAppleAccount` bayrog'i so'rov qatorida `apple=1` bo'lib ketadi.
   * Nega `false` da umuman yuborilmaydi: backend `apple === "1"` deb
   * tekshiradi, ya'ni `apple=0` ham «yo'q» degani — bo'sh qatorni
   * yubormaslik URL'ni toza saqlaydi.
   */
  decide(request: DecidePreviewRequest): Promise<DecidePreviewResponse> {
    return this.http.get<DecidePreviewResponse>(`${BASE}/${request.projectId}`, {
      query: { apple: request.hasAppleAccount ? 1 : undefined },
    });
  }

  /**
   * Veb preview yig'ish.
   *
   * Nega POST: yig'ish resurs sarflaydi va fayl tizimini o'zgartiradi.
   * GET bo'lsa, brauzer uni oldindan yuklab, har ochilishda qayta
   * yig'ishga majbur qilardi.
   */
  buildWeb(projectId: string): Promise<BuildWebPreviewResponse> {
    return this.http.post<BuildWebPreviewResponse>(`${BASE}/${projectId}/web`);
  }
}
