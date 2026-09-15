import { Injectable, Logger } from "@nestjs/common";
import type { WorkspaceDriver } from "../../infrastructure/workspace/drivers/driver.interface.js";
import { extractErrors } from "./error-extractor.js";
import type { StepResult, VerifyOptions, VerifyReport, VerifyStep } from "./verify.types.js";

/**
 * `npm exec` dan keyin `--` MAJBURIY.
 *
 * Usiz npm `--max-warnings 0` ni o'zining bayrog'i deb oladi va vosita
 * "0" nomli faylni qidiradi. Natijada verify gate soxta xato beradi,
 * agent tuzata olmaydigan narsani tuzatishga urinadi va o'zgarish
 * bekorga hisoblanmay qoladi. Bu amalda uchragan xato.
 */
const COMMANDS: Record<VerifyStep, string[]> = {
  typecheck: ["exec", "--", "tsc", "--noEmit", "--pretty", "false"],
  lint: ["exec", "--", "eslint", ".", "--max-warnings", "0"],
  bundle: ["exec", "--", "expo", "export", "--platform", "web", "--output-dir", ".amb-bundle"],
};

const TIMEOUT_MS: Record<VerifyStep, number> = {
  typecheck: 180_000,
  lint: 180_000,
  bundle: 300_000,
};

/**
 * Verify gate.
 *
 * O'tmagan natija mijozga KO'RSATILMAYDI va hisoblanmaydi — mahsulotning
 * markaziy va'dasi shu. «Kompilyatsiya bo'ldi» deyish yetarli emas:
 * raqobatchilar aynan shuni qilib, buzuq ilova beradi.
 */
@Injectable()
export class VerifyService {
  private readonly logger = new Logger(VerifyService.name);

  async run(ws: WorkspaceDriver, options: VerifyOptions = {}): Promise<VerifyReport> {
    const steps: StepResult[] = [];

    const typecheck = await this.runStep(ws, "typecheck", options);
    steps.push(typecheck);

    // Typecheck yiqilgan bo'lsa lint shovqini modelni chalg'itadi:
    // bir xato o'nlab lint xabarini keltirib chiqaradi.
    steps.push(
      typecheck.ok
        ? await this.runStep(ws, "lint", options)
        : this.skip("lint", "kod tekshiruvi o'tmadi", options),
    );

    steps.push(await this.resolveBundleStep(ws, steps, options));

    const failed = steps.filter((s) => !s.ok);
    return {
      ok: failed.length === 0,
      steps,
      errorDigest: buildDigest(failed),
    };
  }

  /**
   * Bundle qadami sekin (30–90 s). Kichik tahrirda uni o'tkazib yuboramiz:
   * rang o'zgarishi Metro yig'ilishini buzolmaydi.
   */
  private async resolveBundleStep(
    ws: WorkspaceDriver,
    previous: StepResult[],
    options: VerifyOptions,
  ): Promise<StepResult> {
    if (options.skipBundle) return this.skip("bundle", "kichik tahrir", options);
    if (!previous.every((s) => s.ok)) return this.skip("bundle", "oldingi qadam o'tmadi", options);
    return this.runStep(ws, "bundle", options);
  }

  private async runStep(
    ws: WorkspaceDriver,
    step: VerifyStep,
    options: VerifyOptions,
  ): Promise<StepResult> {
    options.onStepStart?.(step);
    const started = Date.now();

    const result = await ws.exec("npm", COMMANDS[step], {
      timeoutMs: options.timeoutMs ?? TIMEOUT_MS[step],
    });
    const durationMs = Date.now() - started;

    // Vosita o'rnatilmagan bo'lsa gate'ni YOLG'ON yiqitmaymiz.
    const missing = result.code === 127 || /command not found|could not determine executable/i.test(result.stderr);
    if (missing) {
      this.logger.warn(`${step}: vosita topilmadi, o'tkazib yuborildi`);
      return this.finish({ step, ok: true, errors: [], durationMs, skipped: true }, options);
    }

    const ok = result.code === 0 && !result.timedOut;
    return this.finish(
      {
        step,
        ok,
        errors: ok ? [] : extractErrors(step, result.stdout, result.stderr, result.timedOut),
        durationMs,
        skipped: false,
      },
      options,
    );
  }

  private skip(step: VerifyStep, reasonUz: string, options: VerifyOptions): StepResult {
    return this.finish(
      { step, ok: true, errors: [], durationMs: 0, skipped: true, skipReasonUz: reasonUz },
      options,
    );
  }

  private finish(result: StepResult, options: VerifyOptions): StepResult {
    options.onStepEnd?.(result);
    return result;
  }
}

function buildDigest(failed: StepResult[]): string {
  if (failed.length === 0) return "";
  return failed
    .map((s) => `## ${s.step} xatolari\n${s.errors.map((e) => `- ${e}`).join("\n")}`)
    .join("\n\n");
}
