import type { HttpClient } from "../core/http-client";
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  GetProjectResponse,
  ListProjectFilesResponse,
  ListProjectMessagesResponse,
  ListProjectsResponse,
  ListProjectVersionsResponse,
  ProjectUsageResponse,
  ReadProjectFileRequest,
  ReadProjectFileResponse,
  RevertProjectRequest,
  RevertProjectResponse,
} from "../types/project.types";

/** Resurs ildizi bir joyda — yo'l o'zgarsa, o'zgarish shu qatorda tugaydi. */
const BASE = "/projects";

/**
 * Loyiha endpointlari.
 *
 * Nega class, oddiy obyekt emas: `HttpClient` konstruktorga beriladi va
 * har metod uni qayta import qilmaydi. Bu testda soxta transport berish
 * imkonini beradi va endpointlarni global holatdan ajratadi.
 *
 * Nega javob turlari metod ichida yozilmaydi: ilgari
 * `apiGet<{ path: string; content: string }>(...)` shaklida edi va shu
 * shaklni komponentda qayta ishlatish uchun uni QO'LDA ko'chirishdan
 * boshqa yo'l yo'q edi. Endi har javob nomga ega va import qilinadi.
 */
export class ProjectsEndpoint {
  constructor(private readonly http: HttpClient) {}

  /** Mijozning loyihalari, har birida qoldiq bilan. */
  list(): Promise<ListProjectsResponse> {
    return this.http.get<ListProjectsResponse>(BASE);
  }

  get(projectId: string): Promise<GetProjectResponse> {
    return this.http.get<GetProjectResponse>(`${BASE}/${projectId}`);
  }

  /**
   * Yangi loyiha — mahsulotning kirish nuqtasi.
   *
   * Domen aniqlash, blok tanlash va workspace yaratish bitta so'rovda
   * bo'lgani uchun javob ham katta: mijoz darhol nima tanlanganini va
   * NEGA tanlanganini ko'radi.
   */
  create(request: CreateProjectRequest): Promise<CreateProjectResponse> {
    return this.http.post<CreateProjectResponse>(BASE, request);
  }

  /** Fayl daraxti — faqat ro'yxat, kontentsiz. */
  files(projectId: string): Promise<ListProjectFilesResponse> {
    return this.http.get<ListProjectFilesResponse>(`${BASE}/${projectId}/files`);
  }

  /**
   * Bitta faylning kodi.
   *
   * Yo'l so'rov qatorida ketadi va uni `HttpClient` kodlaydi — avval bu
   * har chaqiruvda qo'lda `encodeURIComponent` bilan qilinardi.
   */
  file(request: ReadProjectFileRequest): Promise<ReadProjectFileResponse> {
    return this.http.get<ReadProjectFileResponse>(`${BASE}/${request.projectId}/file`, {
      query: { path: request.path },
    });
  }

  /** Suhbat tarixi — sahifa qayta ochilganda tiklash uchun. */
  messages(projectId: string): Promise<ListProjectMessagesResponse> {
    return this.http.get<ListProjectMessagesResponse>(`${BASE}/${projectId}/messages`);
  }

  versions(projectId: string): Promise<ListProjectVersionsResponse> {
    return this.http.get<ListProjectVersionsResponse>(`${BASE}/${projectId}/versions`);
  }

  /**
   * Oldingi versiyaga qaytarish.
   *
   * Nega ikki maydonli so'rov turi: `revert(id, versionId)` da ikkala
   * argument ham `string` va ularni almashtirib yuborish TS tekshiruvidan
   * jimgina o'tib ketardi. Nomlangan maydonlar buni imkonsiz qiladi.
   */
  revert(request: RevertProjectRequest): Promise<RevertProjectResponse> {
    return this.http.post<RevertProjectResponse>(`${BASE}/${request.projectId}/revert`, {
      versionId: request.versionId,
    });
  }

  /** AI xarajati — bu mijozga emas, bizga kerak (marja nazorati). */
  usage(projectId: string): Promise<ProjectUsageResponse> {
    return this.http.get<ProjectUsageResponse>(`${BASE}/${projectId}/usage`);
  }
}
