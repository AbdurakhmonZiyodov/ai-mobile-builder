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
 */
export function WorkspaceTopBar({
  projectName,
  versionLabel,
  balance,
  onOpenOnPhone,
  onPublish,
}: TopBarProps) {
  const left = Math.max(0, balance.included - balance.used);
  const percent = balance.included > 0 ? (balance.used / balance.included) * 100 : 0;

  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-line bg-ink px-5 py-3 text-surface">
      <Link href="/loyihalarim" className="font-semibold tracking-tight">
        RIVO
      </Link>
      <span className="text-surface/80">{projectName}</span>
      <span className="label-mono !text-[11px] !text-surface/60">{versionLabel}</span>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2.5 rounded-lg bg-surface/10 px-3 py-1.5 text-sm">
          <span className="text-surface/70">Bu oy qoldiq</span>
          <span className="font-semibold">
            {left} / {balance.included}
          </span>
          <span className="h-1 w-12 rounded-full bg-surface/25">
            <span
              className="block h-1 rounded-full bg-accent-soft"
              style={{ width: `${Math.min(100, percent)}%` }}
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
