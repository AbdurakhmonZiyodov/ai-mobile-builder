"use client";

import { useCallback, useRef, useState } from "react";
import type { AgentEvent } from "@amb/contracts";
import type { Balance } from "@amb/core-rules";
import { streamAgent } from "@/shared/api";
import { toTimelineEntry, type TimelineEntry } from "../timeline";

interface UseAgentRunOptions {
  projectId: string;
  initialBalance: Balance;
  onFinished?: () => void;
}

/**
 * Agent oqimini boshqaradi.
 *
 * Nega hook: oqim mantiqi (kadrlarni yig'ish, matnni birlashtirish,
 * balansni yangilash) komponentdan mustaqil va alohida testlanadi.
 * Komponent faqat ko'rsatadi.
 */
export function useAgentRun({ projectId, initialBalance, onFinished }: UseAgentRunOptions) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [balance, setBalance] = useState<Balance>(initialBalance);
  const [busy, setBusy] = useState(false);
  const streamingId = useRef<string | null>(null);

  const push = useCallback((entry: TimelineEntry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  /**
   * Model matni bo'laklab keladi. Har bo'lakni alohida qator qilsak,
   * ekran sakrab ketadi — shuning uchun oxirgi agent qatoriga qo'shamiz.
   */
  const appendText = useCallback((delta: string) => {
    setEntries((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.kind === "agent" && last.id === streamingId.current) {
        return [...prev.slice(0, -1), { ...last, text: last.text + delta }];
      }
      const entry: TimelineEntry = { id: crypto.randomUUID(), kind: "agent", text: delta };
      streamingId.current = entry.id;
      return [...prev, entry];
    });
  }, []);

  const send = useCallback(
    async (text: string, designMode: boolean) => {
      if (busy || !text.trim()) return;

      setBusy(true);
      streamingId.current = null;
      push({ id: crypto.randomUUID(), kind: "user", text });

      try {
        await streamAgent({ projectId, text, designMode }, (event: AgentEvent) => {
          if (event.type === "text") {
            appendText(event.delta);
            return;
          }
          if (event.type === "charge") {
            setBalance((prev) => ({
              ...prev,
              used: prev.included - event.remaining,
            }));
          }
          if (event.type === "run.finished") {
            onFinished?.();
          }

          const entry = toTimelineEntry(event);
          if (entry) push(entry);
        });
      } catch (err) {
        push({
          id: crypto.randomUUID(),
          kind: "error",
          text: err instanceof Error ? err.message : "Oqim uzildi.",
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, projectId, push, appendText, onFinished],
  );

  return { entries, balance, busy, send };
}
