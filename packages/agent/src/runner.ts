import {
  ID,
  balanceLabelUz,
  decideCharge,
  isBillableKind,
  remaining,
  type AgentEvent,
  type Balance,
  type TaskKind,
} from "@amb/shared";
import { getModelProvider, type ChatMessage, type ModelTier } from "@amb/ai";
import { getDomainPack } from "@amb/domains";
import { runVerify, type VerifyReport } from "@amb/verify";
import type { EditResult, WorkspaceDriver } from "@amb/workspace";
import { ANSWER_SYSTEM, CLASSIFIER_SYSTEM, builderSystem, repairSystem } from "./prompts.js";
import { buildConversation, findRelevantFiles, loadProjectDocs, type StoredMessage } from "./context.js";
import { buildTools } from "./tools.js";

/** Ko'pi bilan 3 urinish, keyin halol to'xtash (spek 8.3). */
export const MAX_REPAIR_ATTEMPTS = 3;

export interface RunInput {
  ws: WorkspaceDriver;
  projectId: string;
  appName: string;
  sdk: number;
  blocks: readonly string[];
  domainPack: string | null;
  history: StoredMessage[];
  prompt: string;
  designMode: boolean;
  balance: Balance;
}

export interface RunOutcome {
  runId: string;
  kind: TaskKind;
  units: 0 | 1;
  chargeReasonUz: string;
  versionId: string | null;
  verify: VerifyReport | null;
  changedFiles: EditResult[];
  assistantText: string;
  costCents: number;
  durationMs: number;
  ok: boolean;
}

export type Emit = (e: AgentEvent) => void;

/**
 * Agent tsikli — spek 8.1.
 * Qabul -> tasniflash -> kontekst -> reja -> bajarish -> verify gate -> tuzatish -> versiya -> hisob.
 */
