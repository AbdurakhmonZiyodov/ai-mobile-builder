"use client";

import type { ReactElement } from "react";

export type DeviceId = "iphone" | "android" | "tablet";

export interface DeviceSpec {
  id: DeviceId;
  labelUz: string;
  /** Qurilma ekranining CSS px kengligi — iframe AYNAN shu kenglikda ochiladi. */
  width: number;
  /** Qurilma ekranining CSS px balandligi. */
  height: number;
  /** Ekran burchagining radiusi, o'sha qurilma px'ida. */
  radius: number;
}

/**
 * Qo'llab-quvvatlanadigan qurilma o'lchamlari.
 *
 * NEGA aynan bu raqamlar: bular haqiqiy qurilmalarning CSS piksel
 * (ya'ni "point") o'lchamlari — iPhone 15/16 → 393×852, o'rtacha
 * Android flagman → 412×915, 11" planshet → 820×1180. Ilova AYNAN shu
 * kenglikda ochilsa, undagi shrift va oraliqlar haqiqiy telefondagidek
 * chiqadi. Qo'lda "chiroyli" raqam tanlash mijozni chalg'itadi: ekran
 * to'g'ri ko'rinadi, lekin qurilmada boshqacha bo'ladi.
 *
 * HALOLLIK: bu tanlov FAQAT ramka o'lchamini o'zgartiradi. Biz iOS yoki
 * Android simulyatorini va'da qilmaymiz — shuning uchun guruh yorlig'i
 * "Qurilma o'lchami", "Platforma" emas.
 */
export const DEVICES: Record<DeviceId, DeviceSpec> = {
  iphone: { id: "iphone", labelUz: "iPhone", width: 393, height: 852, radius: 47 },
  android: { id: "android", labelUz: "Android", width: 412, height: 915, radius: 36 },
  tablet: { id: "tablet", labelUz: "Planshet", width: 820, height: 1180, radius: 30 },
};

const ORDER: DeviceId[] = ["iphone", "android", "tablet"];

/**
 * Qurilma o'lchamini tanlash — uchta segmentli tugma.
 *
 * NEGA gradient yo'q: DESIGN-SYSTEM.md bo'yicha gradient sahifadagi
 * YAGONA asosiy amal uchun saqlanadi ("Do'konga chiqarish"). Bu yerda
 * gradient bo'lsa, mijoz qaysi tugma muhimligini ajrata olmaydi.
 * Tanlangan segment bir pog'ona ochroq sirt (`surface-high`) bilan
 * ajraladi — quyuq dizaynda qatlam soya bilan emas, YORUG'LIK bilan
 * ko'rsatiladi.
 *
 * NEGA `aria-pressed`: bu radio guruh emas, ko'rinishni almashtiradigan
 * uchta tugma. Ekran o'quvchi qaysi biri yoniqligini eshitishi kerak —
 * faqat rangga tayanib bo'lmaydi.
 */
export function DevicePicker({
  value,
  onChange,
}: {
  value: DeviceId;
  onChange: (id: DeviceId) => void;
}): ReactElement {
  return (
    <div
      role="group"
      aria-label="Qurilma o'lchami"
      className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1"
    >
      {ORDER.map((id) => {
        const device = DEVICES[id];
        const active = id === value;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            title={`${device.labelUz} o'lchami — ${device.width}×${device.height}`}
            className={`h-8 rounded-full px-3.5 text-xs font-medium transition ${
              active
                ? "bg-surface-high text-ink"
                : "text-ink-muted hover:bg-surface-alt hover:text-ink"
            }`}
          >
            {device.labelUz}
          </button>
        );
      })}
    </div>
  );
}
