import type { ChatMessage } from "@amb/ai";
import { buildProjectMap, type WorkspaceDriver } from "@amb/workspace";

/**
 * Kontekst byudjeti — spek 8.2.
 * Butun repo HECH QACHON yuborilmaydi. Chegaralar qattiq.
 */
export const BUDGET = {
  designAndProject: 1_500,
  map: 1_000,
  conversation: 1_500,
  files: 15_000,
  toolResponse: 4_000,
} as const;

/** Taxminiy token hisobi. Aniq tokenizer o'rniga — chegara uchun yetarli. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.6);
}

export function clampToTokens(text: string, maxTokens: number): string {
  const maxChars = Math.floor(maxTokens * 3.6);
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n… (chegaraga sig'magani kesildi)`;
}

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

/**
 * Oxirgi 5 xabar to'liq, qolgani bitta xulosa qatorida (spek 8.2).
 */
export function buildConversation(messages: StoredMessage[]): ChatMessage[] {
  const recent = messages.slice(-5);
  const older = messages.slice(0, -5);

  const out: ChatMessage[] = [];
  if (older.length > 0) {
    const summary = older
      .map((m) => `${m.role === "user" ? "Mijoz" : "Agent"}: ${firstLine(m.content)}`)
      .join("\n");
    out.push({
      role: "system",
      content: clampToTokens(`## Oldingi suhbat xulosasi\n${summary}`, BUDGET.conversation),
    });
  }
  for (const m of recent) {
    out.push({ role: m.role, content: clampToTokens(m.content, 2_000) });
  }
  return out;
}

function firstLine(s: string): string {
  const line = s.split("\n").find((l) => l.trim()) ?? "";
  return line.slice(0, 160);
}

export interface ProjectDocs {
  designMd: string;
  projectMd: string;
  mapMd: string;
}

/** DESIGN.md va PROJECT.md — har biri 60 qatordan oshmasin (spek 8.2). */
export async function loadProjectDocs(ws: WorkspaceDriver): Promise<ProjectDocs> {
  const designMd = clampToTokens(await readOr(ws, "DESIGN.md", ""), BUDGET.designAndProject / 2);
  const projectMd = clampToTokens(await readOr(ws, "PROJECT.md", ""), BUDGET.designAndProject / 2);
  const mapMd = clampToTokens(await buildProjectMap(ws), BUDGET.map);
  return { designMd, projectMd, mapMd };
}

async function readOr(ws: WorkspaceDriver, path: string, fallback: string): Promise<string> {
  try {
    return await ws.read(path);
  } catch {
    return fallback;
  }
}

/**
 * So'rovga tegishli 3–8 faylni qidiruv orqali topib, kontekstga qo'shish.
 * Model tool bilan ham o'qiy oladi, lekin birinchi qadamni tejash tezlik beradi.
 */
export async function findRelevantFiles(
  ws: WorkspaceDriver,
  prompt: string,
  max = 6,
): Promise<Array<{ path: string; content: string }>> {
  const terms = keywords(prompt);
  const scores = new Map<string, number>();

  for (const term of terms) {
    const hits = await ws.search(term, { max: 30 });
    for (const h of hits) scores.set(h.path, (scores.get(h.path) ?? 0) + 1);
  }

  const ranked = [...scores.entries()]
    .filter(([p]) => /\.(tsx?|jsx?)$/.test(p))
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([p]) => p);

  const out: Array<{ path: string; content: string }> = [];
  let budget = BUDGET.files;
  for (const p of ranked) {
    const content = await readOr(ws, p, "");
    const cost = estimateTokens(content);
    if (cost > budget) continue;
    budget -= cost;
    out.push({ path: p, content });
  }
  return out;
}

const STOPWORDS = new Set([
  "va","bilan","uchun","bir","bu","men","sen","qil","qilib","kerak","yoki","ham","the","and","for",
  "ilova","ekran","tugma","qo","sh","lekin","emas","boshqa",
]);

function keywords(prompt: string): string[] {
  return [
    ...new Set(
      prompt
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
    ),
  ].slice(0, 5);
}
