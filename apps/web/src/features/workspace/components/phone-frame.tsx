import type { ReactNode } from "react";

/**
 * Telefon ramkasi — ilova MARKAZDA turadi.
 *
 * Dizayn qarori: raqobatchilarda chat markazda, ilova yon panelda.
 * Bizda teskarisi. Sabab: mijoz chat bilan emas, ILOVASI bilan
 * qiziqadi. Chat — vosita, natija emas.
 */
export function PhoneFrame({ children, statusUz }: { children: ReactNode; statusUz?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {statusUz ? <p className="text-sm text-ink-muted">{statusUz}</p> : null}

      <div className="rounded-[32px] border-[6px] border-ink bg-surface p-0 shadow-sm">
        {/* 390×844 — iPhone 15 mantiqiy o'lchami. */}
        <div className="h-[844px] w-[390px] overflow-hidden rounded-[26px] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Preview hali tayyor bo'lmaganda ko'rsatiladigan holat. */
export function PhonePlaceholder({ messageUz }: { messageUz: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <p className="text-ink-muted">{messageUz}</p>
    </div>
  );
}
