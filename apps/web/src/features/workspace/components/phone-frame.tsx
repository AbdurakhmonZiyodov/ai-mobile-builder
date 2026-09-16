"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactElement, ReactNode, RefObject } from "react";
import { AmbientGlow } from "@/shared/ui";
import type { DeviceId, DeviceSpec } from "./device-picker";
import { PhoneHomeBar, PhoneStatusBar } from "./phone-status-bar";

export interface PhoneFrameProps {
  /** Mijozning ilovasi (iframe) — QURILMA o'lchamida ochilib, kichraytiriladi. */
  children?: ReactNode;
  device: DeviceSpec;
  statusUz: string;
  busy: boolean;
  /** Preview yo'q bo'lganda ekranni to'ldiradigan holat — MASSHTABLANMAYDI. */
  placeholder?: ReactNode;
}

/**
 * Ramka bezagining o'lchamlari — yagona manba SHU YERDA, CSS'da emas.
 * Masshtab hisobi ham, `.phone-edge` / `.phone-bezel` sinflari ham shu
 * raqamlarga tayanadi. Ikki joyda saqlansa, biri o'zgarganda ramka
 * ichida bir necha piksel og'ish paydo bo'lardi va sababini topish qiyin.
 */
const CHROME = { edge: 2, bezel: 8, statusBar: 32, homeBar: 16 } as const;
const CHROME_X = 2 * (CHROME.edge + CHROME.bezel);
const CHROME_Y = CHROME_X + CHROME.statusBar + CHROME.homeBar;

/**
 * Telefon ramkasi — ilova MARKAZDA turadi.
 *
 * ══════ 1. MASSHTABLASH: shu fayldagi eng muhim qaror ══════
 *
 * MUAMMO. Ilgari iframe ramkani to'ldirardi, ya'ni 900px lik noutbukda
 * ilova ~331px lik oynada ochilardi. Expo web eksporti o'zini shu
 * kenglikka moslaydi: natijada ilova 393pt lik HAQIQIY telefonda emas,
 * tor ekranda ochilgandek chiqardi — shriftlar nisbatan katta, maket
 * qisilgan. Mijoz aynan shuni "telefonda shriftlar katta" degan edi.
 *
 * YECHIM. Iframe HAR DOIM qurilmaning haqiqiy o'lchamida ochiladi
 * (`device.width × device.height`, ya'ni 393×852), keyin butunligicha
 * `transform: scale()` bilan kichraytiriladi. Ilova ichida hech narsa
 * o'zgarmaydi — u o'zini 393px lik telefonda deb biladi. Biz faqat
 * tayyor tasvirni kichraytiramiz, xuddi telefonga uzoqroqdan
 * qaragandek. Shrift bilan maketning nisbati buzilmaydi.
 *
 * ══════ 2. O'LCHAM QAYERDAN KELADI ══════
 *
 * Ramka o'z balandligini O'ZI hisoblamaydi va `--workspace-panel-h` ni
 * o'qimaydi. U `min-h-0 flex-1` konteyner ichida turadi: tepasida tab
 * qatori, pastida sabab matni bor va ular balandlikni oldindan bilib
 * bo'lmaydigan darajada o'zgartiradi. Shuning uchun YAGONA manba —
 * konteynerning `ResizeObserver` bilan o'lchangan haqiqiy o'lchami.
 *
 *   scale = min((W − qirralar) / qurilma_W, (H − qirralar) / qurilma_H)
 *
 * `min` ikkala o'lchamni ham cheklaydi. Faqat balandlikka qarasak,
 * "Planshet" (820px keng) tor ustunda chetidan chiqib ketardi.
 *
 * O'lchov halqaga aylanmaydi: ramka konteyner ichida `absolute`, ya'ni
 * uning kengligiga hissa qo'shmaydi — "o'lchadim → kengaytirdim →
 * qayta o'lchadim" sikli yuzaga kelmaydi.
 *
 * ══════ 3. NEGA IKKITA SLOT ══════
 *
 * `children` — MIJOZNING ilovasi. U qurilma o'lchamida render bo'ladi
 * va kichrayadi, chunki bizga uning ichki nisbatlari muhim.
 *
 * `placeholder` — BIZNING interfeysimiz (bo'sh holat, xato matni). U
 * ekranning haqiqiy o'lchamida, masshtabsiz chiziladi. Agar uni ham
 * `children` ga qo'ysak, 15px matn 0.55 koeffitsientda ~8px bo'lib
 * o'qilmay qoladi. Farq shundaki: birini qurilma o'lchaydi, ikkinchisini
 * ekran.
 */
