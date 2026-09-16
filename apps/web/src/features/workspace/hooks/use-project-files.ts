"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FileNode } from "@amb/contracts";
import { api } from "@/shared/api";

export interface UseProjectFilesOptions {
  projectId: string;
  /** Agent oqimida o'zgargan fayl yo'llari, oxirgisi eng yangi. */
  changedPaths: string[];
  busy: boolean;
}

export interface UseProjectFilesResult {
  nodes: FileNode[];
  selectedPath: string | null;
  content: string | null;
  treeLoading: boolean;
  fileLoading: boolean;
  /** Ikkala xato alohida: daraxt ochilmasa ham, ochiq fayl o'qilishi mumkin. */
  treeError: string | null;
  fileError: string | null;
  select: (path: string) => void;
}

// Xato matni mijoz tilida: nima bo'ldi va endi nima qilish kerak. Server
// xabari bu yerga chiqmaydi — u texnik va mijozni qo'rqitadi.
const TREE_ERROR = "Fayllar ro'yxatini ochib bo'lmadi. Bir ozdan keyin qayta urinib ko'ring.";
const FILE_ERROR = "Bu faylni ochib bo'lmadi. Boshqa fayl tanlang yoki qayta urinib ko'ring.";

/**
 * Loyiha fayllari: daraxt, tanlangan fayl va uning kodi.
 *
 * Nega hook: «qaysi faylni ko'rsatamiz» savoli ko'rinishdan mustaqil.
 * Unda uchta nozik qoida bor — avtomatik kuzatish, qo'lda tanlov va
 * keshni bekor qilish — komponent ichida ular har ko'rinish
 * o'zgarishida qayta sinashni talab qilardi.
 */
export function useProjectFiles({
  projectId,
  changedPaths,
  busy,
}: UseProjectFilesOptions): UseProjectFilesResult {
  const [nodes, setNodes] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [treeLoading, setTreeLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [treeError, setTreeError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // `manual`: mijoz o'zi fayl tanladimi — shundan keyin ekran sakramaydi.
  const cache = useRef(new Map<string, string>());
  const manual = useRef(false);
  const wasBusy = useRef(busy);
  const [reload, setReload] = useState(0);

  // Nega ro'yxat ref'da: `changedPaths` har renderda yangi massiv bo'lib
  // keladi va effekt bog'liqligida cheksiz takrorlanishga olib kelardi.
  // Shuning uchun effekt UZUNLIKKA qaraydi, qiymatni esa ref beradi.
  const changedRef = useRef(changedPaths);
  changedRef.current = changedPaths;
  const changedCount = changedPaths.length;

  // Daraxt har o'zgarishdan keyin qayta olinadi — yangi fayl ham ko'rinsin.
  useEffect(() => {
    let cancelled = false;
    setTreeLoading(true);

    api.projects
      .files(projectId)
      .then((res) => {
        if (cancelled) return;
        setNodes(res.files);
        setTreeError(null);
      })
      .catch(() => {
        if (!cancelled) setTreeError(TREE_ERROR);
      })
      .finally(() => {
        if (!cancelled) setTreeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, changedCount]);

  // Agent tekkan faylning keshi eskirdi — uni majburan unutamiz, aks holda
  // mijoz o'zgarishdan OLDINGI kodni ko'rib turardi.
  useEffect(() => {
    if (changedCount === 0) return;
    for (const path of changedRef.current) cache.current.delete(path);
    setReload((value) => value + 1);

    if (manual.current) return;
    const last = changedRef.current[changedCount - 1];
    if (last) setSelectedPath(last);
  }, [changedCount]);

  // Yangi ish boshlanganda kuzatuv tiklanadi: so'rov yuborgan mijoz aynan
  // agent nima yozayotganini ko'rmoqchi. Ish TUGAGANDA esa uning qo'lda
  // tanlagan fayli joyida qoladi.
  useEffect(() => {
    if (busy && !wasBusy.current) manual.current = false;
    wasBusy.current = busy;
  }, [busy]);

  useEffect(() => {
    if (!selectedPath) return;
    const cached = cache.current.get(selectedPath);
    if (cached !== undefined) {
      setContent(cached);
      setFileError(null);
      setFileLoading(false);
      return;
    }

    let cancelled = false;
    setFileLoading(true);

    api.projects
      .file({ projectId, path: selectedPath })
      .then((res) => {
        if (cancelled) return;
        cache.current.set(selectedPath, res.content);
        setContent(res.content);
        setFileError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setContent(null);
        setFileError(FILE_ERROR);
      })
      .finally(() => {
        if (!cancelled) setFileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, selectedPath, reload]);

  const select = useCallback((path: string) => {
    manual.current = true;
    setSelectedPath(path);
  }, []);

  return { nodes, selectedPath, content, treeLoading, fileLoading, treeError, fileError, select };
}
