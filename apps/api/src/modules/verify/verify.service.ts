import { Injectable, Logger } from "@nestjs/common";
import type { WorkspaceDriver } from "../../infrastructure/workspace/drivers/driver.interface.js";
import { extractErrors } from "./error-extractor.js";
import type { StepResult, VerifyOptions, VerifyReport, VerifyStep } from "./verify.types.js";

/**
 * Har qadam uchun vosita va uning bayroqlari.
 *
 * Vositalar loyihaning `node_modules/.bin` idan TO'G'RIDAN-TO'G'RI
 * ishga tushiriladi, `npm exec` orqali emas. Sabab: `npm exec` vosita
 * topilmasa reyestrdan shu nomli paketni yuklab bajaradi — `tsc` uchun
 * bu TypeScript'ga aloqasi yo'q begona paket bo'lib chiqdi.
 */
const COMMANDS: Record<VerifyStep, { bin: string; args: string[] }> = {
  typecheck: { bin: "tsc", args: ["--noEmit", "--pretty", "false"] },
  lint: { bin: "eslint", args: [".", "--max-warnings", "0"] },
  bundle: {
    bin: "expo",
    args: ["export", "--platform", "web", "--output-dir", ".amb-bundle"],
  },
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

    const unavailable = steps.find((s) => s.unavailable);
    if (unavailable) {
      // Tekshirilmagan kodni "o'tdi" deb ko'rsatish mumkin emas: mijoz
      // buzuq ilovani tayyor deb o'ylaydi va buni do'konda biladi.
      return {
        ok: false,
        steps,
        errorDigest: "",
        unavailable: true,
        unavailableReasonUz: `Tekshiruvni o'tkazib bo'lmadi: ${unavailable.skipReasonUz ?? "vosita topilmadi"}.`,
      };
    }

    const failed = steps.filter((s) => !s.ok);
    return {
      ok: failed.length === 0,
      steps,
      errorDigest: buildDigest(failed),
      unavailable: false,
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
    const command = COMMANDS[step];

    // Vosita loyihada bormi — oldindan tekshiramiz.
    //
    // Avval bu holat "o'tkazib yuborildi, gate o'tdi" deb belgilanardi.
    // Natijada noto'g'ri sozlangan serverda HAR RUN "tekshirildi" deb
    // ko'rsatilardi va tekshirilmagan kod uchun pul olinardi.
    const bin = await ws.resolveBin(command.bin);
    if (!bin) {
      const reasonUz = `"${command.bin}" vositasi loyihada topilmadi`;
      this.logger.error(`${reasonUz}. Workspace bog'liqliklari o'rnatilganmi?`);
      return this.finish(
        {
          step,
          ok: false,
          errors: [reasonUz],
          durationMs: 0,
          skipped: false,
          unavailable: true,
          skipReasonUz: reasonUz,
        },
        options,
      );
    }

    const result = await ws.exec(bin, command.args, {
      timeoutMs: options.timeoutMs ?? TIMEOUT_MS[step],
    });
    const durationMs = Date.now() - started;

    // Vosita bor edi, lekin ishga tushmadi — bu ham muhit nosozligi.
    if (result.code === 127 || /ENOENT|EACCES/i.test(result.stderr)) {
      const reasonUz = `"${command.bin}" ishga tushmadi`;
      this.logger.error(reasonUz);
      return this.finish(
        { step, ok: false, errors: [reasonUz], durationMs, skipped: false, unavailable: true, skipReasonUz: reasonUz },
        options,
      );
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