export function PhoneFrame({
  children,
  device,
  statusUz,
  busy,
  placeholder,
}: PhoneFrameProps): ReactElement {
  const stage = useRef<HTMLDivElement>(null);
  const box = useElementSize(stage);

  const scale = Math.max(
    0,
    Math.min((box.width - CHROME_X) / device.width, (box.height - CHROME_Y) / device.height),
  );
  const viewport = { width: device.width * scale, height: device.height * scale };

  const frameStyle = {
    width: viewport.width + CHROME_X,
    height: viewport.height + CHROME_Y,
    // Qirra o'lchamlari CSS'ga shu yerdan uzatiladi — qarang `CHROME`.
    "--phone-edge": `${CHROME.edge}px`,
    "--phone-bezel": `${CHROME.bezel}px`,
    "--phone-statusbar": `${CHROME.statusBar}px`,
    "--phone-homebar": `${CHROME.homeBar}px`,
    // Burchak radiusi ham masshtabga ergashadi, aks holda kichik ramka juda dumaloq.
    "--phone-screen-r": `${device.radius * scale}px`,
    // O'lchanmaguncha yashirin: bir kadrga bo'lsa ham noto'g'ri o'lchamda ko'rinmasin.
    opacity: scale > 0 ? 1 : 0,
  } as CSSProperties;

  return (
    <div className="flex h-full max-h-full w-full min-w-0 flex-col items-center gap-2">
      <div ref={stage} className="relative min-h-0 w-full flex-1">
        <div
          style={frameStyle}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        >
          {/* Iliq porlash: telefon fondan "ko'tariladi". 20% — DESIGN-SYSTEM chegarasida. */}
          <AmbientGlow className="inset-x-[-14%] inset-y-[-8%] opacity-20" />
          <SideButtons deviceId={device.id} />

          <div className="phone-edge h-full w-full">
            <div className="phone-bezel h-full w-full">
              <div className="phone-screen relative flex h-full w-full flex-col">
                <PhoneStatusBar deviceId={device.id} />

                <div style={viewport} aria-busy={busy} className="relative overflow-hidden">
                  {children ? (
                    <div
                      style={{
                        width: device.width,
                        height: device.height,
                        transform: `scale(${scale})`,
                      }}
                      className="absolute top-0 left-0 origin-top-left"
                    >
                      {children}
                    </div>
                  ) : (
                    <div className="absolute inset-0">{placeholder}</div>
                  )}
                  {busy ? <BusyVeil /> : null}
                </div>

                <PhoneHomeBar />
                {/* Shisha hissi — ichki soya iframe USTIDA turishi kerak. */}
                <span aria-hidden className="phone-glass" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holat — rang bilan emas, SO'Z bilan. Kichik: bu ilovaning o'zi emas, izoh. */}
      <p className="shrink-0 text-xs text-ink-muted">{statusUz}</p>
    </div>
  );
}

/** Elementning haqiqiy o'lchami. O'lchanmaguncha nol — chaqiruvchi buni tekshiradi. */
function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

/** Yon tugma: [tomon, yuqoridan, balandlik] — foizda, ramka bilan birga o'sadi. */
type SideButton = readonly ["left" | "right", string, string];

/**
 * Yon tugmalar sof bezak, lekin joylashuvi qurilmaga MOS bo'lishi kerak:
 * noto'g'ri joyda turgan tugma maketni soxta ko'rsatadi.
 */
const SIDE_BUTTONS: Record<DeviceId, readonly SideButton[]> = {
  // iPhone: chapda jimlik kaliti va ikki ovoz tugmasi, o'ngda quvvat.
  iphone: [["left", "16%", "3.5%"], ["left", "23%", "7%"], ["left", "32%", "7%"], ["right", "25%", "10%"]],
  // Android: ikkalasi ham O'NG yonda — quvvat tepada, ovoz uning ostida.
  android: [["right", "19%", "6%"], ["right", "27.5%", "11%"]],
  // Planshet: korpus keng, uzun chiziq g'alati ko'rinadi — kaltaroq va tepada.
  tablet: [["right", "7%", "4%"], ["right", "14%", "7%"]],
};

function SideButtons({ deviceId }: { deviceId: DeviceId }): ReactElement {
  return (
    <>
      {SIDE_BUTTONS[deviceId].map(([side, top, height]) => (
        <span
          key={`${side}-${top}`}
          aria-hidden
          style={{ top, height }}
          className={`absolute w-[3px] bg-line-strong ${side === "left" ? "-left-[2px] rounded-l-sm" : "-right-[2px] rounded-r-sm"}`}
        />
      ))}
    </>
  );
}

/**
 * Yig'ilish qoplamasi. NEGA ekran o'chirilmaydi: eski preview ko'rinib
 * tursa, mijoz nima o'zgarayotganini solishtira oladi — bo'sh ekran esa
 * "ilovam yo'qoldi" degan qo'rquv beradi. `pointer-events-none` bilan
 * eski ilovani aylantirib ko'rish ham mumkin qoladi.
 */
function BusyVeil(): ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-paper/40 pb-5">
      <p
        role="status"
        className="animate-pulse rounded-full border border-line bg-surface/90 px-3.5 py-1.5 text-xs text-ink-muted"
      >
        Yig'ilmoqda…
      </p>
    </div>
  );
}

/**
 * Preview hali tayyor emas. `placeholder` sifatida uzatiladi, ya'ni
 * MASSHTABLANMAYDI — matn ramka kichraysa ham o'qiladigan bo'lib qoladi.
 *
 * Ekran quyuq qoladi — "o'chiq telefon" metaforasi; oq bo'sh ekran
 * "ilova buzilgan" degan taassurot berardi.
 */
export function PhonePlaceholder({ messageUz }: { messageUz: string }): ReactElement {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3.5 bg-surface-alt px-6 text-center">
      <span aria-hidden className="h-9 w-9 rounded-full border-2 border-dashed border-line-strong" />
      <p className="text-sm leading-relaxed text-ink-muted text-pretty">{messageUz}</p>
    </div>
  );
}
