"use client";

import type { ReactElement } from "react";
import type { RunPhase } from "@amb/contracts";

/**
 * `RunPhase` SHU YERDA qayta e'lon qilinmaydi.
 *
 * U `@amb/contracts` dagi `toolPhase()` bilan yonma-yon yashaydi: bosqich
 * agent tool nomidan chiqariladi, ya'ni ikkalasi bir manbadan kelishi
 * shart. Nusxa olinsa, backend yangi tool qo'shganda bu ro'yxat jimgina
 * eskirib qolardi va yangi bosqich ko'rsatkichga umuman chiqmasdi.
 */

export interface RunProgressProps {
  /** Hozirgi bosqich. `null` — hech qanday ish ketmayapti. */
  phase: RunPhase | null;
  /** Shu ishda allaqachon o'tilgan bosqichlar. */
  reached: RunPhase[];
  /** Ish boshlanganidan beri o'tgan soniya. Ish ketmayotgan bo'lsa `null`. */
  elapsedSec: number | null;
}

/**
 * Suhbat panelining tepasidagi bosqich ko'rsatkichi.
 *
 * NEGA kerak: oqimda «Kodni o'qiyapman…» ketma-ket besh marta chiqadi va
 * qatorlar bir xil ko'rinadi — mijoz na qaysi bosqichda ekanini, na ish
 * tugaganini biladi. Bu chiziq bitta savolga javob beradi: «qayerdamiz va
 * yana qancha bor». Shuning uchun u oqimdan TASHQARIDA turadi — surilib
 * ketadigan suhbat matni uni ko'mib yubormaydi.
 *
 * NEGA `done`/`failed` butun qatorni ALMASHTIRADI: tugagan ishda beshta
 * bosqichni ko'rsatib turish «hali ham nimadir ketyapti» degan yolg'on
 * signal berardi. Yakun bitta qisqa jumla bo'lishi kerak.
 *
 * NEGA vaqt `aria-hidden`: u har soniyada o'zgaradi va `aria-live` hududi ichida turgani
 * uchun ekran o'quvchi uni tinimsiz takrorlardi — bosqich o'zgargani esa eshitilmay qolardi.
 */
export function RunProgress({ phase, reached, elapsedSec }: RunProgressProps): ReactElement | null {
  // Ish ketmayapti — joy ham egallamaymiz, aks holda panel tepasida
  // sababsiz bo'sh chiziq turib qolardi.
  if (phase === null) return null;

  const time =
    elapsedSec === null ? null : <span aria-hidden="true" className={TIME}>{formatElapsed(elapsedSec)}</span>;

  if (phase === "done" || phase === "failed") {
    return (
      <div role="status" aria-live="polite" className={ROW}>
        {phase === "done" ? (
          <span className="flex items-center gap-1.5 text-[11px] text-success">
            <CheckIcon /> Tayyor
          </span>
        ) : (
          <span className="text-[11px] text-danger">Tugallanmadi</span>
        )}
        {time}
      </div>
    );
  }

  const currentIndex = WORK_PHASES.findIndex((step) => step.id === phase);

  return (
    <div role="status" aria-live="polite" className={ROW}>
      {/* `flex-wrap`: 320px tor ustunda beshta yorliq bitta satrga sig'maydi.
          Gorizontal scroll qidirishni talab qiladi, ko'chgan satr esa hech narsani yashirmaydi. */}
      <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1">
        {WORK_PHASES.map((step, index) => {
          const state = stateOf(step.id, index, currentIndex, reached);

          return (
            <li key={step.id} className={`flex items-center gap-1.5 text-[11px] ${TEXT[state]}`}>
              <Marker state={state} />
              <span>{step.labelUz}</span>
              {/* Ajratgich yorliq bilan BIR `li` ichida — ko'chganda yangi satr boshida yolg'iz qolmasin. */}
              {index < WORK_PHASES.length - 1 ? (
                <span aria-hidden="true" className="ml-0.5 h-px w-2.5 bg-line-strong" />
              ) : null}
            </li>
          );
        })}
      </ol>
      {time}
    </div>
  );
}

/**
 * O'tgan vaqt mijoz tilida: `12 son`, `1 daq 20 son`.
 *
 * NEGA `01:20` emas: mijoz taymer o'qimaydi, u «ko'p kutdimmi» degan savolga javob
 * qidiradi. Soniya nolga teng bo'lsa tashlanadi — `2 daq 0 son` yana soat ko'rinishi.
 */
export function formatElapsed(sec: number): string {
  const total = Number.isFinite(sec) ? Math.max(0, Math.floor(sec)) : 0;
  if (total < 60) return `${total} son`;

  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${minutes} daq` : `${minutes} daq ${rest} son`;
}

/** Yorliqlar birinchi shaxsda va sodda — mijoz o'zi bilan gaplashilayotganini his qiladi. Atama yo'q. */
const WORK_PHASES: ReadonlyArray<{ id: RunPhase; labelUz: string }> = [
  { id: "understanding", labelUz: "Tushunyapman" },
  { id: "planning", labelUz: "Reja" },
  { id: "exploring", labelUz: "O'rganyapman" },
  { id: "writing", labelUz: "Yozyapman" },
  { id: "verifying", labelUz: "Tekshiryapman" },
];

type StepState = "passed" | "current" | "todo";

const ROW = "flex items-center justify-between gap-2 border-b border-line px-3 py-2";
const TIME = "shrink-0 font-mono text-[11px] text-ink-faint";
const TEXT: Record<StepState, string> = {
  passed: "text-ink-muted",
  current: "text-ink",
  todo: "text-ink-faint",
};

/**
 * NEGA `reached` ham, indeks ham: agent bosqichni sakrab o'tishi mumkin (sodda so'rovda
 * reja tuzilmaydi). Faqat `reached` ga tayansak, qator o'rtasida bo'sh doira qolardi va
 * mijoz uni «ish osilib qolgan» deb o'qirdi. Oldinda turgan bosqich — o'tib bo'lingani.
 */
function stateOf(id: RunPhase, index: number, currentIndex: number, reached: RunPhase[]): StepState {
  if (index === currentIndex) return "current";
  if (reached.includes(id)) return "passed";
  return index < currentIndex ? "passed" : "todo";
}

function Marker({ state }: { state: StepState }): ReactElement {
  if (state === "passed") return <CheckIcon />;

  // Pulsatsiya ko'zni aynan hozirgi bosqichga olib boradi. `motion-reduce` da
  // o'chadi: bosqich baribir to'ldirilgan `accent` nuqta bilan ajralib turadi.
  if (state === "current") {
    return <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />;
  }

  return <span className="size-1.5 shrink-0 rounded-full border border-line-strong" />;
}

/** Emoji emas: emoji rangi boshqarilmaydi va har platformada boshqacha ko'rinadi. SVG `currentColor` ni oladi. */
function CheckIcon(): ReactElement {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false" className="size-2.5 shrink-0"
      fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 5.3 3.8 7.5 8.5 2.5" />
    </svg>
  );
}
