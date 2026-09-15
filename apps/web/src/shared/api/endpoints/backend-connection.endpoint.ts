import type { HttpClient } from "../core/http-client";
import type {
  BackendStatusResponse,
  BurnServiceRoleResponse,
  ConnectBackendRequest,
  ConnectBackendResponse,
} from "../types/backend-connection.types";

const BASE = "/backend";

/**
 * Mijozning o'z backend'ini ulash.
 *
 * Nega kalitlar mijozniki: agar biz Supabase loyihasini o'zimiz yaratsak,
 * mijoz ketganda ma'lumoti bizda qoladi. Bu lock-in va mahsulot
 * va'damizga zid.
 */
export class BackendConnectionEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Kalitlarni ulash.
   *
   * `projectId` so'rov TANASIDA ham bor (zod sxemasi shuni talab qiladi),
   * yo'l esa shundan yasaladi. Nega ikkalasi: server tanani mustaqil
   * tekshiradi va ikkisi mos kelmasa, xatoni yo'ldan emas, sxemadan
   * topadi — bu yaxshiroq xato xabari beradi.
   */
  connect(request: ConnectBackendRequest): Promise<ConnectBackendResponse> {
    return this.http.post<ConnectBackendResponse>(`${BASE}/${request.projectId}`, request);
  }

  /** Ulanish holati. Kalitlar QAYTARILMAYDI — faqat «bormi yo'qmi». */
  status(projectId: string): Promise<BackendStatusResponse> {
    return this.http.get<BackendStatusResponse>(`${BASE}/${projectId}`);
  }

  /**
   * `service_role` kalitini o'chirish.
   *
   * Nega alohida amal va nega majburiy: bu kalit RLS'ni butunlay chetlab
   * o'tadi — u bilan butun bazani o'qish va o'chirish mumkin. Faqat sxema
   * yaratish paytida kerak; ish tugagach saqlab turish keraksiz xavf.
   */
  burnServiceRole(projectId: string): Promise<BurnServiceRoleResponse> {
    return this.http.post<BurnServiceRoleResponse>(`${BASE}/${projectId}/burn-service-role`);
  }
}
