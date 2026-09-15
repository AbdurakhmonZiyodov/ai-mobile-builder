import type { ReactNode } from "react";
import { AmbientGlow } from "@/shared/ui";

/**
 * Telefon ramkasi — ilova MARKAZDA turadi.
 *
 * Dizayn qarori: raqobatchilarda chat markazda, ilova yon panelda.
 * Bizda teskarisi. Sabab: mijoz chat bilan emas, ILOVASI bilan
 * qiziqadi. Chat — vosita, natija emas.
 *
 * O'LCHAM. Ilgari ramka qat'iy 390×844 px edi va 1440×900 noutbukda
 * pastki qismi kesilib qolardi. Endi balandlik ekranga moslashadi
 * (`.phone-shell`, globals.css), nisbat esa saqlanadi — maket har
 * qanday ekranda butun va haqiqiy qurilma nisbatida ko'rinadi.
 *
 * Ramka uch qatlam: tashqi yorug' qirra (metall chekka), quyuq bezel
 * va ekran. Yagona qatlam bilan maket «rasm» bo'lib qolardi.
 */
export function PhoneFrame({ children, statusUz }: { children: ReactNode; statusUz?: string }) {
  return (
    <div className="flex min-h-0 flex-col items-center gap-4">
      {statusUz ? <p className="text-sm text-ink-muted">{statusUz}</p> : null}

      <div className="phone-shell relative">
        {/* Orqadagi iliq porlash — telefon fondan «ko'tarilib» turadi. */}
        <AmbientGlow className="inset-x-[-12%] inset-y-[-6%] opacity-25" />

        {/* Yon tugmalar — realistik qurilma belgisi, sof bezak. */}
        <span aria-hidden className="absolute top-[18%] -left-[3px] h-[7%] w-[3px] rounded-l-sm bg-line-strong" />
        <span aria-hidden className="absolute top-[28%] -right-[3px] h-[11%] w-[3px] rounded-r-sm bg-line-strong" />

        <div className="h-full w-full rounded-[44px] bg-linear-to-b from-line-strong via-line to-line-strong p-[3px]">
          {/*
            Yuqoridan kengroq to'ldirish — dynamic island SHU YERDA yashaydi,
            ekran ustida emas.

            Avval u `absolute` bilan ekran ustiga chizilardi va mijozning
            ilova sarlavhasini yopib qolardi. Haqiqiy qurilmada ilova
            xavfsiz maydon (safe area) ostida boshlanadi, veb eksportida
            esa bunday inset yo'q — shuning uchun joyni ramka beradi.
          */}
          <div className="relative flex h-full w-full flex-col rounded-[41px] bg-paper px-[10px] pt-[32px] pb-[10px]">
            <span
              aria-hidden
              className="absolute top-[8px] left-1/2 h-[20px] w-[86px] -translate-x-1/2 rounded-full bg-line-strong/70 ring-1 ring-line/60"
            />
            <div className="min-h-0 flex-1 overflow-hidden rounded-[32px] bg-surface-alt">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Preview hali tayyor bo'lmaganda ko'rsatiladigan holat.
 *
 * Ekran quyuq qoladi — «o'chiq telefon» metaforasi. Oq bo'sh ekran
 * «ilova buzilgan» degan taassurot berardi.
 */
export function PhonePlaceholder({ messageUz }: { messageUz: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-5 text-center">
      <span aria-hidden className="h-8 w-8 rounded-full border-2 border-dashed border-line-strong" />
      <p className="text-sm leading-relaxed text-ink-muted text-pretty">{messageUz}</p>
    </div>
  );
}
