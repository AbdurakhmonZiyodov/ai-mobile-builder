"use client";

import { useState } from "react";
import type { TimelineEntry } from "../timeline";

/**
 * Ketma-ket kelgan fayl qatorlarini bitta yig'iladigan blokka yig'adi.
 *
 * Nega kerak: bitta qurishda 12–40 ta fayl o'zgaradi va har biri suhbatda
 * alohida qator bo'lib chiqardi. Tor ustunda bu mijozning o'z savoli va
 * agentning javobini ekrandan surib yuborardi — eng muhim ikki narsa
 * texnik shovqin ostida ko'rinmay qolardi.
 *
 * Nega o'chirib tashlamaymiz: fayl ro'yxati ishonch dalili. Mijoz
 * «nimalar o'zgardi?» deb so'rasa javob shu yerda bo'lishi kerak. Endi u
 * yopiq turadi va SO'RALGANDA ochiladi.
 *
 * Nega uchtagacha ochiq qoladi: bir-ikki faylli kichik o'zgarishda yana
 * bosishga majburlash ortiqcha to'siq bo'lardi.
 */
const ALWAYS_VISIBLE = 3;

export function FileGroup({ entries }: { entries: TimelineEntry[] }) {
  const [open, setOpen] = useState(false);

  if (entries.length <= ALWAYS_VISIBLE) {
    return (
      <>
        {entries.map((entry) => (
          <FileRow key={entry.id} text={entry.text} />
        ))}
      </>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface-alt/50 px-2.5 py-1.5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left text-xs text-ink-muted transition-colors hover:text-ink"
      >
        <span
          aria-hidden
          className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}
        >
          ›
        </span>
        {entries.length} ta fayl yozildi
        <span className="ml-auto text-ink-faint">{open ? "yashirish" : "ko'rish"}</span>
      </button>

      {open ? (
        <div className="mt-1.5 space-y-0.5 border-t border-line pt-1.5">
          {entries.map((entry) => (
            <FileRow key={entry.id} text={entry.text} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Bitta fayl qatori — mono shrift «bu fayl nomi» degan signal beradi. */
function FileRow({ text }: { text: string }) {
  return <p className="truncate px-1 font-mono text-[11px] text-ink-faint">{text}</p>;
}
