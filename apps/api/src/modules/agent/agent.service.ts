import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { AgentEvent } from "@amb/contracts";
import { ID, type TaskKind } from "@amb/core-rules";
import { getDomainPack } from "@amb/domains";
import { LlmService } from "../../infrastructure/llm/llm.service.js";
import type { ChatMessage, ModelTier } from "../../infrastructure/llm/llm.types.js";
import { WorkspaceService } from "../../infrastructure/workspace/workspace.service.js";
import type { EditResult, WorkspaceDriver } from "../../infrastructure/workspace/drivers/driver.interface.js";
import { BillingService } from "../billing/billing.service.js";
import { ProjectsRepository } from "../projects/projects.repository.js";
import type { Project } from "../../infrastructure/database/schema/index.js";
import { ClassifierService, summaryFor } from "./classifier.service.js";
import { ContextBuilderService } from "./context-builder.service.js";
import { RepairService } from "./repair.service.js";
import { ANSWER_SYSTEM, builderSystem } from "./prompts/index.js";
import { buildTools } from "./tools/tool.registry.js";
import type { RunAgentInput, RunAgentResult } from "./agent.types.js";

type Emit = (event: AgentEvent) => void;

/**
 * Agent tsikli.
 *
 * Bosqichlar (spek 8.1):
 *   qabul -> tasniflash -> kontekst -> bajarish -> verify gate ->
 *   bepul tuzatish -> versiya -> hisob
 *
 * Har bosqich SSE orqali mijozga uzatiladi: u nima bo'layotganini real
 * vaqtda ko'radi va nima uchun pul olinganini (yoki olinmaganini) biladi.
 */
