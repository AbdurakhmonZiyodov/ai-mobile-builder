"use client";

import type { ReactElement } from "react";

export interface PanelTab<T extends string> {
  id: T;
  labelUz: string;
}

export interface PanelTabsProps<T extends string> {
  tabs: PanelTab<T>[];
  value: T;
  onChange: (id: T) => void;
}

/**
 * Markaziy panel almashtirgichi — `[ Ko'rinish ][ Kod ]`.
 *
 * Nega generic: tab id'lari matn emas, tanlangan ro'yxatdan bo'lishi
 * kerak. `PanelTabs<"preview" | "code">` deb chaqirilsa, `onChange`
 * ham aynan shu ikki qiymatni qaytaradi va noto'g'ri id kompilyatsiyada
 * ushlanadi — ish paytida emas.
 *
 * Nega `<button>` va `aria-pressed`, `role="tablist"` emas: haqiqiy
 * tablist `aria-controls` va o'q tugmalari bilan boshqariladigan fokusni
 * talab qiladi. Bizda panel bitta va u almashtirgichdan ancha uzoqda —
 * yarim bajarilgan tablist ekran o'quvchiga soxta va'da beradi. Bosiladigan
 * ikki tugma esa klaviatura bilan tabdan o'tadi va holatini to'g'ri aytadi.
 *
 * Gradient yo'q: bu tanlov emas, ko'rinishni almashtirish. Sahifadagi
 * yagona gradient «Do'konga chiqarish» uchun saqlanadi.
 */
export function PanelTabs<T extends string>({
  tabs,
  value,
  onChange,
}: PanelTabsProps<T>): ReactElement {
  return (
    <div
      role="group"
      aria-label="Panel ko'rinishi"
      className="inline-flex items-center gap-0.5 rounded-full border border-line bg-surface-alt p-1"
    >
      {tabs.map((tab) => {
        const active = tab.id === value;

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              active ? "bg-surface-high text-ink" : "text-ink-faint hover:text-ink-muted"
            }`}
          >
            {tab.labelUz}
          </button>
        );
      })}
    </div>
  );
}
