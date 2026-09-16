"use client";

import { useMemo } from "react";
import { langFromPath, tokenize, type TokenKind } from "../lib/highlight";

export interface CodeViewerProps {
  path: string | null;
  content: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Nega chegara bor: 5000 qatorli faylni bo'yash brauzerni bir necha
 * soniyaga muzlatadi. 2000 qator ekranga baribir sig'maydi, lekin
 * mijozga fayl qanchaligini ko'rsatish uchun yetadi.
 */
const MAX_LINES = 2000;

/** Ranglar FAQAT dizayn tokenlaridan — bu yerda birorta hex yo'q. */
const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: "text-ink",
  keyword: "text-accent-soft",
  string: "text-success",
  comment: "text-ink-faint italic",
  number: "text-accent",
  tag: "text-accent-soft",
  attr: "text-ink-muted",
  fn: "text-ink",
  punct: "text-ink-muted",
};

/**
 * Kod ko'ruvchi.
 *
 * Nega uzun qator O'RALMAYDI (`whitespace-pre` + gorizontal aylantirish):
 * o'ralgan kodda qator raqami bilan matn bir-biriga tushmay qoladi va
 * kirish (indent) buziladi — kod shu zahoti o'qilmay qoladi.
 */
export function CodeViewer({ path, content, loading, error }: CodeViewerProps) {
  const lines = useMemo(
    () => (path === null || content === null ? [] : tokenize(content, langFromPath(path))),
    [path, content],
  );
  const shown = lines.length > MAX_LINES ? lines.slice(0, MAX_LINES) : lines;

  return (
    <div className="flex h-full min-w-0 flex-col bg-paper">
      <header className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <span className="truncate font-mono text-xs text-ink-muted">
          {path ?? "Fayl tanlanmagan"}
        </span>
        {lines.length > 0 ? (
          <span className="shrink-0 font-mono text-[11px] text-ink-faint">{lines.length} qator</span>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        <Body path={path} loading={loading} error={error} shown={shown} />
      </div>

      {lines.length > MAX_LINES ? (
        <p className="border-t border-line bg-accent-surface px-3 py-2 text-xs text-accent-soft">
          Fayl uzun — birinchi {MAX_LINES} qatori ko&apos;rsatildi.
        </p>
      ) : null}
    </div>
  );
}

interface BodyProps extends Omit<CodeViewerProps, "content"> {
  shown: ReturnType<typeof tokenize>;
}

function Body({ path, loading, error, shown }: BodyProps) {
  if (error) return <p className="px-4 py-5 text-sm text-danger">{error}</p>;
  if (loading) return <Skeleton />;

  if (path === null) {
    return (
      <p className="px-4 py-5 text-sm leading-relaxed text-ink-faint">
        Ro&apos;yxatdan fayl tanlang. Agent yozayotgan fayl esa o&apos;zi ochiladi.
      </p>
    );
  }

  return (
    <pre className="w-max min-w-full py-2 font-mono text-[12.5px] leading-[1.6]">
      {shown.map((tokens, index) => (
        <div key={index} className="flex">
          {/* Raqam yopishib turadi: gorizontal aylantirilganda ham qaysi
              qatorda ekaningiz ko'rinib qoladi. */}
          <span className="sticky left-0 w-12 shrink-0 select-none bg-paper pr-3 text-right text-ink-faint">
            {index + 1}
          </span>
          <code className="whitespace-pre pr-6">
            {tokens.length === 0
              ? " "
              : tokens.map((token, position) => (
                  <span key={position} className={TOKEN_CLASS[token.kind]}>
                    {token.text}
                  </span>
                ))}
          </code>
        </div>
      ))}
    </pre>
  );
}

/** Yuklanish paytida bo'sh ekran emas, kod SHAKLI ko'rsatiladi. */
function Skeleton() {
  return (
    <div className="space-y-2 px-4 py-4">
      {[64, 40, 52, 30, 58, 44].map((width, index) => (
        <div
          key={index}
          style={{ width: `${width}%` }}
          className="h-3 animate-pulse rounded bg-surface-alt"
        />
      ))}
    </div>
  );
}
