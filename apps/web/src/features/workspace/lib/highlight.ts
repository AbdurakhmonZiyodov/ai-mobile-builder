/**
 * Kodni bo'yash — o'z tokenizerimiz.
 *
 * Nega tayyor kutubxona (shiki, prism, highlight.js) OLINMADI: `AI-GUIDE.md`
 * yangi UI kutubxona qo'shishni taqiqlaydi va sabab amaliy — bularning
 * har biri o'z rang mavzusini olib keladi, bizda esa rang faqat dizayn
 * tokeni orqali beriladi. Ularning eng kichik to'plami ham yuzlab
 * kilobayt, bizga esa mijoz «agent nima yozyapti» ni o'qishi uchun yetti
 * xil rang yetarli.
 *
 * Nega natija `Token[][]` — har qator alohida massiv: ko'ruvchi chapda
 * qator raqamini chizadi va uzun faylni kesadi. Bitta uzluksiz oqim
 * bo'lsa, buning uchun baribir qatorlarga bo'lish kerak bo'lardi.
 */
import { scanTs } from "./highlight-ts";

export type Lang = "ts" | "json" | "md" | "plain";

export type TokenKind =
  | "plain"
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "tag"
  | "attr"
  | "fn"
  | "punct";

export interface Token {
  text: string;
  kind: TokenKind;
}

/**
 * Qatorlar bo'ylab olib yuriladigan holat.
 *
 * Nega u kerak: `/* *\/` izoh ham, teskari tirnoqli matn ham bir necha
 * qatorga cho'ziladi. Har qatorni mustaqil o'qisak, ular ochilgan
 * joyidan keyingi qatorlarda bo'yalmay qolardi — kod «buzilgan» bo'lib
 * ko'rinardi.
 */
export interface ScanState {
  mode: "code" | "comment" | "template" | "fence";
  /** JSX yorlig'i ichidamizmi — atribut nomlari shu bilan aniqlanadi. */
  inTag: boolean;
}

/** Til fayl kengaytmasidan aniqlanadi — boshqa manba yo'q va kerak emas. */
export function langFromPath(path: string): Lang {
  const dot = path.lastIndexOf(".");
  const ext = dot === -1 ? "" : path.slice(dot + 1).toLowerCase();

  if (ext === "ts" || ext === "tsx" || ext === "js" || ext === "jsx" || ext === "mjs" || ext === "cjs") {
    return "ts";
  }
  if (ext === "json") return "json";
  if (ext === "md" || ext === "mdx") return "md";
  return "plain";
}

/** Butun faylni qator-qator tokenlarga ajratadi. */
export function tokenize(code: string, lang: Lang): Token[][] {
  const state: ScanState = { mode: "code", inTag: false };

  return code.split("\n").map((line): Token[] => {
    if (lang === "plain") return line === "" ? [] : [{ text: line, kind: "plain" }];
    if (lang === "md") return scanMd(line, state);

    const tokens = scanTs(line, state);
    return lang === "json" ? markJsonKeys(tokens) : tokens;
  });
}

/**
 * JSON'da tirnoq ichida ikki xil narsa turadi: qiymat va MAYDON NOMI.
 * Ikkalasini bir xil bo'yasak, `app.json` bir rangli devorga aylanadi —
 * shuning uchun `:` dan oldin turgan matn atribut rangini oladi.
 */
function markJsonKeys(tokens: Token[]): Token[] {
  return tokens.map((token, index) => {
    if (token.kind !== "string") return token;

    const after = tokens.slice(index + 1).find((next) => next.text.trim() !== "");
    return after?.text === ":" ? { ...token, kind: "attr" } : token;
  });
}

/**
 * Markdown — bu kod emas, matn.
 *
 * Shuning uchun faqat TUZILMA ajratiladi: sarlavha, iqtibos, kod bloki.
 * Har so'zni bo'yasak, matn o'qilmay qoladi — bo'yash bu yerda yordam
 * emas, shovqin bo'lardi.
 */
function scanMd(line: string, state: ScanState): Token[] {
  if (line.trimStart().startsWith("```")) {
    state.mode = state.mode === "fence" ? "code" : "fence";
    return [{ text: line, kind: "comment" }];
  }
  if (state.mode === "fence") return line === "" ? [] : [{ text: line, kind: "plain" }];
  if (/^\s{0,3}#{1,6}\s/.test(line)) return [{ text: line, kind: "keyword" }];
  if (/^\s{0,3}>/.test(line)) return [{ text: line, kind: "comment" }];

  // Matn ichidagi `kod` bo'laklari — ular ko'zga tashlanishi kerak.
  return line
    .split(/(`[^`]*`)/)
    .filter((part) => part !== "")
    .map((part): Token => ({ text: part, kind: part.startsWith("`") ? "string" : "plain" }));
}
