import type { VerifyStep } from "./verify.types.js";

/** Bitta xato satrining eng katta uzunligi — kontekstni tejash uchun. */
const MAX_LINE = 300;
/** Modelga beriladigan xatolar soni. Ko'pi baribir bir xil sababdan. */
const MAX_LINES = 20;

/**
 * Vosita chiqishidan haqiqiy xatolarni ajratadi.
 *
 * Nega filtrlash kerak: `tsc` va `eslint` yuzlab qator chiqaradi, ularning
 * ko'pi shovqin. Modelga hammasini bersak, kontekst byudjeti yonadi va
 * u asosiy xatoni ko'rmay qoladi.
 */
export function extractErrors(
  step: VerifyStep,
  stdout: string,
  stderr: string,
  timedOut: boolean,
): string[] {
  if (timedOut) return [`${step}: vaqt tugadi`];

  const lines = `${stdout}\n${stderr}`
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const matcher = MATCHERS[step];
  const interesting = lines.filter((l) => matcher.test(l));

  return (interesting.length > 0 ? interesting : lines)
    .slice(0, MAX_LINES)
    .map((l) => l.slice(0, MAX_LINE));
}

const MATCHERS: Record<VerifyStep, RegExp> = {
  typecheck: /error TS\d+/,
  lint: /\berror\b/i,
  bundle: /error|failed|cannot resolve|unable to resolve/i,
};
