"use client";

import { useEffect, useMemo, useState } from "react";
import type { FileNode } from "@amb/contracts";
import { buildFileTree, type TreeNode } from "../lib/build-file-tree";

export interface FileTreeProps {
  nodes: FileNode[];
  selectedPath: string | null;
  changedPaths: string[];
  onSelect: (path: string) => void;
}

/**
 * Fayl daraxti — mijoz agent nimaga tekkanini shu yerda ko'radi.
 *
 * Nega mono shrift va zich qatorlar: bu ro'yxat emas, kod muhiti. Fayl
 * nomlari mono shriftda tekis turadi va `index.tsx` bilan `_layout.tsx`
 * bir qarashda farqlanadi.
 */
export function FileTree({ nodes, selectedPath, changedPaths, onSelect }: FileTreeProps) {
  const tree = useMemo(() => buildFileTree(nodes), [nodes]);
  const changed = new Set(changedPaths);

  // `app/` va `src/` ochiq: mijozning ilovasi aynan shu yerda yashaydi,
  // qolgan papkalar (sozlama, ikonkalar) uni faqat chalg'itadi.
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(["app", "src"]));

  // Tanlangan fayl yopiq papka ichida qolsa, mijoz uni KO'RMAYDI — agent
  // avtomatik tanlaganda ham shunday. Shuning uchun ota papkalar ochiladi.
  useEffect(() => {
    if (!selectedPath) return;
    const parts = selectedPath.split("/").slice(0, -1);
    if (parts.length === 0) return;

    setOpen((prev) => {
      const folders = parts.map((_, index) => parts.slice(0, index + 1).join("/"));
      if (folders.every((folder) => prev.has(folder))) return prev;
      return new Set([...prev, ...folders]);
    });
  }, [selectedPath]);

  const toggle = (path: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(path)) next.add(path);
      return next;
    });

  return (
    <div className="px-1 font-mono text-[13px] leading-none">
      <Rows
        nodes={tree}
        depth={0}
        open={open}
        changed={changed}
        selectedPath={selectedPath}
        onToggle={toggle}
        onSelect={onSelect}
      />
    </div>
  );
}

interface RowsProps {
  nodes: TreeNode[];
  depth: number;
  open: ReadonlySet<string>;
  changed: ReadonlySet<string>;
  selectedPath: string | null;
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
}

/** O'zini chaqiradi — daraxt chuqurligi oldindan noma'lum. */
function Rows(props: RowsProps) {
  return (
    <>
      {props.nodes.map((node) => {
        const isOpen = props.open.has(node.path);
        const isSelected = node.path === props.selectedPath;
        const isChanged = props.changed.has(node.path);

        return (
          <div key={node.path}>
            <button
              type="button"
              onClick={() => (node.type === "dir" ? props.onToggle(node.path) : props.onSelect(node.path))}
              style={{ paddingLeft: props.depth * 12 + 8 }}
              className={`flex w-full items-center gap-1.5 rounded-md py-[5px] pr-2 text-left transition-colors ${
                isSelected ? "bg-surface-high text-ink" : "text-ink-muted hover:bg-surface-alt hover:text-ink"
              }`}
            >
              {node.type === "dir" ? <Chevron open={isOpen} /> : <FileMark name={node.name} />}
              <span className="truncate">{node.name}</span>
              {isChanged ? (
                <span className="ml-auto size-1.5 shrink-0 rounded-full bg-accent">
                  <span className="sr-only">o&apos;zgardi</span>
                </span>
              ) : null}
            </button>

            {node.type === "dir" && isOpen ? (
              <Rows {...props} nodes={node.children} depth={props.depth + 1} />
            ) : null}
          </div>
        );
      })}
    </>
  );
}

/** Papka belgisi — burchak. Yopiqda o'ngga, ochiqda pastga qaraydi. */
function Chevron({ open }: { open: boolean }) {
  const turn = open ? "rotate-90" : "";
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={`size-3 shrink-0 text-ink-faint ${turn}`}>
      <path d="M4.5 2.5 8.5 6 4.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Fayl turi — rang va ikki harf.
 *
 * Nega emoji emas: emoji har tizimda boshqacha chiziladi va mono
 * qatorning kengligini buzadi. Ikki harf esa har joyda bir xil turadi.
 */
const MARKS: Record<string, { label: string; className: string }> = {
  tsx: { label: "TX", className: "text-accent-soft" },
  ts: { label: "TS", className: "text-accent-soft" },
  jsx: { label: "JX", className: "text-accent" },
  js: { label: "JS", className: "text-accent" },
  json: { label: "{}", className: "text-success" },
  md: { label: "MD", className: "text-ink-muted" },
};

function FileMark({ name }: { name: string }) {
  const dot = name.lastIndexOf(".");
  const mark = MARKS[dot === -1 ? "" : name.slice(dot + 1).toLowerCase()];

  return (
    <span className={`w-4 shrink-0 text-[10px] ${mark?.className ?? "text-ink-faint"}`} aria-hidden="true">
      {mark?.label ?? "··"}
    </span>
  );
}
