"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentEvent } from "@amb/contracts";
import type { Balance } from "@amb/core-rules";
import { api } from "@/shared/api";
import { toTimelineEntry, type TimelineEntry } from "../timeline";

interface UseAgentRunOptions {
  projectId: string;
  initialBalance: Balance;
  /**
   * Loyiha hali qurilmaganmi.
   *
   * Shunday bo'lsa, hook o'zi birinchi qurishni boshlaydi: mijoz
   * g'oyasini yozgan va natijani kutyapti, undan yana bir tugma
   * bosishni so'rash ortiqcha to'siq.
   */
  needsFirstBuild: boolean;
  /** Sahifa ochilganda ko'rsatiladigan oldingi xabarlar. */
  initialEntries?: TimelineEntry[];
  onFinished?: () => void;
}

/**
 * Agent oqimini boshqaradi.
 *
 * Nega hook: oqim mantiqi (kadrlarni yig'ish, matnni birlashtirish,
 * balansni yangilash) komponentdan mustaqil va alohida testlanadi.
 * Komponent faqat ko'rsatadi.
 */
export function useAgentRun({
  projectId,
  initialBalance,
  needsFirstBuild,
  initialEntries = [],
  onFinished,
}: UseAgentRunOptions) {
  const [entries, setEntries] = useState<TimelineEntry[]>(initialEntries);
  const [balance, setBalance] = useState<Balance>(initialBalance);
  const [busy, setBusy] = useState(false);
  const streamingId = useRef<string | null>(null);

  /**
   * Agent tekkan fayl yo'llari — oqim tartibida.
   *
   * Nega alohida holat, `entries` ichidan ajratib olinmaydi: qatorlar
   * MIJOZ uchun tayyorlangan matn («app/index.tsx (+12 / −0)»), undan
   * yo'lni qayta ajratib olish matn shaklini kod panelining ishlashiga
   * bog'lab qo'yardi. Qator matni o'zgarganda panel jimgina buzilardi.
   *
   * Takror yo'l qo'shilaveradi: kod paneli OXIRGI tekkan faylni ochadi,
   * shuning uchun bir fayl ikki marta tahrirlansa u yana ochilishi kerak.
   */
  const [changedPaths, setChangedPaths] = useState<string[]>([]);

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

  /** Ikkala oqim (suhbat va birinchi qurish) uchun umumiy ishlovchi. */
  const handleEvent = useCallback(
    (event: AgentEvent) => {
      if (event.type === "text") {
        appendText(event.delta);
        return;
      }
      if (event.type === "charge") {
        setBalance((prev) => applyCharge(prev, event.units));
      }
      if (event.type === "file.changed") {
        setChangedPaths((prev) => [...prev, event.path]);
      }
      if (event.type === "run.finished") {
        onFinished?.();
      }

      const entry = toTimelineEntry(event);
      if (entry) push(entry);
    },
    [appendText, push, onFinished],
  );

  const send = useCallback(
    async (text: string, designMode: boolean) => {
      if (busy || !text.trim()) return;

      setBusy(true);
      streamingId.current = null;
      push({ id: crypto.randomUUID(), kind: "user", text });

      try {
        // Ikkala oqim ham AYNAN bitta ishlovchidan o'tadi. Ilgari bu yerda
        // o'sha mantiq qo'lda takrorlangan edi va yangi hodisa turi
        // qo'shilganda faqat bitta joyda ishlab, ikkinchisida jimgina
        // tushib qolardi.
        await api.agent.stream({ projectId, text, designMode }, handleEvent);
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
    [busy, projectId, push, handleEvent],
  );

  /**
   * Birinchi qurishni boshlaydi.
   *
   * `useRef` bilan qo'riqlanadi: React 19 development rejimida effektni
   * ikki marta ishga tushiradi, ikkinchi chaqiruv esa serverda 409 olardi
   * va mijoz xato ko'rardi.
   */
  const buildStarted = useRef(false);

  useEffect(() => {
    if (!needsFirstBuild || buildStarted.current) return;
    buildStarted.current = true;

    setBusy(true);
    streamingId.current = null;

    void api.agent
      .buildFirst(projectId, (event: AgentEvent) => handleEvent(event))
      .catch((err: unknown) =>
        push({
          id: crypto.randomUUID(),
          kind: "error",
          text: err instanceof Error ? err.message : "Ilovani qurib bo'lmadi.",
        }),
      )
      .finally(() => setBusy(false));
  }, [needsFirstBuild, projectId, handleEvent, push]);

  return { entries, balance, busy, changedPaths, send };
}

/**
 * Hisobni balansga qo'llaydi.
 *
 * Avval `used` `remaining` dan hisoblanardi: `used = included - remaining`.
 * Bu noto'g'ri edi, chunki `remaining` qo'shimcha sotib olingan
 * o'zgarishlarni ham qo'shadi. Natijada 10/10 sarflangan, lekin 5 ta
 * qo'shimchasi bor loyihada UI "10 tadan 5 tasi" deb ko'rsatardi.
 *
 * Endi server mantiqining aynan o'zi takrorlanadi: avval tarif qoldig'i,
 * keyin qo'shimchalar.
 */
function applyCharge(balance: Balance, units: number): Balance {
  if (units <= 0) return balance;

  return balance.used < balance.included
    ? { ...balance, used: balance.used + units }
    : { ...balance, extraUsed: balance.extraUsed + units };
}