export async function runAgent(input: RunInput, emit: Emit): Promise<RunOutcome> {
  const runId = ID.run();
  const started = Date.now();
  const model = getModelProvider();
  let costCents = 0;

  emit({ type: "run.started", runId, at: started });

  // --- 1. Tasniflash (arzon model) ---
  const kind = input.designMode ? "design" : await classify(input.prompt, (c) => (costCents += c));
  emit({
    type: "run.classified",
    kind,
    billable: isBillableKind(kind),
    summaryUz: summaryFor(kind),
  });

  const changes: EditResult[] = [];
  const finish = (
    assistantText: string,
    verify: VerifyReport | null,
    versionId: string | null,
    ok = true,
  ): RunOutcome => {
    const charge = decideCharge({
      kind,
      verify: verify ? (verify.ok ? "passed" : "failed") : "skipped",
      producedDiff: changes.length > 0,
    });
    const nextBalance: Balance = {
      ...input.balance,
      used: input.balance.used + (charge.units === 1 ? 1 : 0),
    };
    emit({
      type: "charge",
      units: charge.units,
      reasonUz: charge.reasonUz,
      remaining: remaining(nextBalance),
      balanceLabelUz: balanceLabelUz(nextBalance),
    });
    const durationMs = Date.now() - started;
    emit({ type: "run.finished", runId, ok, versionId, durationMs });
    return {
      runId,
      kind,
      units: charge.units,
      chargeReasonUz: charge.reasonUz,
      versionId,
      verify,
      changedFiles: changes,
      assistantText,
      costCents,
      durationMs,
      ok,
    };
  };

  // --- 2. Bepul yo'llar: noaniq so'rov va savol ---
  if (kind === "unclear") {
    const q = await clarifyingQuestion(input.prompt, (c) => (costCents += c));
    emit({ type: "clarify", questionUz: q, options: [] });
    return finish(q, null, null);
  }

  if (kind === "question") {
    const answer = await answerQuestion(input, (c) => (costCents += c));
    emit({ type: "text", delta: answer });
    return finish(answer, null, null);
  }

  // --- 3. Balans tekshiruvi (hisoblanadigan ish uchun) ---
  if (remaining(input.balance) <= 0) {
    const msg =
      "Bu oy uchun o'zgarishlar tugadi. Qo'shimcha o'zgarish sotib olsangiz yoki tarifni oshirsangiz davom etamiz. Savollar va xato tuzatish baribir bepul.";
    emit({ type: "error", messageUz: msg });
    return finish(msg, null, null, false);
  }

  // --- 4. Kontekst yig'ish ---
  const docs = await loadProjectDocs(input.ws);
  const relevant = await findRelevantFiles(input.ws, input.prompt);
  const pack = getDomainPack(input.domainPack);

  const system = builderSystem({
    appName: input.appName,
    sdk: input.sdk,
    blocks: input.blocks,
    pack,
    designMd: docs.designMd,
    projectMd: docs.projectMd,
    mapMd: docs.mapMd,
  });

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    ...buildConversation(input.history),
  ];
  if (relevant.length > 0) {
    messages.push({
      role: "system",
      content:
        "## So'rovga tegishli fayllar\n" +
        relevant.map((f) => `### ${f.path}\n\`\`\`tsx\n${f.content}\n\`\`\``).join("\n\n"),
    });
  }
  messages.push({ role: "user", content: input.prompt });

  const tools = buildTools({
    ws: input.ws,
    // Design mode: kod tegilmaydi, faqat DESIGN.md.
    readOnly: kind === "design",
    changes,
    onFileChanged: (e) =>
      emit({ type: "file.changed", path: e.path, action: e.action, added: e.added, removed: e.removed }),
  });

  // --- 5. Bajarish tsikli ---
  const tier: ModelTier = kind === "large" ? "strong" : "standard";
  const result = await model.generate({
    tier,
    messages,
    tools,
    maxSteps: kind === "large" ? 24 : 12,
    onText: (delta) => emit({ type: "text", delta }),
    onToolStart: (name, args) => emit({ type: "tool.started", tool: name, argsPreview: args }),
    onToolEnd: (name, r) =>
      emit({ type: "tool.finished", tool: name, ok: r.ok, summary: r.summary ?? "" }),
  });
  costCents += result.costCents;

  if (changes.length === 0) {
    // Hech qachon "tuzatdim" deb aytib, diff bo'sh bo'lmasin (spek 8.3).
    emit({ type: "text", delta: "\n\nHech qanday fayl o'zgarmadi — bu o'zgarish hisoblanmaydi." });
    return finish(result.text, null, null);
  }

  // --- 6. Verify gate ---
  let verify = await verifyWithEvents(input.ws, kind, emit);

  // --- 7. Xato tuzatish tsikli: bepul, ko'pi bilan 3 urinish ---
  let repairTier: ModelTier = tier;
  let previousDigest = "";
  for (let attempt = 1; !verify.ok && attempt <= MAX_REPAIR_ATTEMPTS; attempt++) {
    emit({
      type: "repair.attempt",
      attempt,
      max: MAX_REPAIR_ATTEMPTS,
      errorPreview: verify.errorDigest.slice(0, 300),
    });

    // Bir xil xato ikki marta -> model arzondan kuchligiga (spek 8.3).
    if (verify.errorDigest === previousDigest && repairTier !== "strong") repairTier = "strong";
    previousDigest = verify.errorDigest;

    const repair = await model.generate({
      tier: repairTier,
      // Kontekst har urinishda toraytiriladi.
      messages: [
        { role: "system", content: repairSystem(attempt, MAX_REPAIR_ATTEMPTS) },
        { role: "system", content: docs.mapMd },
        { role: "user", content: `Quyidagi xatolarni tuzat:\n\n${verify.errorDigest}` },
      ],
      tools,
      maxSteps: 10,
      onText: (delta) => emit({ type: "text", delta }),
      onToolStart: (name, args) => emit({ type: "tool.started", tool: name, argsPreview: args }),
      onToolEnd: (name, r) =>
        emit({ type: "tool.finished", tool: name, ok: r.ok, summary: r.summary ?? "" }),
    });
    costCents += repair.costCents;

    verify = await verifyWithEvents(input.ws, kind, emit);
  }

  // --- 8. Halol to'xtash ---
  if (!verify.ok) {
    const lastGood = await lastGoodVersion(input.ws);
    emit({
      type: "repair.gaveUp",
      messageUz:
        "Bu xatoni hal qila olmadim. Oxirgi ishlagan versiyaga qaytaraymi? Bu o'zgarish hisoblanmadi.",
      lastGoodVersionId: lastGood,
    });
    return finish(result.text, verify, null, false);
  }

  // --- 9. Versiya ---
  const versionId = await input.ws.commit(`${kind}: ${input.prompt.slice(0, 72)}`);
  return finish(result.text, verify, versionId);
}

