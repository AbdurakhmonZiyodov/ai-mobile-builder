"use client";

import { useState, type ReactElement } from "react";
import { useProjectFiles } from "../hooks/use-project-files";
import { CodeViewer } from "./code-viewer";
import { FileTree } from "./file-tree";

export interface CodePanelProps {
  projectId: string;
  /** Agent oqimida o'zgargan fayl yo'llari, oxirgisi eng yangi. */
  changedPaths: string[];
  /** Agent hozir ishlayaptimi — daraxt "yozilmoqda" holatini ko'rsatadi. */
  busy: boolean;
}

/**
 * Kod paneli — mijoz agent yozayotgan kodni shu yerda ko'radi.
 *
 * Nega bu ekranda kod umuman ko'rsatiladi: mijoz kod yozmaydi, lekin
 * uning ilovasi HAQIQIY kod ekanini ko'rishi kerak. «Qora quti» ishonch
 * uyg'otmaydi — fayllar oqib o'tayotgani esa ish borayotganini isbotlaydi.
 *
 * Nega o'ng tomon `bg-paper`: redaktor maydoni panelning o'zidan
 * quyuqroq bo'lsa, ko'z kodni darhol ajratadi.
 */
export function CodePanel({ projectId, changedPaths, busy }: CodePanelProps): ReactElement {
  const files = useProjectFiles({ projectId, changedPaths, busy });
  // Tor ekranda daraxt kod ustida turadi va uni yig'ib qo'yish mumkin —
  // kod uchun butun ekran kerak bo'lganda. Keng ekranda doim ochiq.
  const [treeOpen, setTreeOpen] = useState(true);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex shrink-0 flex-col border-b border-line md:w-60 md:border-r md:border-b-0">
          <header className="flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm font-medium">
              Kod
              {busy ? (
                <span className="flex items-center gap-1.5 text-xs font-normal text-accent-soft">
                  <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
                  yozilmoqda…
                </span>
              ) : null}
            </span>
            <button
              type="button"
              onClick={() => setTreeOpen((value) => !value)}
              aria-expanded={treeOpen}
              className="rounded-full px-2 py-0.5 text-xs text-ink-faint transition-colors hover:text-ink md:hidden"
            >
              {treeOpen ? "Yashirish" : "Fayllar"}
            </button>
          </header>

          <div
            className={`${treeOpen ? "block" : "hidden"} max-h-56 min-h-0 flex-1 overflow-y-auto pb-2 md:block md:max-h-none`}
          >
            <TreeArea files={files} changedPaths={changedPaths} />
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <CodeViewer
            path={files.selectedPath}
            content={files.content}
            loading={files.fileLoading}
            error={files.fileError}
          />
        </div>
      </div>
    </div>
  );
}

interface TreeAreaProps {
  files: ReturnType<typeof useProjectFiles>;
  changedPaths: string[];
}

/** Daraxt o'rnida to'rt holat bo'lishi mumkin — har biri ochiq aytiladi. */
function TreeArea({ files, changedPaths }: TreeAreaProps) {
  if (files.treeError) {
    return <p className="px-3 py-2 text-xs leading-relaxed text-danger">{files.treeError}</p>;
  }

  if (files.nodes.length === 0) {
    return (
      <p className="px-3 py-2 text-xs leading-relaxed text-ink-faint">
        {files.treeLoading
          ? "Fayllar ochilmoqda…"
          : "Fayllar hali yo'q. Birinchi fayllar yozilgach, shu yerda paydo bo'ladi."}
      </p>
    );
  }

  return (
    <FileTree
      nodes={files.nodes}
      selectedPath={files.selectedPath}
      changedPaths={changedPaths}
      onSelect={files.select}
    />
  );
}
