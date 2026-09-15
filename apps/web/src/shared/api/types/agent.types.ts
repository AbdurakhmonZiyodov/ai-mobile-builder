import type { AgentEvent, SendMessageInput } from "@amb/contracts";

/**
 * Agent oqimining turlari.
 *
 * `AgentEvent` — `@amb/contracts` dagi discriminated union. U bu yerda
 * qayta yozilmaydi: hodisalar ro'yxati agent tsiklining o'zi bilan birga
 * o'sadi va nusxa bo'lsa, yangi hodisa web'da jimgina yo'qolardi.
 */

export type StreamAgentRequest = SendMessageInput;

/** Har hodisa kelganda chaqiriladi — oqim tugashini kutmasdan. */
export type AgentEventHandler = (event: AgentEvent) => void;

export interface StreamAgentOptions {
  /** Mijoz sahifani tark etsa, oqim uzilishi kerak. */
  signal?: AbortSignal;
}
