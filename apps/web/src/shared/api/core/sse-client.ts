/** Oqimdan kelgan har hodisa shu funksiyaga uzatiladi. */
export type SseEventHandler<TEvent> = (event: TEvent) => void;

export interface SseStreamOptions {
  signal?: AbortSignal;
}

/** Kadr chegarasi — SSE spetsifikatsiyasi bo'yicha bo'sh qator. */
const FRAME_SEPARATOR = "\n\n";
const DATA_PREFIX = "data:";

/**
 * SSE oqimi.
 *
 * Nega `EventSource` emas: u faqat GET qiladi, bizga esa POST kerak —
 * xabar matni va loyiha ID'si tanada ketadi. Shuning uchun `fetch` +
 * `ReadableStream` bilan o'zimiz o'qiymiz.
 *
 * Nega `HttpClient` dan alohida class: oqimda «javob» degan tugallangan
 * narsa yo'q. `HttpClient` har so'rovni `res.json()` bilan tugatadi va
 * shu qaror uni oqim uchun yaroqsiz qiladi. Ikkalasini bitta class'ga
 * tiqish `stream` bayrog'i va ikki xil qaytish turini keltirardi.
 *
 * Nega generic: transport hodisaning turini bilmaydi va bilmasligi ham
 * kerak. `AgentEvent` ni `AgentEndpoint` biladi — shartnoma shu yerda,
 * transportda emas.
 */
export class SseClient {
  constructor(private readonly baseUrl: string) {}

  async stream<TEvent>(
    path: string,
    body: unknown,
    onEvent: SseEventHandler<TEvent>,
    options?: SseStreamOptions,
  ): Promise<void> {
    const init: RequestInit = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    };

    const res = await fetch(
      `${this.baseUrl}${path}`,
      options?.signal ? { ...init, signal: options.signal } : init,
    );

    if (!res.ok || !res.body) {
      throw new Error("Oqim ochilmadi. Internet aloqasini tekshiring.");
    }

    await this.read(res.body, onEvent);
  }

  /**
   * Oqimni kadrlarga bo'lib o'qiydi.
   *
   * Tarmoq paketi kadr chegarasida tugashi shart emas: oxirgi bo'lak
   * yarim bo'lishi mumkin, shuning uchun u buferda keyingi o'qishgacha
   * saqlanadi. Buni hisobga olmaslik — SSE'dagi eng keng tarqalgan xato.
   */
  private async read<TEvent>(
    stream: ReadableStream<Uint8Array>,
    onEvent: SseEventHandler<TEvent>,
  ): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split(FRAME_SEPARATOR);
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        const event = SseClient.parseFrame<TEvent>(frame);
        if (event !== null) onEvent(event);
      }
    }
  }

  /**
   * Kadr: `event: <tur>\ndata: <json>\n\n`.
   *
   * Nega buzilgan kadr oqimni to'xtatmaydi: mijoz uchun bitta yo'qolgan
   * hodisa — kichik yo'qotish, uzilgan oqim esa yakunni ham, hisobni ham
   * ko'rsatmaydi.
   */
  private static parseFrame<TEvent>(frame: string): TEvent | null {
    const line = frame.split("\n").find((l) => l.startsWith(DATA_PREFIX));
    if (!line) return null;

    try {
      return JSON.parse(line.slice(DATA_PREFIX.length).trim()) as TEvent;
    } catch {
      return null;
    }
  }
}
