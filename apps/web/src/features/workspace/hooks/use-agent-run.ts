"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentEvent, RunPhase } from "@amb/contracts";
import type { Balance } from "@amb/core-rules";
import { api } from "@/shared/api";
import { activityLabelUz, phaseFor, toTimelineEntry, type TimelineEntry } from "../timeline";

/** Ayni paytda bajarilayotgan harakat — tarixga yozilmaydi, o'rniga almashadi. */
export interface CurrentActivity {
  labelUz: string;
  /** Shu harakat ketma-ket necha marta takrorlandi. */
  repeat: number;
}

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

  /**
   * Jarayon holati.
   *
   * NEGA KERAK. Mijoz oqimda «Kodni o'qiyapman…» ni ketma-ket besh marta
   * ko'rardi va na qaysi bosqichda ekanini, na ish tugaganini bilardi.
   * Uchta holat shu savolga javob beradi: qaysi BOSQICH, hozir NIMA
   * qilinyapti, QANCHA vaqt o'tdi.
   *
   * `reached` — o'tilgan bosqichlar. Bosqich orqaga qaytishi mumkin
   * (yozgandan keyin yana o'qish), shuning uchun «hozirgi» dan tashqari
   * «o'tilgan» ro'yxati alohida saqlanadi — aks holda ko'rsatkichdagi
   * belgilar oldinga-orqaga sakrardi.
   */
  const [phase, setPhase] = useState<RunPhase | null>(null);
  const [reached, setReached] = useState<RunPhase[]>([]);
  const [activity, setActivity] = useState<CurrentActivity | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number | null>(null);

  /**
   * Soat. Faqat ish ketayotganda yuradi.
   *
   * Nega har soniyada: mijoz uchun «harakat bor» signalining o'zi muhim —
   * agent uzoq o'ylayotganda ekranda hech narsa o'zgarmasa, u sahifa
   * qotib qolgan deb o'ylaydi.
   */
  useEffect(() => {
    if (startedAt === null) return;

    setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    const timer = setInterval(
      () => setElapsedSec(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, [startedAt]);

  /**
   * Shu ishda birorta fayl o'zgardimi.
   *
   * NEGA REF, holat emas: qiymat `handleEvent` ichida darhol o'qilishi
   * kerak, React esa holat yangilanishini keyingi renderga qoldiradi —
   * `run.finished` kelganda holat hali eski bo'lardi.
   */
  const touchedFiles = useRef(false);

  /** Yangi ish boshlanishi — oldingi ishning holati tozalanadi. */
  const beginRun = useCallback(() => {
    touchedFiles.current = false;
    setPhase("understanding");
    setReached(["understanding"]);
    setActivity(null);
    setStartedAt(Date.now());
    setBusy(true);
    streamingId.current = null;
  }, []);

  /**
   * Ish tugadi. `startedAt` tozalanadi — soat to'xtaydi.
   *
   * `ok` ataylab argument: oqim xato bilan uzilsa, server `run.finished`
   * hodisasini umuman yubormaydi va bosqich oxirgi holatida qotib qoladi.
   * Uni ko'r-ko'rona «Tayyor» deb belgilash yolg'on bo'lardi — mahsulotning
   * butun va'dasi ishonchda.
   */
  const endRun = useCallback((ok: boolean) => {
    setBusy(false);
    setActivity(null);
    setStartedAt(null);
    setPhase((prev) => {
      if (prev === "done" || prev === "failed") return prev;
      return ok ? "done" : "failed";
    });
  }, []);

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
      const next = phaseFor(event);
      if (next) {
        setPhase(next);
        setReached((prev) => (prev.includes(next) ? prev : [...prev, next]));
      }

      /*
       * Takroriy harakat yangi qator ochmaydi, hisoblagichni oshiradi:
       * «Kodni o'qiyapman ×5». Besh alohida qator bir xil ko'rinadi va
       * mijozning o'z savolini ekrandan surib yuboradi.
       */
      const label = activityLabelUz(event);
      if (label) {
        setActivity((prev) =>
          prev && prev.labelUz === label
            ? { labelUz: label, repeat: prev.repeat + 1 }
            : { labelUz: label, repeat: 1 },
        );
      }

      if (event.type === "file.changed") {
        touchedFiles.current = true;
        setChangedPaths((prev) => [...prev, event.path]);
      }

      /*
       * Preview FAQAT fayl o'zgarganda qayta yig'iladi.
       *
       * Ilgari u har ish oxirida ishga tushardi — hatto bepul savolda
       * ham. Mijoz «tugma qayerda?» deb so'raganida ilovasi sakkiz
       * soniya «Yig'ilmoqda…» bo'lib turardi va u nimadir o'zgarganini
       * o'ylardi. Hech narsa o'zgarmagan bo'lsa, qayta yig'ishning
       * natijasi ham aynan eskisi bo'ladi.
       */
      if (event.type === "run.finished" && touchedFiles.current) {
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

      beginRun();
      push({ id: crypto.randomUUID(), kind: "user", text });

      try {
        // Ikkala oqim ham AYNAN bitta ishlovchidan o'tadi. Ilgari bu yerda
        // o'sha mantiq qo'lda takrorlangan edi va yangi hodisa turi
        // qo'shilganda faqat bitta joyda ishlab, ikkinchisida jimgina
        // tushib qolardi.
        await api.agent.stream({ projectId, text, designMode }, handleEvent);
        endRun(true);
      } catch (err) {
        push({
          id: crypto.randomUUID(),
          kind: "error",
          text: err instanceof Error ? err.message : "Oqim uzildi.",
        });
        endRun(false);
      }
    },
    [busy, projectId, push, handleEvent, beginRun, endRun],
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

    beginRun();

    void api.agent
      .buildFirst(projectId, (event: AgentEvent) => handleEvent(event))
      .then(() => endRun(true))
      .catch((err: unknown) => {
        push({
          id: crypto.randomUUID(),
          kind: "error",
          text: err instanceof Error ? err.message : "Ilovani qurib bo'lmadi.",
        });
        endRun(false);
      });
  }, [needsFirstBuild, projectId, handleEvent, push, beginRun, endRun]);

  return { entries, balance, busy, changedPaths, phase, reached, activity, elapsedSec, send };
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
