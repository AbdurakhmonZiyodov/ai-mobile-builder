"use client";

import type { ReactElement } from "react";
import { formatElapsed } from "./run-progress";

export interface ActivityLineProps {
  /** Hozir nima qilinayotgani, o'zbekcha, tayyor matn: «Kodni o'qiyapman». */
  labelUz: string;
  /** Shu ayni harakat ketma-ket necha marta takrorlandi (1 bo'lsa ko'rsatilmaydi). */
  repeat: number;
  elapsedSec: number;
}

/**
 * Suhbat oqimining oxiridagi «hozir nima bo'lyapti» qatori.
 *
 * NEGA bitta qator, ro'yxat emas: ilgari «Kodni o'qiyapman…» ketma-ket besh
 * marta chiqib oqimni bir xil matn bilan to'ldirardi — mijoz ish ketyaptimi
 * yoki osilib qoldimi ajratolmasdi. Endi takror yangi qator qo'shmaydi,
 * faqat yonidagi hisoblagichni oshiradi: oqim toza, harakat esa ko'rinadi.
 *
 * NEGA vaqt shu yerda ham bor: bosqich ko'rsatkichi butun ishning vaqtini
 * beradi, bu qator esa AYNI qadamniki. Ikkalasi birga «qaysi qadam cho'zilib
 * ketdi» degan savolga javob beradi.
 *
 * NEGA fon `bg-surface-alt` va shakl `rounded-2xl` — suhbatdagi agent qatori
 * bilan bir xil: bu ham agentning gapi. Lekin matn `ink-muted` — hali
 * tugallanmagan, o'tkinchi holat, u tayyor javob bilan teng vazn olmasligi kerak.
 */
export function ActivityLine({ labelUz, repeat, elapsedSec }: ActivityLineProps): ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 rounded-2xl bg-surface-alt px-3.5 py-2 text-sm text-ink-muted"
    >
      <SpinnerIcon />
      {/* `truncate`: uzun yorliq 320px ustunda qatorni ikkiga bo'lib, pastdagi
          kiritish maydonini surib yuborardi. */}
      <span className="min-w-0 flex-1 truncate">{labelUz}</span>
      {/* Hisoblagich alohida va `shrink-0` — u yorliq bilan birga qirqilib ketsa,
          takrorlanish haqidagi yagona belgi yo'qolardi. */}
      {repeat > 1 ? <span className="shrink-0 text-xs text-ink-faint">×{repeat}</span> : null}
      {/* `aria-hidden`: har soniyada o'zgaradigan raqam `aria-live` ichida
          bo'lgani uchun ekran o'quvchi yorliq o'rniga uni o'qib turardi. */}
      <span aria-hidden="true" className="shrink-0 font-mono text-xs text-ink-faint">
        {formatElapsed(elapsedSec)}
      </span>
    </div>
  );
}

/**
 * Aylanuvchi indikator — uchta pulsatsiyalanuvchi nuqta emas.
 *
 * NEGA: uch nuqta chatdagi «javob yozyapti» odatini eslatadi va mijoz javob
 * kutib qoladi. Bu yerda esa javob emas, ish ketyapti. Aylana quyuq fonda
 * bitta tiniq shakl bo'lib qoladi, uchta mayda nuqta esa shovqinga aylanadi.
 *
 * NEGA aylana to'liq emas: bo'shliq bo'lmasa aylanish ko'rinmaydi.
 * NEGA `motion-reduce` da ham aylanadi: bu qatordagi yagona «tirik» signal,
 * uni o'chirsak qator qotib qolgan matnga o'xshab qolardi.
 */
function SpinnerIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className="size-3.5 shrink-0 animate-spin text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="6" className="opacity-25" />
      <path d="M8 2a6 6 0 0 1 6 6" />
    </svg>
  );
}
