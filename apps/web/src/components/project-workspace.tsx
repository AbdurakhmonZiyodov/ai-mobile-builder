"use client";

import { useCallback, useRef, useState } from "react";
import { apiGet, streamChat } from "@/lib/api";
import { BalanceMeter } from "@/components/balance-meter";

interface Balance {
  included: number;
  used: number;
  extraPurchased: number;
  extraUsed: number;
}

interface Project {
  id: string;
  name: string;
  sdk: number;
  domainPack: string | null;
  blocks: string[];
  previewPath: string;
  previewUrl: string | null;
  balance: Balance;
}

interface PreviewDecision {
  path: string;
  reasonUz: string;
  fallback: string;
}

interface TimelineEntry {
  id: number;
  kind: "user" | "agent" | "system" | "file" | "verify" | "charge" | "error";
  text: string;
}

let nextId = 0;

export function ProjectWorkspace({
  project,
  preview,
}: {
  project: Project;
  preview: PreviewDecision | null;
}) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [designMode, setDesignMode] = useState(false);
  const [balance, setBalance] = useState<Balance>(project.balance);
  const [files, setFiles] = useState<Array<{ path: string; type: string }>>([]);
  const agentBuffer = useRef<number | null>(null);

  const push = useCallback((kind: TimelineEntry["kind"], text: string) => {
    setEntries((prev) => [...prev, { id: nextId++, kind, text }]);
  }, []);

  const appendAgentText = useCallback((delta: string) => {
    setEntries((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.kind === "agent" && last.id === agentBuffer.current) {
        return [...prev.slice(0, -1), { ...last, text: last.text + delta }];
      }
      const entry: TimelineEntry = { id: nextId++, kind: "agent", text: delta };
      agentBuffer.current = entry.id;
      return [...prev, entry];
    });
  }, []);

  const refreshFiles = useCallback(async () => {
    try {
      const res = await apiGet<{ files: Array<{ path: string; type: string }> }>(
        `/projects/${project.id}/files`,
      );
      setFiles(res.files.filter((f) => f.type === "file"));
    } catch {
      // fayl daraxti muhim emas, oqimni to'xtatmaymiz
    }
  }, [project.id]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setBusy(true);
    agentBuffer.current = null;
    push("user", text);

    try {
      await streamChat({ projectId: project.id, text, designMode }, (event) => {
        const type = String(event.type);

        if (type === "run.classified") {
          push("system", String(event.summaryUz));
        } else if (type === "clarify") {
          push("agent", String(event.questionUz));
        } else if (type === "text") {
          appendAgentText(String(event.delta));
        } else if (type === "tool.started") {
          push("system", `${labelForTool(String(event.tool))}…`);
        } else if (type === "file.changed") {
          push("file", `${event.path} (+${event.added} / -${event.removed})`);
        } else if (type === "verify.started") {
          push("verify", `${labelForVerify(String(event.step))}…`);
        } else if (type === "verify.finished") {
          const ok = Boolean(event.ok);
          const errors = Array.isArray(event.errors) ? (event.errors as string[]) : [];
          push(
            ok ? "verify" : "error",
            ok
              ? `${labelForVerify(String(event.step))}: o'tdi`
              : `${labelForVerify(String(event.step))}: o'tmadi\n${errors.slice(0, 3).join("\n")}`,
          );
        } else if (type === "repair.attempt") {
          push("system", `Xatoni tuzatyapman (${event.attempt}/${event.max}) — bu bepul`);
        } else if (type === "repair.gaveUp") {
          push("error", String(event.messageUz));
        } else if (type === "charge") {
          push("charge", String(event.balanceLabelUz) + " · " + String(event.reasonUz));
          setBalance((b) => ({ ...b, used: b.included - Number(event.remaining ?? b.included) }));
        } else if (type === "error") {
          push("error", String(event.messageUz));
        } else if (type === "run.finished") {
          void refreshFiles();
        }
      });
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Oqim uzildi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-[color:var(--color-muted)]">
            Expo SDK {project.sdk}
            {project.domainPack ? ` · ${project.domainPack}` : ""}
            {project.blocks.length ? ` · ${project.blocks.length} blok` : ""}
          </p>
        </header>

        <div className="min-h-[340px] space-y-2 rounded-xl border border-[color:var(--color-line)] p-4">
          {entries.length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted)]">
              Nima qilishni yozing. Masalan: &laquo;Bosh sahifaga xizmatlar ro&apos;yxatini
              qo&apos;sh&raquo;. Savol bersangiz bepul javob beraman.
            </p>
          ) : null}

          {entries.map((entry) => (
            <div key={entry.id} className={rowClass(entry.kind)}>
              <span className="mr-2 shrink-0 text-xs uppercase opacity-60">
                {labelForKind(entry.kind)}
              </span>
              <span className="whitespace-pre-wrap">{entry.text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="space-y-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Nima o'zgartiraylik?"
            className="w-full rounded-lg border border-[color:var(--color-line)] px-3 py-2"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-[color:var(--color-brand)] px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {busy ? "Ishlayapman…" : "Yuborish"}
            </button>
            <label className="flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
              <input
                type="checkbox"
                checked={designMode}
                onChange={(e) => setDesignMode(e.target.checked)}
              />
              Design mode (bepul, kod o&apos;zgarmaydi)
            </label>
          </div>
        </form>
      </section>

      <aside className="space-y-4">
        <BalanceMeter balance={balance} />

        {preview ? (
          <div className="rounded-lg border border-[color:var(--color-line)] p-3 text-sm">
            <p className="font-medium">Preview: {preview.path}</p>
            <p className="mt-1 text-[color:var(--color-muted)]">{preview.reasonUz}</p>
          </div>
        ) : null}

        <div className="rounded-lg border border-[color:var(--color-line)] p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Fayllar</span>
            <button
              type="button"
              onClick={refreshFiles}
              className="text-xs text-[color:var(--color-brand)]"
            >
              Yangilash
            </button>
          </div>
          <ul className="mt-2 max-h-72 overflow-auto font-mono text-xs text-[color:var(--color-muted)]">
            {files.map((f) => (
              <li key={f.path}>{f.path}</li>
            ))}
            {files.length === 0 ? <li>Yangilash tugmasini bosing</li> : null}
          </ul>
        </div>
      </aside>
    </main>
  );
}

function rowClass(kind: TimelineEntry["kind"]): string {
  const base = "flex rounded-md px-2 py-1.5 text-sm";
  switch (kind) {
    case "user":
      return `${base} bg-[color:var(--color-surface)] font-medium`;
    case "error":
      return `${base} bg-red-50 text-red-700`;
    case "charge":
      return `${base} bg-blue-50 text-blue-800`;
    case "file":
      return `${base} font-mono text-xs text-[color:var(--color-muted)]`;
    case "verify":
    case "system":
      return `${base} text-[color:var(--color-muted)]`;
    default:
      return base;
  }
}

function labelForKind(kind: TimelineEntry["kind"]): string {
  switch (kind) {
    case "user":
      return "siz";
    case "agent":
      return "agent";
    case "file":
      return "fayl";
    case "verify":
      return "tekshiruv";
    case "charge":
      return "hisob";
    case "error":
      return "xato";
    default:
      return "";
  }
}

/** Texnik atamalarni mijoz tiliga aylantiramiz (spek 15.2). */
function labelForTool(tool: string): string {
  switch (tool) {
    case "read_file":
      return "Kodni o'qiyapman";
    case "search_files":
      return "Kerakli joyni qidiryapman";
    case "edit_file":
      return "Tahrirlayapman";
    case "create_file":
      return "Yangi fayl yaratyapman";
    case "list_files":
      return "Loyihani ko'ryapman";
    case "delete_file":
      return "Keraksiz faylni olib tashlayapman";
    default:
      return tool;
  }
}

function labelForVerify(step: string): string {
  switch (step) {
    case "typecheck":
      return "Kodni tekshiryapman";
    case "lint":
      return "Qoidalarga moslikni tekshiryapman";
    case "bundle":
      return "Ilovani yig'yapman";
    default:
      return step;
  }
}
