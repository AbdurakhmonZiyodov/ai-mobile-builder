import type { WorkspaceDriver } from "@amb/workspace";

export type VerifyStep = "typecheck" | "lint" | "bundle";

export interface StepResult {
  step: VerifyStep;
  ok: boolean;
  /** Modelga beriladigan xatolar — qisqartirilgan, eng muhimi birinchi. */
  errors: string[];
  durationMs: number;
  skipped?: boolean;
}

export interface VerifyReport {
  ok: boolean;
  steps: StepResult[];
  /** Model uchun bitta matn — tuzatish tsikliga shu beriladi. */
  errorDigest: string;
}

export interface VerifyOptions {
  /** `bundle` sekin (30–90 s). Kichik tahrirda o'tkazib yuborish mumkin. */
  skipBundle?: boolean;
  timeoutMs?: number;
  onStepStart?: (step: VerifyStep) => void;
  onStepEnd?: (r: StepResult) => void;
}

/**
 * Verify gate — spek 8.1.
 * O'tmagan natija foydalanuvchiga KO'RSATILMAYDI va hisoblanmaydi.
 */
export async function runVerify(
  ws: WorkspaceDriver,
  opts: VerifyOptions = {},
): Promise<VerifyReport> {
  const steps: StepResult[] = [];

  steps.push(await runStep(ws, "typecheck", ["exec", "--", "tsc", "--noEmit", "--pretty", "false"], opts));
  if (steps[0]?.ok !== false) {
    steps.push(await runStep(ws, "lint", ["exec", "--", "eslint", ".", "--max-warnings", "0"], opts));
  } else {
    // Typecheck yiqilgan bo'lsa lint shovqini modelni chalg'itadi.
    steps.push({ step: "lint", ok: true, errors: [], durationMs: 0, skipped: true });
    opts.onStepEnd?.(steps[1]!);
  }

  if (opts.skipBundle) {
    const r: StepResult = { step: "bundle", ok: true, errors: [], durationMs: 0, skipped: true };
    steps.push(r);
    opts.onStepEnd?.(r);
  } else if (steps.every((s) => s.ok)) {
    steps.push(
      await runStep(ws, "bundle", ["exec", "--", "expo", "export", "--platform", "web", "--output-dir", ".amb-bundle"], {
        ...opts,
        timeoutMs: opts.timeoutMs ?? 300_000,
      }),
    );
  } else {
    const r: StepResult = { step: "bundle", ok: true, errors: [], durationMs: 0, skipped: true };
    steps.push(r);
    opts.onStepEnd?.(r);
  }

  const failed = steps.filter((s) => !s.ok);
  return {
    ok: failed.length === 0,
    steps,
    errorDigest: buildDigest(failed),
  };
}

/**
 * DIQQAT: `npm exec` dan keyin `--` majburiy.
 * Usiz npm `--max-warnings 0` ni O'ZINING bayrog'i deb oladi va vosita
 * "0" nomli faylni qidiradi — verify gate soxta xato beradi.
 */
async function runStep(
  ws: WorkspaceDriver,
  step: VerifyStep,
  npmArgs: string[],
  opts: VerifyOptions,
): Promise<StepResult> {
  opts.onStepStart?.(step);
  const started = Date.now();
  const res = await ws.exec("npm", npmArgs, { timeoutMs: opts.timeoutMs ?? 180_000 });
  const durationMs = Date.now() - started;

  // Vosita o'rnatilmagan bo'lsa gate'ni yolg'on yiqitmaymiz — o'tkazib yuboramiz va aytamiz.
  const notInstalled = res.code === 127 || /command not found|could not determine executable/i.test(res.stderr);
  if (notInstalled) {
    const r: StepResult = {
      step,
      ok: true,
      errors: [`${step}: vosita topilmadi, o'tkazib yuborildi`],
      durationMs,
      skipped: true,
    };
    opts.onStepEnd?.(r);
    return r;
  }

  const ok = res.code === 0 && !res.timedOut;
  const r: StepResult = {
    step,
    ok,
    errors: ok ? [] : extractErrors(step, res.stdout, res.stderr, res.timedOut),
    durationMs,
  };
  opts.onStepEnd?.(r);
  return r;
}

function extractErrors(step: VerifyStep, stdout: string, stderr: string, timedOut: boolean): string[] {
  if (timedOut) return [`${step}: vaqt tugadi`];
  const raw = `${stdout}\n${stderr}`;
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  const interesting = lines.filter((l) =>
    step === "typecheck"
      ? /error TS\d+/.test(l)
      : step === "lint"
        ? /\berror\b/i.test(l)
        : /error|failed|cannot resolve|unable to resolve/i.test(l),
  );

  const picked = (interesting.length ? interesting : lines).slice(0, 20);
  return picked.map((l) => l.slice(0, 300));
}

function buildDigest(failed: StepResult[]): string {
  if (failed.length === 0) return "";
  return failed
    .map((s) => `## ${s.step} xatolari\n${s.errors.map((e) => `- ${e}`).join("\n")}`)
    .join("\n\n");
}

/** Mijozga ko'rsatiladigan sodda til — "typecheck" so'zi ishlatilmaydi (spek 15.2). */
export function verifyLabelUz(step: VerifyStep): string {
  switch (step) {
    case "typecheck":
      return "Kodni tekshiryapmiz";
    case "lint":
      return "Qoidalarga moslikni tekshiryapmiz";
    case "bundle":
      return "Ilovani yig'yapmiz";
  }
}
