import Link from "next/link";
import type { ReactElement } from "react";
import { remaining, type Balance } from "@amb/core-rules";
import { Button } from "@/shared/ui";

export interface WorkspaceTopBarProps {
  projectName: string;
  versionLabel: string;
  balance: Balance;
  onOpenOnPhone: () => void;
  onPublish: () => void;
}

/**
 * Workspace yuqori paneli.
 *
 * Nega past (`py-2.5`): ostidagi ish maydoni — telefon maketi va suhbat —
 * balandlikni `100dvh` dan hisoblaydi. Panelda yo'qotilgan har piksel
 * telefon ekranidan olinadi.
 *
 * Nega logotip `lg:hidden`: keng ekranda u chap ustunda (`ProjectsRail`)
 * turadi va bu yerda takrorlanishi shovqin. Rail 1024px dan tor ekranda
 * yashiringani uchun logotip o'sha yerda qaytadi — «RIVO» belgisi va
 * loyihalar ro'yxatiga chiqish yo'li hech qachon yo'qolmaydi.
 *
 * Qoldiq shu yerda, sozlamalar ichida emas: mijoz har amaldan oldin uni
 * ko'rib turishi kerak, aks holda tugaganda kutilmagan to'siqqa uriladi.
 *
 * «Do'konga chiqarish» — sahifadagi YAGONA gradient tugma: mahsulotning
 * yakuniy maqsadi. «Telefonda ochish» yordamchi amal va `secondary`
 * bo'lib qoladi.
 */
export function WorkspaceTopBar({
  projectName,
  versionLabel,
  balance,
  onOpenOnPhone,
  onPublish,
}: WorkspaceTopBarProps): ReactElement {
  /**
   * Qoldiqni `@amb/core-rules` hisoblaydi: u tarif ichidagi qoldiqqa
   * sotib olingan qo'shimchalarni qo'shadi. Qo'lda hisoblasak, qoida
   * ikki joyda yashaydi va biri kechikib qoladi.
   */
  const left = remaining(balance);
  const extraLeft = Math.max(0, balance.extraPurchased - balance.extraUsed);

  /**
   * Chiziq tarifni emas, jami sig'imni ko'rsatadi (tarif + qo'shimchalar).
   * Faqat tarif bo'yicha chizilsa, qo'shimcha sotib olgan mijozda chiziq
   * to'la, yonidagi raqam esa «qoldiq 5 ta» bo'lib qarama-qarshi chiqadi.
   */
  const capacity = balance.included + balance.extraPurchased;
  const usedPercent = capacity > 0 ? Math.min(100, ((capacity - left) / capacity) * 100) : 0;

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-line bg-surface px-5 py-2.5">
      <Link href="/loyihalarim" className="flex items-center gap-2.5 lg:hidden">
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-accent-from to-accent-to"
        />
        <span className="font-semibold tracking-tight">RIVO</span>
      </Link>

      <div className="flex min-w-0 items-baseline gap-2.5">
        <h1 className="min-w-0 truncate text-[15px] font-medium">{projectName}</h1>
        <span className="label-mono whitespace-nowrap">{versionLabel}</span>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2.5">
        {/* Raqam matn bilan yoziladi — chiziq faqat qo'shimcha ishora. */}
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface-alt px-3.5 py-1.5 text-sm">
          <span className="text-ink-faint">Qoldiq</span>
          <span className="font-medium whitespace-nowrap">{left} ta</span>
          <span aria-hidden className="h-1 w-12 overflow-hidden rounded-full bg-surface-high">
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: `${usedPercent}%` }}
            />
          </span>
          {extraLeft > 0 ? (
            <span className="hidden text-xs whitespace-nowrap text-ink-faint xl:inline">
              shundan {extraLeft} ta yonmaydi
            </span>
          ) : null}
        </div>

        <Button variant="secondary" size="sm" onClick={onOpenOnPhone}>
          Telefonda ochish
        </Button>
        <Button size="sm" onClick={onPublish}>
          Do&apos;konga chiqarish
        </Button>
      </div>
    </header>
  );
}
