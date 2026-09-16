import type { SseClient } from "../core/sse-client";
import type { AgentEvent } from "@amb/contracts";
import type {
  AgentEventHandler,
  StreamAgentOptions,
  StreamAgentRequest,
} from "../types/agent.types";

const BASE = "/chat";

/**
 * Agent tsikli — yagona SSE oqimi.
 *
 * Nega u ham endpoint class'i, «shunchaki funksiya» emas: chaqiruv joyi
 * uchun bu boshqa endpointlardan farq qilmasligi kerak —
 * `api.agent.stream(...)` va `api.preview.buildWeb(...)` bir xil joydan
 * keladi. Transport farqi (SSE vs JSON) `core/` ichida yashiringan.
 *
 * Nega `SseClient` inject qilinadi: hodisa turini (`AgentEvent`) AYNAN
 * shu class biladi. Transport uni bilmaydi va bilmasligi kerak —
 * shartnoma resurs qatlamida.
 */
export class AgentEndpoint {
  constructor(private readonly sse: SseClient) {}

  /**
   * Xabar yuboradi va javobni hodisama-hodisa qaytaradi.
   *
   * Nega SSE: bitta o'zgarish 2 soniyadan 3 daqiqagacha davom etadi.
   * Mijoz shu vaqt davomida nima bo'layotganini ko'rishi kerak, aks holda
   * ilova qotib qoldi deb o'ylaydi.
   *
   * Nega `Promise<void>` qaytadi, hodisalar ro'yxati emas: natija oqim
   * tugagach emas, KELGAN PAYTDA kerak. Ro'yxat qaytarsak, butun ma'no
   * yo'qolardi.
   */
  stream(
    request: StreamAgentRequest,
    onEvent: AgentEventHandler,
    options?: StreamAgentOptions,
  ): Promise<void> {
    return this.sse.stream<AgentEvent>(BASE, request, onEvent, options);
  }

  /**
   * Birinchi qurish oqimi.
   *
   * Loyiha yaratilgandan keyin BIR MARTA chaqiriladi: mijozning
   * promptidan reja tuziladi va ilova quriladi.
   *
   * Nega alohida: bu yerda yuboriladigan xabar yo'q — prompt allaqachon
   * saqlangan. Va bu hisoblanmaydi, mijoz hali tarifga o'tmagan.
   */
  buildFirst(
    projectId: string,
    onEvent: AgentEventHandler,
    options?: StreamAgentOptions,
  ): Promise<void> {
    return this.sse.stream<AgentEvent>(`${BASE}/build/${projectId}`, {}, onEvent, options);
  }
}
