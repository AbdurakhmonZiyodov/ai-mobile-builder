import { Injectable, Logger } from "@nestjs/common";
import type { AgentEvent } from "@amb/contracts";
import type { TaskKind } from "@amb/core-rules";
import { LlmService } from "../../infrastructure/llm/llm.service.js";
import type { ModelTier, ToolSpec } from "../../infrastructure/llm/llm.types.js";
import type { WorkspaceDriver } from "../../infrastructure/workspace/drivers/driver.interface.js";
import { VerifyService } from "../verify/verify.service.js";
import type { VerifyReport } from "../verify/verify.types.js";
import { repairSystem } from "./prompts/index.js";

/** Ko'pi bilan uch urinish, keyin halol to'xtash. */
export const MAX_REPAIR_ATTEMPTS = 3;

export interface RepairInput {
  ws: WorkspaceDriver;
  kind: TaskKind;
  tools: ToolSpec[];
  /** Kontekst toraytirilganda qoladigan yagona hujjat. */
  mapMd: string;
  startTier: ModelTier;
  emit: (event: AgentEvent) => void;
}

export interface RepairOutcome {
  verify: VerifyReport;
  attempts: number;
  costCents: number;
}

/**
 * Verify gate va xato tuzatish tsikli.
 *
 * Bu urinishlar BEPUL — «AI o'z xatosiga pul yeydi» bozordagi eng keng
 * tarqalgan shikoyat va biz unga qarshi turamiz.
 *
 * Uch urinishdan keyin halol to'xtaymiz. Cheksiz urinish ikki narsani
 * buzadi: bizning marjani va mijozning ishonchini — u ekranda soatlab
 * aylanayotgan indikatorni ko'radi va nima bo'layotganini bilmaydi.
 */
@Injectable()
export class RepairService {
  private readonly logger = new Logger(RepairService.name);

  constructor(
    private readonly llm: LlmService,
    private readonly verify: VerifyService,
  ) {}

  async verifyAndRepair(input: RepairInput): Promise<RepairOutcome> {
    let report = await this.runVerify(input);
    let costCents = 0;
    let attempts = 0;

    let tier = input.startTier;
    let previousDigest = "";

    // Muhit nosozligini model tuzata olmaydi — uchta bepul urinishni
    // bekorga sarflamaymiz.
    if (report.unavailable) {
      this.logger.error(`Tekshiruv o'tkazib bo'lmadi: ${report.unavailableReasonUz ?? ""}`);
      return { verify: report, attempts: 0, costCents: 0 };
    }

    while (!report.ok && attempts < MAX_REPAIR_ATTEMPTS) {
      attempts += 1;

      input.emit({
        type: "repair.attempt",
        attempt: attempts,
        max: MAX_REPAIR_ATTEMPTS,
        errorPreview: report.errorDigest.slice(0, 300),
      });

      // Bir xil xato ikki marta takrorlansa — arzon modeldan kuchligiga.
      // Model o'z darajasida yechimni topolmayotgani aniq bo'ldi.
      if (report.errorDigest === previousDigest && tier !== "strong") {
        this.logger.log("Bir xil xato takrorlandi — kuchliroq modelga o'tildi");
        tier = "strong";
      }
      previousDigest = report.errorDigest;

      const result = await this.llm.generate({
        tier,
        // Kontekst ataylab tor: xato matni va loyiha xaritasidan boshqa
        // hech narsa yo'q. Keng kontekst modelni o'sha xato yo'ldan
        // yana olib ketadi.
        messages: [
          { role: "system", content: repairSystem(attempts, MAX_REPAIR_ATTEMPTS) },
          { role: "system", content: input.mapMd },
          { role: "user", content: `Quyidagi xatolarni tuzat:\n\n${report.errorDigest}` },
        ],
        tools: input.tools,
        maxSteps: 10,
        onText: (delta) => input.emit({ type: "text", delta }),
        onToolStart: (tool, argsPreview) => input.emit({ type: "tool.started", tool, argsPreview }),
        onToolEnd: (tool, r) =>
          input.emit({ type: "tool.finished", tool, ok: r.ok, summary: r.summary ?? "" }),
      });
      costCents += result.costCents;

      report = await this.runVerify(input);
      if (report.unavailable) break;
    }

    return { verify: report, attempts, costCents };
  }

  private runVerify(input: RepairInput): Promise<VerifyReport> {
    return this.verify.run(input.ws, {
      // Kichik tahrirda to'liq yig'ish ortiqcha 60 soniya.
      skipBundle: input.kind === "small_edit",
      onStepStart: (step) => input.emit({ type: "verify.started", step }),
      onStepEnd: (result) =>
        input.emit({
          type: "verify.finished",
          step: result.step,
          ok: result.ok,
          skipped: result.skipped,
          errors: result.errors,
        }),
    });
  }
}
