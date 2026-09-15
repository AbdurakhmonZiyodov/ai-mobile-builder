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
      const result = await api.projects.create({
        name: deriveName(text),
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
    <form onSubmit={submit} className="rounded-xl border border-line bg-surface p-5">
      <label htmlFor="prompt" className="block text-lg font-semibold">
        Qanday ilova kerak?
      </label>

      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Sartaroshxonam bor, mijozlar telefondan navbat olsin va eslatma kelsin…"
        className="mt-3 w-full resize-none rounded-lg border border-line bg-surface-alt px-3.5 py-3 text-[15px] outline-none focus:border-ink"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-ink-faint">
          O&apos;z tilingizda yozing · Birinchi natija ~90 soniya · Bepul
        </span>
        <Button type="submit" disabled={busy || prompt.trim().length < 10}>
          {busy ? "Tayyorlanmoqda…" : "Ekranlarni ko'rsat"}
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
    </form>
  );
}

/**
 * Birinchi jumladan ilova nomini yasaydi.
 *
 * Nega taxmin: mijozdan nom so'rash uni to'xtatadi — u hali nom
 * o'ylamagan. Nomni keyin bir bosishda o'zgartira oladi.
 */
function deriveName(prompt: string): string {
  const firstWords = prompt
    .split(/[\s,.!?]+/)
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");
  const name = firstWords.charAt(0).toUpperCase() + firstWords.slice(1);
  return name.length >= 2 ? name.slice(0, 60) : "Yangi ilova";
}
