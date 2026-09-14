"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiPost } from "@/lib/api";

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await apiPost<{ projectId: string }>("/projects", { name, prompt, blocks: [] });
      router.push(`/projects/${res.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-[color:var(--color-line)] p-5">
      <h2 className="text-xl font-semibold">Yangi ilova</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ilova nomi — masalan: Barber Pro"
        required
        minLength={2}
        className="w-full rounded-lg border border-[color:var(--color-line)] px-3 py-2"
      />

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Biznesingizni bir-ikki jumlada ayting. Masalan: sartaroshxonam bor, mijozlar telefondan navbat olsin va eslatma kelsin."
        required
        minLength={3}
        rows={4}
        className="w-full rounded-lg border border-[color:var(--color-line)] px-3 py-2"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-[color:var(--color-brand)] px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {busy ? "Yaratilyapti…" : "Boshlash — bepul"}
      </button>

      <p className="text-sm text-[color:var(--color-muted)]">
        Sinov tarifida design mode va preview cheksiz. Build uchun to'lov kerak.
      </p>
    </form>
  );
}
