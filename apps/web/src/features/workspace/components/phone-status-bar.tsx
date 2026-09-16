"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { DeviceId } from "./device-picker";

/**
 * Telefon holat qatori — soat, aloqa belgilari va dynamic island.
 *
 * NEGA ilova USTIDA emas, ALOHIDA qatorda: veb eksportida xavfsiz
 * maydon (safe area) inseti yo'q, shuning uchun `absolute` qator
 * mijozning ilova sarlavhasini yopib qolardi. Joyni RAMKA beradi.
 *
 * NEGA qator masshtablanmaydi: bu ilovaning bir qismi emas, QURILMA
 * bezagi. Agar u ham iframe bilan birga kichraysa, soat o'qilmas
 * darajada mayda bo'lib qolardi.
 */
export function PhoneStatusBar({ deviceId }: { deviceId: DeviceId }): ReactElement {
  const clock = useClock();

  return (
    <div className="relative flex h-[var(--phone-statusbar)] shrink-0 items-center justify-between px-[7%] text-[11px] leading-none font-medium text-ink">
      {/* Kenglik qat'iy: soat paydo bo'lganda belgilar joyidan siljimasin. */}
      <span className="w-9 tabular-nums">{clock}</span>

      {deviceId === "iphone" ? <DynamicIsland /> : null}
      {deviceId === "android" ? <PunchHole /> : null}

      <span className="flex items-center gap-[5px] text-ink">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </span>
    </div>
  );
}

/**
 * Joriy vaqt.
 *
 * NEGA `9:41` emas: qotib qolgan raqam "bu rasm" degan signal beradi.
 * Haqiqiy soat maketni tirik qiladi.
 *
 * NEGA bo'sh qiymatdan boshlanadi: server va brauzer vaqti mos
 * kelmasa React hydration xatosi beradi — shuning uchun soat faqat
 * brauzerda to'ldiriladi.
 */
function useClock(): string {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    // 20 soniya — daqiqa almashganini sezilarli kechikishsiz ushlaydi.
    const timer = window.setInterval(tick, 20_000);
    return () => window.clearInterval(timer);
  }, []);

  return clock;
}

/** iPhone dynamic island — qora, status qatori ICHIDA, ilova ustida emas. */
function DynamicIsland(): ReactElement {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 left-1/2 flex h-[64%] w-[30%] max-w-[104px] -translate-x-1/2 -translate-y-1/2 items-center justify-end rounded-full bg-paper pr-[14%] ring-1 ring-line/80"
    >
      {/* Kamera linzasi — islandni tekis dog'dan farqlaydi. */}
      <span className="h-[5px] w-[5px] rounded-full bg-line-strong/50" />
    </span>
  );
}

/** Android punch-hole kamera — islanddan kichik va yumaloq. */
function PunchHole(): ReactElement {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 left-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper ring-1 ring-line/80"
    />
  );
}

/**
 * Pastdagi home indicator chizig'i.
 *
 * NEGA kerak: usti bor, pasti yo'q bo'lsa ramka nomutanosib ko'rinadi.
 */
export function PhoneHomeBar(): ReactElement {
  return (
    <div className="flex h-[var(--phone-homebar)] shrink-0 items-center justify-center">
      <span aria-hidden className="h-[4px] w-[32%] max-w-[120px] rounded-full bg-ink/35" />
    </div>
  );
}

/*
 * Belgilar — kichik inline SVG.
 * NEGA emoji emas: emoji har tizimda boshqacha chiziladi (rangli, katta,
 * boshqa balandlikda) va maket "havaskor" ko'rinadi. SVG `currentColor`
 * ni oladi, ya'ni matn rangiga ergashadi.
 */
function SignalIcon(): ReactElement {
  return (
    <svg aria-hidden viewBox="0 0 17 12" className="h-[9px] w-[13px]" fill="currentColor">
      <rect x="0" y="8.5" width="3" height="3.5" rx="1" opacity="0.45" />
      <rect x="4.7" y="6" width="3" height="6" rx="1" />
      <rect x="9.4" y="3" width="3" height="9" rx="1" />
      <rect x="14" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}

function WifiIcon(): ReactElement {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 12"
      className="h-[9px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M1.4 4.2a9.6 9.6 0 0 1 13.2 0" />
      <path d="M3.9 6.9a6.2 6.2 0 0 1 8.2 0" />
      <path d="M6.4 9.5a2.6 2.6 0 0 1 3.2 0" />
    </svg>
  );
}

/**
 * Batareya — qasddan QAT'IY 80%.
 * Brauzer batareyasi noutbukniki, telefonniki emas. Uni ko'rsatish
 * mijozni chalg'itadi, shuning uchun bu sof bezak.
 */
function BatteryIcon(): ReactElement {
  return (
    <svg aria-hidden viewBox="0 0 25 12" className="h-[9px] w-[19px]">
      <rect x="0.6" y="0.6" width="20.8" height="10.8" rx="3.2" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
      <rect x="2.4" y="2.4" width="13.6" height="7.2" rx="1.8" fill="currentColor" />
      <rect x="22.6" y="4" width="1.8" height="4" rx="0.9" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
