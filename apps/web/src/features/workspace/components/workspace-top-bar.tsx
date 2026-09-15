import Link from "next/link";
import type { Balance } from "@amb/core-rules";
import { Button } from "@/shared/ui";

interface TopBarProps {
  projectName: string;
  versionLabel: string;
  balance: Balance;
  onOpenOnPhone: () => void;
  onPublish: () => void;
}

/**
 * Workspace yuqori paneli.
 *
 * Qoldiq shu yerda — mijoz har amaldan oldin uni ko'rib turishi kerak.
 * Sozlamalar ichida yashirilsa, u qancha qolganini bilmay ishlaydi va
 * tugaganda kutilmagan to'siqqa uriladi.
 *
 * «Do'konga chiqarish» — sahifadagi YAGONA gradient tugma. Bu
 * mahsulotning yakuniy maqsadi va u doim ko'rinib turishi kerak;
 * suhbatdagi «Yuborish» esa oq tugma bo'lib qoladi.
 *
 * Panel foni sahifadan quyuqroq emas, chegara bilan ajratiladi:
 * quyuq dizaynda qatlam soya bilan emas, chiziq bilan bo'linadi.
 */
export function WorkspaceTopBar({
  projectName,
  versionLabel,
  balance,
  onOpenOnPhone,
  onPublish,
}: TopBarProps) {
  const left = Math.max(0, balance.included - balance.used);
  const percent = balance.included > 0 ? Math.min(100, (balance.used / balance.included) * 100) : 0;

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line bg-surface px-5 py-3">
      <Link href="/loyihalarim" className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-accent-from to-accent-to"
        />
        <span className="font-semibold tracking-tight">RIVO</span>
      </Link>

      <span aria-hidden className="h-4 w-px bg-line-strong" />

      <span className="min-w-0 truncate text-ink-muted">{projectName}</span>
      <span className="label-mono">{versionLabel}</span>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface-alt px-3.5 py-1.5 text-sm">
          <span className="text-ink-faint">Bu oy qoldiq</span>
          <span className="font-medium">
            {left} / {balance.included}
          </span>
          <span className="h-1 w-12 overflow-hidden rounded-full bg-surface-high">
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: `${percent}%` }}
            />
          </span>
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
