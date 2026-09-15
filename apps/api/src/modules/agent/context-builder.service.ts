import { Injectable } from "@nestjs/common";
import type { ChatMessage } from "../../infrastructure/llm/llm.types.js";
import { buildProjectMap } from "../../infrastructure/workspace/project-map.builder.js";
import type { WorkspaceDriver } from "../../infrastructure/workspace/drivers/driver.interface.js";

/**
 * Kontekst byudjeti.
 *
 * Butun repo modelga HECH QACHON yuborilmaydi. Sabab ikkita: narx (har
 * token pul) va sifat (katta kontekstda model kerakli joyni yo'qotadi).
 *
 * Chegaralar qattiq — oshib ketsa kesiladi, ogohlantirish bilan.
 */
export const CONTEXT_BUDGET = {
  designAndProject: 1_500,
  map: 1_000,
  conversation: 1_500,
  files: 15_000,
  toolResponse: 4_000,
} as const;

/** Suhbat tarixidagi bitta xabar. */
export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface ProjectDocs {
  designMd: string;
  projectMd: string;
  mapMd: string;
}

export interface RelevantFile {
  path: string;
  content: string;
}

@Injectable()
export class ContextBuilderService {
  /**
   * `DESIGN.md`, `PROJECT.md` va avtomatik yasaladigan `MAP.md`.
   *
   * `MAP.md` har safar qaytadan quriladi: u ekranlar, marshrutlar va
   * 300 qatordan oshgan fayllar ro'yxatini beradi — model qayerga
   * qarashni shundan biladi.
   */
  async loadDocs(ws: WorkspaceDriver): Promise<ProjectDocs> {
    const half = CONTEXT_BUDGET.designAndProject / 2;
    return {
      designMd: clampToTokens(await readOr(ws, "DESIGN.md"), half),
      projectMd: clampToTokens(await readOr(ws, "PROJECT.md"), half),
      mapMd: clampToTokens(await buildProjectMap(ws), CONTEXT_BUDGET.map),
    };
  }

  /**
   * Oxirgi 5 xabar to'liq, qolgani bitta xulosa qatorida.
   *
   * Nega 5: mijoz odatda oxirgi bir-ikki xabarga ishora qiladi
   * («yo'q, uni emas, boshqasini»). Undan narigi tarix faqat mavzuni
   * eslatish uchun kerak.
   */
  buildConversation(messages: StoredMessage[]): ChatMessage[] {
    const recent = messages.slice(-5);
    const older = messages.slice(0, -5);
    const out: ChatMessage[] = [];

    if (older.length > 0) {
      const summary = older
        .map((m) => `${m.role === "user" ? "Mijoz" : "Agent"}: ${firstLine(m.content)}`)
        .join("\n");
      out.push({
        role: "system",
        content: clampToTokens(`## Oldingi suhbat xulosasi\n${summary}`, CONTEXT_BUDGET.conversation),
      });
    }

    for (const message of recent) {
      out.push({ role: message.role, content: clampToTokens(message.content, 2_000) });
    }
    return out;
  }

  /**
   * So'rovga tegishli 3–8 faylni qidiruv orqali topadi.
   *
   * Agent bu fayllarni tool bilan ham o'qiy oladi, lekin oldindan berish
   * bitta to'liq aylanani tejaydi — mijoz javobni tezroq ko'radi.
   */
  async findRelevantFiles(ws: WorkspaceDriver, prompt: string, max = 6): Promise<RelevantFile[]> {
    const scores = new Map<string, number>();

    for (const term of keywords(prompt)) {
      const hits = await ws.search(term, { max: 30 });
      for (const hit of hits) scores.set(hit.path, (scores.get(hit.path) ?? 0) + 1);
    }

    const ranked = [...scores.entries()]
      .filter(([p]) => /\.(tsx?|jsx?)$/.test(p))
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .map(([p]) => p);

    const out: RelevantFile[] = [];
    let budget = CONTEXT_BUDGET.files;

    for (const path of ranked) {
      const content = await readOr(ws, path);
      const cost = estimateTokens(content);
      if (cost > budget) continue;
      budget -= cost;
      out.push({ path, content });
    }
    return out;
  }
}

/**
 * Taxminiy token hisobi.
 * Aniq tokenizer o'rniga — chegara nazorati uchun bu yetarli va tezroq.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.6);
}

export function clampToTokens(text: string, maxTokens: number): string {
  const maxChars = Math.floor(maxTokens * 3.6);
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n… (chegaraga sig'magani kesildi)`;
}

async function readOr(ws: WorkspaceDriver, path: string): Promise<string> {
  try {
    return await ws.read(path);
  } catch {
    return "";
  }
}

function firstLine(text: string): string {
  return (text.split("\n").find((l) => l.trim()) ?? "").slice(0, 160);
}

/** Qidiruvga ma'no bermaydigan keng tarqalgan so'zlar. */
const STOPWORDS = new Set([
  "va", "bilan", "uchun", "bir", "bu", "men", "sen", "qil", "qilib", "kerak", "yoki", "ham",
  "the", "and", "for", "ilova", "ekran", "tugma", "lekin", "emas", "boshqa",
]);

function keywords(prompt: string): string[] {
  const words = prompt
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
  return [...new Set(words)].slice(0, 5);
}
