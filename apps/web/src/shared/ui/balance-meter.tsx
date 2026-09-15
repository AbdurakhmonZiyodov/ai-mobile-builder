import type { Balance } from "@amb/core-rules";

/**
 * Qoldiq ko'rsatkichi.
 *
 * «100 kredit» emas, «10 tadan 4 tasi ishlatildi». Non-tech mijoz
 * kreditni tushunmaydi va uni sarflashdan qo'rqadi — bozordagi eng keng
 * tarqalgan shikoyat aynan shu haqida.
 *
 * Progress chizig'i gradient: bu sahifadagi kam sonli gradientlardan
 * biri va u ataylab — mijoz ko'zi eng avval shu chiziqqa tushishi
 * kerak. Raqam esa chiziqdan mustaqil o'qiladi, faqat rangga tayanmaydi.
 *
 * Pastdagi qator ham majburiy: mijoz nima BEPUL ekanini doim ko'rib
 * turishi kerak, aks holda savol berishdan ham qo'rqadi.
 */
export function BalanceMeter({ balance }: { balance: Balance }) {
  const planLeft = Math.max(0, balance.included - balance.used);
  const extraLeft = Math.max(0, balance.extraPurchased - balance.extraUsed);
  const percent = balance.included > 0 ? Math.min(100, (balance.used / balance.included) * 100) : 0;

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 text-sm">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium">O&apos;zgarishlar</span>
        <span className="label-mono">
          {balance.included} tadan {balance.used} tasi
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-high">
        <div
          className="h-full rounded-full bg-linear-to-r from-accent-from via-accent-via to-accent-to"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-ink-muted">
        Qoldiq {planLeft}
        {extraLeft > 0 ? ` · qo'shimcha ${extraLeft} ta (yonmaydi)` : ""}
      </p>

      <p className="mt-1.5 text-xs text-ink-faint">
        Savol — 0 · Xato tuzatish — 0 · Tekshiruvdan o&apos;tmasa — 0
      </p>
    </div>
  );
}
