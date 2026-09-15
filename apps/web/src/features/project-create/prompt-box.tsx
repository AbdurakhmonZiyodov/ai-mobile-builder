"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui";
import { api, ApiRequestError } from "@/shared/api";

/**
 * Promptdan boshlanish — mahsulotning kirish nuqtasi.
 *
 * Mijozdan HECH QANDAY texnik savol so'ralmaydi: na platforma, na blok,
 * na SDK. U faqat biznesini o'z tilida aytadi, qolganini biz taxmin
 * qilamiz va sababini tushuntiramiz.
 *
 * Nomni ham so'ramaymiz — birinchi jumladan yasaymiz. Har qo'shimcha
 * maydon boshlanishdagi to'siq va mijozning bir qismini yo'qotadi.
 *
 * Ko'rinishi: quyuq karta, ichida undan ham quyuqroq maydon. Fokusda
 * chegara aksentga aylanadi — bu sahifadagi yagona gradient tugma
 * bilan bir juftlik hosil qiladi.
 */
export function PromptBox() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = prompt.trim();
    if (text.length < 10 || busy) return;

    setBusy(true);
    setError(null);

    try {
      // Nom yuborilmaydi — server uni aniqlangan sohadan yasaydi.
      const result = await api.projects.create({
        prompt: text,
        blocks: [],
        locale: "uz",
      });
      router.push(`/loyiha/${result.projectId}`);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.messageUz : "Ulanib bo'lmadi.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/40"
    >
      <label htmlFor="prompt" className="sr-only">
        Qanday ilova kerak?
      </label>

      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Sartaroshxonam bor, mijozlar telefondan navbat olsin va eslatma kelsin…"
        className="w-full resize-none rounded-xl bg-surface-alt px-4 py-3.5 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint outline-none"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 pb-1">
        <span className="text-sm text-ink-faint">
          Birinchi natija ~90 soniya · Bepul
        </span>
        <Button type="submit" disabled={busy || prompt.trim().length < 10}>
          {busy ? "Tayyorlanmoqda…" : "Ekranlarni ko'rsat"}
        </Button>
      </div>

      {error ? (
        <p className="mx-2 mt-2 rounded-lg bg-danger-surface px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}

