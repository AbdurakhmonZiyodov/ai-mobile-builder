import { API_URL } from "./core/config";
import { HttpClient } from "./core/http-client";
import { SseClient } from "./core/sse-client";
import {
  AgentEndpoint,
  BackendConnectionEndpoint,
  CatalogEndpoint,
  HandoffEndpoint,
  PreviewEndpoint,
  ProjectsEndpoint,
  ReviewEndpoint,
} from "./endpoints";

/**
 * API mijozi — barcha resurslarning yagona kirish nuqtasi.
 *
 * Nega bitta class endpointlarni birlashtiradi: komponent qaysi
 * transport ishlatilishini ham, manzil qanday yig'ilishini ham bilmasligi
 * kerak. U `api.projects.create(...)` yozadi, xolos. Endpoint qo'shilsa,
 * o'zgarish shu faylning bitta qatorida tugaydi.
 *
 * Nega transport shu yerda yaratiladi: bu qatlamning yagona «montaj
 * joyi». `HttpClient` va `SseClient` bir xil `baseUrl` ni oladi va uni
 * hech bir endpoint takrorlamaydi.
 *
 * Nega `baseUrl` konstruktor argumenti: testda yoki Storybook'da boshqa
 * serverga yo'naltirish uchun — `new ApiClient("http://localhost:4100")`.
 * Standart qiymat esa ilovada hech kimni ortiqcha sozlashga majburlamaydi.
 */
export class ApiClient {
  readonly projects: ProjectsEndpoint;
  readonly preview: PreviewEndpoint;
  readonly review: ReviewEndpoint;
  readonly catalog: CatalogEndpoint;
  readonly backend: BackendConnectionEndpoint;
  readonly handoff: HandoffEndpoint;
  readonly agent: AgentEndpoint;

  constructor(baseUrl: string = API_URL) {
    const http = new HttpClient(baseUrl);
    const sse = new SseClient(baseUrl);

    this.projects = new ProjectsEndpoint(http);
    this.preview = new PreviewEndpoint(http);
    this.review = new ReviewEndpoint(http);
    this.catalog = new CatalogEndpoint(http);
    this.backend = new BackendConnectionEndpoint(http);
    this.handoff = new HandoffEndpoint(http);
    this.agent = new AgentEndpoint(sse);
  }
}

/**
 * Ilova ishlatadigan yagona nusxa.
 *
 * Nega singleton: `ApiClient` da holat yo'q — faqat manzil. Har
 * komponentda yangisini yasash foydasiz ish bo'lardi. Boshqa manzil
 * kerak bo'lganda `new ApiClient(url)` doim ochiq turadi.
 */
export const api = new ApiClient();