async function verifyWithEvents(
  ws: WorkspaceDriver,
  kind: TaskKind,
  emit: Emit,
): Promise<VerifyReport> {
  return runVerify(ws, {
    // Kichik tahrirda to'liq bundle ortiqcha 60 soniya.
    skipBundle: kind === "small_edit",
    onStepStart: (step) => emit({ type: "verify.started", step }),
    onStepEnd: (r) =>
      emit({
        type: "verify.finished",
        step: r.step,
        ok: r.ok,
        skipped: r.skipped ?? false,
        errors: r.errors,
      }),
  });
}

async function lastGoodVersion(ws: WorkspaceDriver): Promise<string | null> {
  const res = await ws.exec("git", ["rev-parse", "HEAD"]);
  return res.code === 0 ? res.stdout.trim() || null : null;
}

async function classify(prompt: string, addCost: (c: number) => void): Promise<TaskKind> {
  const model = getModelProvider();
  const res = await model.generate({
    tier: "cheap",
    messages: [
      { role: "system", content: CLASSIFIER_SYSTEM },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    maxSteps: 1,
  });
  addCost(res.costCents);

  const parsed = safeJson(res.text);
  const kind = typeof parsed?.kind === "string" ? parsed.kind : "unclear";
  const allowed: TaskKind[] = ["question", "unclear", "small_edit", "medium", "large"];
  return (allowed as string[]).includes(kind) ? (kind as TaskKind) : "unclear";
}

async function clarifyingQuestion(prompt: string, addCost: (c: number) => void): Promise<string> {
  const model = getModelProvider();
  const res = await model.generate({
    tier: "cheap",
    messages: [
      { role: "system", content: CLASSIFIER_SYSTEM },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    maxSteps: 1,
  });
  addCost(res.costCents);
  const parsed = safeJson(res.text);
  const q = parsed?.clarifyingQuestionUz;
  return typeof q === "string" && q.length > 3
    ? q
    : "Aniqroq aytsangiz: qaysi ekranda va nimani o'zgartiraylik?";
}

async function answerQuestion(input: RunInput, addCost: (c: number) => void): Promise<string> {
  const model = getModelProvider();
  const docs = await loadProjectDocs(input.ws);
  const res = await model.generate({
    tier: "standard",
    messages: [
      { role: "system", content: ANSWER_SYSTEM },
      { role: "system", content: docs.mapMd },
      ...buildConversation(input.history),
      { role: "user", content: input.prompt },
    ],
    maxSteps: 1,
  });
  addCost(res.costCents);
  return res.text;
}

function safeJson(text: string): Record<string, unknown> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function summaryFor(kind: TaskKind): string {
  switch (kind) {
    case "question":
      return "Savol — bepul javob beraman.";
    case "unclear":
      return "So'rov aniq emas — avval bitta savol beraman, bu bepul.";
    case "design":
      return "Design mode — kod o'zgarmaydi, bepul.";
    case "small_edit":
      return "Kichik tahrir — 1 o'zgarish.";
    case "medium":
      return "O'rta hajmli o'zgarish — 1 o'zgarish.";
    case "large":
      return "Katta o'zgarish — 1 o'zgarish.";
    case "repair":
      return "Xato tuzatish — bepul.";
  }
}
