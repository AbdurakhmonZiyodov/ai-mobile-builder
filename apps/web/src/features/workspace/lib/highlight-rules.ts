import type { ScanState, Token, TokenKind } from "./highlight";

/**
 * Skanerning pastki qatlami: kalit so'zlar va yopilish qoidalari.
 *
 * Nega `highlight-ts.ts` dan ajratildi: u yerda qator BO'YLAB yurish
 * mantiqi turadi, bu yerda esa bo'lakni TANISH. Ikkalasi bir faylda
 * bo'lganda fayl 170 qatordan oshib ketdi va ikkita mustaqil narsani
 * bitta joyda o'qishga majbur qilardi.
 */

/** Bitta satrda yozilgan — ro'yxat uzun, lekin unda mantiq yo'q. */
const KEYWORDS = new Set(
  ("abstract as async await break case catch class const continue declare default delete do else " +
    "enum export extends false finally for from function get if implements import in infer " +
    "instanceof interface is keyof let namespace new null of private protected public readonly " +
    "return satisfies set static super switch this throw true try type typeof undefined var void " +
    "while yield").split(" "),
);

/**
 * Oldingi qatordan ochiq qolgan izoh yoki matnni yopadi.
 * `-1` qaytsa — butun qator o'sha kontekstga tegishli.
 */
export function continueOpenContext(line: string, state: ScanState, out: Token[]): number {
  if (state.mode === "comment") {
    const end = line.indexOf("*/");
    if (end === -1) {
      out.push({ text: line, kind: "comment" });
      return -1;
    }
    out.push({ text: line.slice(0, end + 2), kind: "comment" });
    state.mode = "code";
    return end + 2;
  }
  if (state.mode === "template") {
    const end = findStringEnd(line, 0, "`");
    if (end === -1) {
      out.push({ text: line, kind: "string" });
      return -1;
    }
    out.push({ text: line.slice(0, end + 1), kind: "string" });
    state.mode = "code";
    return end + 1;
  }
  return 0;
}

/** Yopuvchi tirnoqni topadi; qochirilgan tirnoq (`\"`) o'tkazib yuboriladi. */
export function findStringEnd(line: string, from: number, quote: string): number {
  for (let i = from; i < line.length; i += 1) {
    if (line[i] === "\\") i += 1;
    else if (line[i] === quote) return i;
  }
  return -1;
}

/** Nega `(` ga qaraladi: chaqiruvni tanish uchun turlarni bilish shart emas. */
export function wordKind(word: string, after: string | undefined, inTag: boolean): TokenKind {
  if (KEYWORDS.has(word)) return "keyword";
  if (inTag) return "attr";
  return after === "(" ? "fn" : "plain";
}
