"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui";
import type { TimelineEntry, TimelineKind } from "../timeline";

interface ChatOverlayProps {
  entries: TimelineEntry[];
  busy: boolean;
  onSend: (text: string, designMode: boolean) => void;
}

/**
 * Suhbat — ilova ustidagi qoplama.
 *
 * Nega qoplama, alohida ustun emas: ekranning yarmini doimiy chat
 * egallasa, ilova kichrayadi. Mijoz esa ilovasini ko'rish uchun keldi.
 * Qoplamani yopib qo'yish mumkin va u yopiq holatda ham oqim davom etadi.
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
      <Button variant="dark" size="sm" onClick={() => setOpen(true)}>
        Suhbat{busy ? " · ishlayapti" : ""}
      </Button>
    );
  }

  return (
    <div className="flex max-h-[70vh] w-[380px] flex-col rounded-xl border border-line bg-surface shadow-lg">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="font-medium">Suhbat</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Suhbatni yopish"
          className="text-ink-faint hover:text-ink"
        >
          ×
        </button>
      </header>

      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        {entries.length === 0 ? (
          <p className="px-1 py-2 text-sm text-ink-faint">
            Nima o&apos;zgartirishni yozing. Savol bersangiz bepul javob beraman.
          </p>
        ) : null}

        {entries.map((entry) => (
          <div key={entry.id} className={rowClass(entry.kind)}>
            {entry.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        className="space-y-2 border-t border-line p-3"
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
          className="w-full resize-none rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-ink-faint">
            <input
              type="checkbox"
              checked={designMode}
              onChange={(e) => setDesignMode(e.target.checked)}
            />
            Design mode (bepul)
          </label>
          <Button type="submit" size="sm" disabled={busy || !input.trim()}>
            {busy ? "Ishlayapman…" : "Yuborish"}
          </Button>
        </div>
      </form>
    </div>
  );
}

const ROW_STYLES: Record<TimelineKind, string> = {
  user: "bg-ink text-surface ml-8 rounded-lg px-3 py-2 text-sm",
  agent: "bg-surface-alt rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
  step: "px-3 py-1 text-sm text-ink-faint",
  verify: "px-3 py-1 text-sm text-success",
  file: "px-3 py-1 font-mono text-xs text-ink-faint",
  charge: "bg-success-surface text-success rounded-lg px-3 py-2 text-sm",
  error: "bg-accent-soft/30 text-accent rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
};

function rowClass(kind: TimelineKind): string {
  return ROW_STYLES[kind];
}
