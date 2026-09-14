interface Balance {
  included: number;
  used: number;
  extraPurchased: number;
  extraUsed: number;
}

/**
 * Qoldiq ko'rsatkichi — spek 5.2.
 * "100 kredit" emas, "10 tadan 4 tasi ishlatildi". Non-tech mijoz shuni tushunadi.
 */
export function BalanceMeter({ balance }: { balance: Balance }) {
  const extraLeft = Math.max(0, balance.extraPurchased - balance.extraUsed);
  const planLeft = Math.max(0, balance.included - balance.used);
  const pct = balance.included > 0 ? Math.min(100, (balance.used / balance.included) * 100) : 0;

  return (
    <div className="rounded-lg border border-[color:var(--color-line)] p-3 text-sm">
      <div className="flex justify-between">
        <span className="font-medium">O&apos;zgarishlar</span>
        <span className="text-[color:var(--color-muted)]">
          {balance.included} tadan {balance.used} tasi ishlatildi
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-[color:var(--color-surface)]">
        <div className="h-1.5 rounded-full bg-[color:var(--color-brand)]" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[color:var(--color-muted)]">
        Qoldiq {planLeft}
        {extraLeft > 0 ? ` · qo'shimcha ${extraLeft} ta (yonmaydi)` : ""}
      </p>
      <p className="mt-1 text-xs text-[color:var(--color-muted)]">
        Savol — 0. Xato tuzatish — 0. Tekshiruvdan o&apos;tmasa — 0.
      </p>
    </div>
  );
}
