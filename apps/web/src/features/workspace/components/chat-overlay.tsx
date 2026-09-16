"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui";
import type { TimelineEntry, TimelineKind } from "../timeline";
import { FileGroup } from "./file-group";

interface ChatOverlayProps {
  entries: TimelineEntry[];
  busy: boolean;
  onSend: (text: string, designMode: boolean) => void;
}

/**
 * Suhbat — ilova yonidagi qoplama.
 *
 * Nega qoplama, doimiy ustun emas: ekranning yarmini chat egallasa,
 * ilova kichrayadi. Mijoz esa ilovasini ko'rish uchun keldi. Qoplamani
 * yopib qo'yish mumkin va u yopiq holatda ham oqim davom etadi.
 *
 * Yuborish tugmasi gradient EMAS: bu sahifadagi yagona gradient tugma
 * yuqori paneldagi «Do'konga chiqarish» — mahsulotning yakuniy maqsadi.
 * Oq tugma suhbat kartasi ichida baribir eng kuchli element.
 */
export function ChatOverlay({ entries, busy, onSend }: ChatOverlayProps) {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [designMode, setDesignMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Yangi qator qo'shilganda pastga suramiz — mijoz oxirgi holatni ko'rsin.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length]);

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Suhbat{busy ? " · ishlayapti" : ""}
      </Button>
    );
  }

  return (
    <div className="panel-tall flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="flex items-center gap-2.5 font-medium">
          Suhbat
          {busy ? <span className="text-xs font-normal text-accent-soft">ishlayapman…</span> : null}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Suhbatni yopish"
          className="rounded-full px-2 text-lg leading-none text-ink-faint transition-colors hover:text-ink"
        >
          ×
        </button>
      </header>

      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        {entries.length === 0 ? (
          <p className="px-1 py-2 text-sm leading-relaxed text-ink-faint">
            Nima o&apos;zgartirishni yozing. Savol bersangiz bepul javob beraman.
          </p>
        ) : null}

        {groupFileRuns(entries).map((item) =>
          item.kind === "files" ? (
            <FileGroup key={item.key} entries={item.entries} />
          ) : (
            <div key={item.entry.id} className={ROW_STYLES[item.entry.kind]}>
              {item.entry.text}
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="space-y-2.5 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input, designMode);
          setInput("");
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="Nima o'zgartiraylik?"
          className="w-full resize-none rounded-xl bg-surface-alt px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-ink-faint">
            <input
              type="checkbox"
              checked={designMode}
              onChange={(e) => setDesignMode(e.target.checked)}
              className="accent-accent"
            />
            Design mode (bepul)
          </label>
          <Button variant="solid" type="submit" size="sm" disabled={busy || !input.trim()}>
            {busy ? "Ishlayapman…" : "Yuborish"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/** Suhbatda ko'rsatiladigan element: yakka qator yoki fayllar to'plami. */
type ChatItem =
  | { kind: "files"; key: string; entries: TimelineEntry[] }
  | { kind: "row"; entry: TimelineEntry };

/**
 * Ketma-ket fayl qatorlarini bitta to'plamga yig'adi.
 *
 * Nega ketma-ketligi muhim: fayllar orasiga agentning izohi tushsa, ular
 * boshqa-boshqa qadamlar — ularni bir to'plamga qo'shish suhbatning
 * tartibini buzardi. Shuning uchun faqat YONMA-YON turganlari birlashadi.
 */
function groupFileRuns(entries: TimelineEntry[]): ChatItem[] {
  const items: ChatItem[] = [];
  let run: TimelineEntry[] = [];

  const flush = () => {
    if (run.length === 0) return;
    items.push({ kind: "files", key: run[0].id, entries: run });
    run = [];
  };

  for (const entry of entries) {
    if (entry.kind === "file") {
      run.push(entry);
      continue;
    }
    flush();
    items.push({ kind: "row", entry });
  }
  flush();

  return items;
}

/** Har qator turi o'z ko'rinishiga ega — mijoz oqimni bir qarashda o'qiydi. */
const ROW_STYLES: Record<TimelineKind, string> = {
  user: "ml-10 rounded-2xl bg-ink px-3.5 py-2 text-sm text-paper",
  agent: "rounded-2xl bg-surface-alt px-3.5 py-2 text-sm whitespace-pre-wrap",
  step: "px-3.5 py-1 text-sm text-ink-faint",
  verify: "px-3.5 py-1 text-sm text-success",
  file: "px-3.5 py-1 font-mono text-xs text-ink-faint",
  charge: "rounded-2xl bg-accent-surface px-3.5 py-2 text-sm text-accent-soft",
  error: "rounded-2xl bg-danger-surface px-3.5 py-2 text-sm text-danger whitespace-pre-wrap",
};
