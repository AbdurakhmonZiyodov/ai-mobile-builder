export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `${path}: ${res.status}`);
  return data;
}

/**
 * Agent oqimi — SSE.
 * `fetch` + ReadableStream ishlatamiz, chunki POST kerak (EventSource faqat GET).
 */
export async function streamChat(
  body: { projectId: string; text: string; designMode: boolean },
  onEvent: (e: Record<string, unknown>) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    ...(signal ? { signal } : {}),
  });
  if (!res.body) throw new Error("Oqim ochilmadi");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      try {
        onEvent(JSON.parse(dataLine.slice(5).trim()) as Record<string, unknown>);
      } catch {
        // to'liq bo'lmagan kadr — keyingi o'qishda yig'iladi
      }
    }
  }
}
