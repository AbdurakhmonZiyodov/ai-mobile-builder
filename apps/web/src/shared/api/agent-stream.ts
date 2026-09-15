import { API_URL } from "./client";
import type { AgentEvent } from "@amb/contracts";

/**
 * Agent oqimi — SSE.
 *
 * Nega `EventSource` emas: u faqat GET qiladi, bizga esa POST kerak
 * (xabar matni va loyiha ID'si tanada ketadi). Shuning uchun `fetch` +
 * `ReadableStream` bilan o'zimiz o'qiymiz.
 *
 * SSE kadri: `event: <tur>\ndata: <json>\n\n`. Kadrlar chegarasi bo'sh
 * qator, shuning uchun to'liq bo'lmagan qism buferda qoladi.
 */
export async function streamAgent(
  body: { projectId: string; text: string; designMode: boolean },
  onEvent: (event: AgentEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    ...(signal ? { signal } : {}),
  });

  if (!res.ok || !res.body) {
    throw new Error("Oqim ochilmadi. Internet aloqasini tekshiring.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    // Oxirgi bo'lak to'liq bo'lmasligi mumkin — keyingi o'qishda tugaydi.
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const line = frame.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      try {
        onEvent(JSON.parse(line.slice(5).trim()) as AgentEvent);
      } catch {
        // Buzilgan kadr oqimni to'xtatmaydi.
      }
    }
  }
}