@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private readonly projects: ProjectsRepository,
    private readonly workspaces: WorkspaceService,
    private readonly classifier: ClassifierService,
    private readonly context: ContextBuilderService,
    private readonly repair: RepairService,
    private readonly billing: BillingService,
    private readonly llm: LlmService,
  ) {}

  async run(input: RunAgentInput, emit: Emit): Promise<RunAgentResult> {
    const runId = ID.run();
    const startedAt = Date.now();

    const project = await this.projects.findById(input.projectId);
    if (!project) throw new NotFoundException({ messageUz: "Loyiha topilmadi." });

    emit({ type: "run.started", runId, at: startedAt });

    // --- 1. Tasniflash ---------------------------------------------------
    const classification = input.designMode
      ? { kind: "design" as TaskKind, summaryUz: summaryFor("design"), clarifyingQuestionUz: null, costCents: 0 }
      : await this.classifier.classify(input.prompt);

    let costCents = classification.costCents;
    const kind = classification.kind;

    emit({
      type: "run.classified",
      kind,
      billable: kind === "small_edit" || kind === "medium" || kind === "large",
      summaryUz: classification.summaryUz,
    });

    const changes: EditResult[] = [];
    const ws = await this.workspaces.ensure(project.id);

    const settle = (
      assistantText: string,
      verify: RunAgentResult["verify"],
      gitSha: string | null,
      repairAttempts = 0,
      ok = true,
    ): RunAgentResult => {
      const charge = this.billing.decide(project, {
        kind,
        verify: verify ? (verify.ok ? "passed" : "failed") : "skipped",
        producedDiff: changes.length > 0,
      });

      emit({
        type: "charge",
        units: charge.units,
        reasonUz: charge.reasonUz,
        remaining: charge.remaining,
        balanceLabelUz: charge.balanceLabelUz,
      });

      const durationMs = Date.now() - startedAt;
      emit({ type: "run.finished", runId, ok, versionId: gitSha, durationMs });

      return {
        runId,
        kind,
        units: charge.units,
        chargeReasonUz: charge.reasonUz,
        gitSha,
        verify,
        changedFiles: changes,
        assistantText,
        repairAttempts,
        costCents,
        durationMs,
        ok,
      };
    };

    // --- 2. Bepul yo'llar ------------------------------------------------
    if (kind === "unclear") {
      const question = classification.clarifyingQuestionUz ?? "Aniqroq aytsangiz: nimani o'zgartiraylik?";
      emit({ type: "clarify", questionUz: question, options: [] });
      return settle(question, null, null);
    }

    if (kind === "question") {
      const answer = await this.answerQuestion(ws, input, (c) => (costCents += c));
      emit({ type: "text", delta: answer });
      return settle(answer, null, null);
    }

    // --- 3. Qoldiq tekshiruvi -------------------------------------------
    if (kind !== "design" && !this.billing.hasRemaining(project)) {
      const messageUz =
        "Bu oy uchun o'zgarishlar tugadi. Qo'shimcha o'zgarish sotib olsangiz yoki tarifni oshirsangiz davom etamiz. Savollar va xato tuzatish baribir bepul.";
      emit({ type: "error", messageUz });
      return settle(messageUz, null, null, 0, false);
    }

    // --- 4. Kontekst -----------------------------------------------------
    const docs = await this.context.loadDocs(ws);
    const relevant = await this.context.findRelevantFiles(ws, input.prompt);
    const messages = this.composeMessages(project, input, docs, relevant);

    const tools = buildTools({
      ws,
      changes,
      readOnly: kind === "design",
      onFileChanged: (change) =>
        emit({
          type: "file.changed",
          path: change.path,
          action: change.action,
          added: change.added,
          removed: change.removed,
        }),
    });

    // --- 5. Bajarish -----------------------------------------------------
    const tier: ModelTier = kind === "large" ? "strong" : "standard";
    const result = await this.llm.generate({
      tier,
      messages,
      tools,
      maxSteps: kind === "large" ? 24 : 12,
      onText: (delta) => emit({ type: "text", delta }),
      onToolStart: (tool, argsPreview) => emit({ type: "tool.started", tool, argsPreview }),
      onToolEnd: (tool, r) => emit({ type: "tool.finished", tool, ok: r.ok, summary: r.summary ?? "" }),
    });
    costCents += result.costCents;

    // Bo'sh diff hech qachon hisoblanmaydi va "tuzatdim" deb aytilmaydi.
    if (changes.length === 0) {
      emit({ type: "text", delta: "\n\nHech qanday fayl o'zgarmadi — bu o'zgarish hisoblanmaydi." });
      return settle(result.text, null, null);
    }

    // --- 6. Verify gate va bepul tuzatish --------------------------------
    const repaired = await this.repair.verifyAndRepair({
      ws,
      kind,
      tools,
      mapMd: docs.mapMd,
      startTier: tier,
      emit,
    });
    costCents += repaired.costCents;

    // --- 7. Halol to'xtash ------------------------------------------------
    if (!repaired.verify.ok) {
      emit({
        type: "repair.gaveUp",
        messageUz:
          "Bu xatoni hal qila olmadim. Oxirgi ishlagan versiyaga qaytaraymi? Bu o'zgarish hisoblanmadi.",
        lastGoodVersionId: await this.currentSha(ws),
      });
      return settle(result.text, repaired.verify, null, repaired.attempts, false);
    }

    // --- 8. Versiya -------------------------------------------------------
    const gitSha = await ws.commit(`${kind}: ${input.prompt.slice(0, 72)}`);
    this.logger.log(`${runId}: ${kind}, ${changes.length} fayl, ${repaired.attempts} tuzatish`);

    return settle(result.text, repaired.verify, gitSha, repaired.attempts);
  }

  /** Quruvchi promptni yig'adi: tizim qoidalari + suhbat + tegishli fayllar. */
  private composeMessages(
    project: Project,
    input: RunAgentInput,
    docs: { designMd: string; projectMd: string; mapMd: string },
    relevant: Array<{ path: string; content: string }>,
  ): ChatMessage[] {
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: builderSystem({
          appName: project.name,
          sdk: project.sdk,
          blocks: project.blocks,
          pack: getDomainPack(project.domainPack),
          designMd: docs.designMd,
          projectMd: docs.projectMd,
          mapMd: docs.mapMd,
        }),
      },
      ...this.context.buildConversation(input.history),
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
    return messages;
  }

  /** Savolga javob — kod tegilmaydi. */
  private async answerQuestion(
    ws: WorkspaceDriver,
    input: RunAgentInput,
    addCost: (cents: number) => void,
  ): Promise<string> {
    const docs = await this.context.loadDocs(ws);
    const result = await this.llm.generate({
      tier: "standard",
      messages: [
        { role: "system", content: ANSWER_SYSTEM },
        { role: "system", content: docs.mapMd },
        ...this.context.buildConversation(input.history),
        { role: "user", content: input.prompt },
      ],
      maxSteps: 1,
    });
    addCost(result.costCents);
    return result.text;
  }

  private async currentSha(ws: WorkspaceDriver): Promise<string | null> {
    const result = await ws.exec("git", ["rev-parse", "HEAD"]);
    return result.code === 0 ? (result.stdout.trim() || null) : null;
  }
}
