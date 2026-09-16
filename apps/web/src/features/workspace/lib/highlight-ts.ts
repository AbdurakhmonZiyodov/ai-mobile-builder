import type { ScanState, Token } from "./highlight";
import { continueOpenContext, findStringEnd, wordKind } from "./highlight-rules";

/**
 * TS / TSX / JS skaneri — bitta qatorni o'qiydi.
 *
 * Nega alohida fayl: `highlight.ts` da ommaviy yuz (turlar, til aniqlash,
 * qatorlar bo'ylab yurish), bu yerda esa eng ko'p o'zgaradigan qism —
 * qatorni bo'laklarga ajratish.
 *
 * Nega mukammal parser emas: bizga daraxt kerak emas, mijozga kod
 * O'QILISHI kerak. To'liq parser aynan biz qochgan narsani — kutubxona
 * hajmidagi kodni olib kelardi.
 */

/** Sticky (`y`): qatorning AYNAN shu joyidan boshlab qidiradi. */
const WORD = /[A-Za-z_$][\w$]*/y;
const NUMBER = /0[xXbBoO][0-9a-fA-F_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?/y;
const TAG = /<\/?[A-Za-z][\w.:-]*/y;

/** Ochiq qolgan kontekst `state` ga yozib ketiladi — keyingi qator davom ettiradi. */
export function scanTs(line: string, state: ScanState): Token[] {
  const out: Token[] = [];
  const start = continueOpenContext(line, state, out);
  if (start < 0) return out;

  let i = start;
  while (i < line.length) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === " " || ch === "\t") {
      let end = i;
      while (end < line.length && (line[end] === " " || line[end] === "\t")) end += 1;
      out.push({ text: line.slice(i, end), kind: "plain" });
      i = end;
      continue;
    }

    if (ch === "/" && next === "/") {
      out.push({ text: line.slice(i), kind: "comment" });
      return out;
    }

    if (ch === "/" && next === "*") {
      const end = line.indexOf("*/", i + 2);
      if (end === -1) {
        out.push({ text: line.slice(i), kind: "comment" });
        state.mode = "comment";
        return out;
      }
      out.push({ text: line.slice(i, end + 2), kind: "comment" });
      i = end + 2;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      const end = findStringEnd(line, i + 1, ch);
      if (end === -1) {
        out.push({ text: line.slice(i), kind: "string" });
        // Faqat teskari tirnoq keyingi qatorga o'tadi. Oddiy tirnoq qator
        // oxirida majburan yopiladi — aks holda bitta yopilmagan tirnoq
        // butun faylni yashil qilib qo'yardi.
        if (ch === "`") state.mode = "template";
        return out;
      }
      out.push({ text: line.slice(i, end + 1), kind: "string" });
      i = end + 1;
      continue;
    }

    // `=>` oldin ushlanadi: uning `>` belgisi JSX yorlig'ini yopib qo'ysa,
    // `onPress={() => ...}` dan keyingi hamma narsa noto'g'ri bo'yalardi.
    if (ch === "=" && next === ">") {
      out.push({ text: "=>", kind: "punct" });
      i += 2;
      continue;
    }

    if (ch === "<" && !state.inTag) {
      TAG.lastIndex = i;
      const tag = TAG.exec(line);
      if (tag) {
        out.push({ text: tag[0], kind: "tag" });
        state.inTag = true;
        i += tag[0].length;
        continue;
      }
    }

    if (state.inTag && (ch === ">" || (ch === "/" && next === ">"))) {
      const text = ch === ">" ? ">" : "/>";
      out.push({ text, kind: "tag" });
      state.inTag = false;
      i += text.length;
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      NUMBER.lastIndex = i;
      const num = NUMBER.exec(line);
      if (num) {
        out.push({ text: num[0], kind: "number" });
        i += num[0].length;
        continue;
      }
    }

    WORD.lastIndex = i;
    const word = WORD.exec(line);
    if (word) {
      i += word[0].length;
      out.push({ text: word[0], kind: wordKind(word[0], line[i], state.inTag) });
      continue;
    }

    out.push({ text: ch, kind: "punct" });
    i += 1;
  }

  return out;
}
