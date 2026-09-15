# Qarorlar

Spekda aniq yozilmagan yoki qurish paytida haqiqat bilan to'qnashgan joylar.
Har biri alohida faylda: kontekst, qaror, sabab va oqibatlari.

Har qaror ochiq — raqam yoki yondashuv o'zgartirilsa, qayerga tegish
kerakligi «Tegishli» qatorida ko'rsatilgan.

> **Eslatma:** 0001–0014-qarorlar qayta tuzishdan **oldin** yozilgan.
> Fayl yo'llari yangi tuzilishga moslandi, lekin qarorning o'zi va sababi
> o'zgarmadi.

---

## Mahsulot qarorlari

| № | Qaror | Holat | Sana | Qisqacha |
| --- | --- | --- | --- | --- |
| [0001](./0001-sinov-tarifi-besh-ozgarish.md) | Sinov tarifi 0 emas, 5 o'zgarish | Qabul qilindi | 2026-09-14 | «Build yo'q» ≠ «o'zgarish yo'q»; sinovda 5 ta o'zgarish, `canBuild: false` |
| [0002](./0002-design-mode-faqat-oqish.md) | Design mode'da agentga tahrir tool'lari berilmaydi | Qabul qilindi | 2026-09-14 | Bepul rejim marja teshigiga aylanmasligi uchun tool darajasida cheklanadi |
| [0011](./0011-bosh-ekranda-asosiy-rang.md) | Shablon bosh ekranida asosiy rang ko'rinib turishi shart | Qabul qilindi | 2026-09-15 | To'g'ri o'zgarish ekranda ko'rinmasa, mijoz uchun u xatoga teng |
| [0013](./0013-verify-otkazib-yuborilgan-qadam.md) | Verify gate'da o'tkazib yuborilgan qadam "o'tdi" deb ko'rsatilmaydi | Qabul qilindi | 2026-09-15 | «O'tdi», «yiqildi» va «bajarilmadi» — uchta alohida holat |
| [0021](./0021-ilova-markazda-chat-qoplama.md) | Workspace'da ilova markazda, chat qoplama | Qabul qilindi | 2026-09-15 | Mijoz chat bilan emas, ilovasi bilan qiziqadi |

## Arxitektura

| № | Qaror | Holat | Sana | Qisqacha |
| --- | --- | --- | --- | --- |
| [0006](./0006-workspace-symlink.md) | Workspace bog'liqliklari — symlink | Qabul qilindi (vaqtinchalik) | 2026-09-14 | Symlink 0 ms, nusxalash 9.8 s, `npm install` 36 s |
| [0007](./0007-hono-zod-trpc-emas.md) | tRPC emas, zod shartnomalar | Transport qismi o'rin bosildi | 2026-09-14 | Asosiy kanal SSE; turlar `@amb/contracts` dan keladi |
| [0016](./0016-paket-ikki-istemolchida.md) | Paket faqat ikki iste'molchi bo'lganda yaratiladi | Qabul qilindi | 2026-09-15 | 10 ta paket → 5 ta; qolgani NestJS moduliga aylandi |
| [0017](./0017-mock-provayder-olib-tashlandi.md) | Mock provayder butunlay olib tashlandi | Qabul qilindi | 2026-09-15 | Kalitsiz server ishga tushmaydi; soxta ma'lumot yo'q |
| [0019](./0019-global-validationpipe-yoq.md) | Global `ValidationPipe` ishlatilmaydi | Qabul qilindi | 2026-09-15 | Zod sxemalari yagona manba; xabarlar o'zbekcha |
| [0020](./0020-frontend-xususiyat-boyicha.md) | Frontend xususiyat bo'yicha ajratilgan | Qabul qilindi | 2026-09-15 | `app/` — marshrut, `features/` — mantiq |

## Texnologiya tanlovi

| № | Qaror | Holat | Sana | Qisqacha |
| --- | --- | --- | --- | --- |
| [0003](./0003-expo-sdk-57.md) | Expo SDK 57, 56 emas | Qabul qilindi | 2026-09-14 | SDK 56 da Hermes V1 xotira regressiyasi bor |
| [0008](./0008-node-22.md) | Node 22 talab qilinadi | Qabul qilindi | 2026-09-14 | AI SDK 7 `node >= 22` so'raydi |
| [0009](./0009-typescript-59-shablonda.md) | Shablonda TypeScript 5.9 | Qabul qilindi | 2026-09-14 | Expo 57 TS 6 ni kutadi, TS 6 ning stabil relizi yo'q |
| [0012](./0012-turbo-concurrency-16.md) | Turbo concurrency 16 | Qabul qilindi | 2026-09-15 | 11 ta doimiy vazifa standart 10 chegarasidan oshardi |
| [0015](./0015-nestjs-cli-siz.md) | Backend NestJS 12, lekin Nest CLI'siz | Qabul qilindi | 2026-09-15 | CLI TS 6 kompilyator API'sini talab qiladi; `tsc` bilan quramiz |
| [0018](./0018-typescript-59-monorepoda.md) | Butun monorepo TypeScript 5.9 da | Qabul qilindi | 2026-09-15 | `baseUrl` yo'q; import kengaytmasi ikki loyihada har xil |

## Topilgan xatolar va tuzatishlar

| № | Qaror | Holat | Sana | Qisqacha |
| --- | --- | --- | --- | --- |
| [0004](./0004-eslint-unescaped-entities-ochirildi.md) | `react/no-unescaped-entities` o'chirilgan | Qabul qilindi | 2026-09-14 | O'zbekcha apostrof verify gate'ni yiqitardi |
| [0005](./0005-vosita-node-modules-bin-dan.md) | Workspace ichida vosita `node_modules/.bin` dan chaqiriladi | Qabul qilindi | 2026-09-14 | npm bayroqni o'ziniki deb olardi — soxta verify xatosi |
| [0010](./0010-metro-keshi-loyihada.md) | Metro keshi har loyihada alohida | Qabul qilindi | 2026-09-15 | Umumiy kesh eski ilovani ko'rsatardi; kesh `.amb-cache` ga ko'chdi |
| [0014](./0014-gitignore-packages-tuzogi.md) | `!packages/` — global gitignore tuzog'i | Qabul qilindi | 2026-09-15 | Global `Packages/` qoidasi 41 ta faylni push'dan tushirib qoldirgan edi |

---

## Hali qurilmagan (spek bo'yicha keyingi navbat)

Bular qaror emas — spekda bor, lekin hali amalga oshirilmagan qismlar.

| Nima | Spek | Hafta |
| --- | --- | --- |
| E2E tekshiruv agenti (Maestro + vision) | 12-bo'lim | 9–10 |
| EAS Build va TestFlight (`asc` CLI) | 13-bo'lim | 13 |
| `eas go` va dev client yig'ish | 10.3 | 8 |
| Konteyner izolyatsiyasi (Firecracker / gVisor) | 16.2 | 2 |
| Auth va billing | 6-bo'lim | 15 |
| Rad etishlar dashboardi | 3.1 | v1.3 |
| Payme / Click / Uzum blokining implementatsiyasi | 14.2 | v1.3 |

Hozir bularning **sxemasi va interfeysi** bor (`rejections`, `builds`
jadvallari, `payments_local` bloki, preview yo'llari), amalga oshirilishi yo'q.

---

## Yangi qaror qanday qo'shiladi

1. **Raqam ol.** Keyingi bo'sh raqam — oxirgi fayldan bittasi ko'pi.
   Raqamlar qayta ishlatilmaydi, o'chirilmaydi va tartibi o'zgarmaydi.
2. **Fayl yarat:** `NNNN-qisqa-nom.md`. Nom kichik harfda, so'zlar chiziqcha
   bilan, apostrofsiz — masalan `0022-eas-build-navbati.md`.
3. **Shablonni to'ldir** (pastda). To'rt bo'lim ham majburiy; eng qimmatlisi —
   **Sabab**, chunki qaror keyin faqat shu bo'lim orqali qayta baholanadi.
4. **Bog'liq qarorlarga havola qo'y** va kerak bo'lsa eski qarorning
   «Bog'liq qarorlar» qatorini ham yangila — havola ikki tomonlama bo'lsin.
5. **Indeksga qator qo'sh** — yuqoridagi to'rt guruhdan mosiga.
6. **Eski qaror o'rnini bosilsa**, uni o'chirma: «Holat» qatorini
   `O'rin bosildi — [NNNN](./NNNN-....md)` ga o'zgartir. Qaror tarixi
   qarorning o'zidan kam qimmatli emas.

### Shablon

```markdown
# 0007. <Qaror sarlavhasi>

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-14 |
| **Tegishli** | `packages/core-rules/src/pricing.ts` |
| **Bog'liq qarorlar** | [0003](./0003-....md) |

## Kontekst
Nima muammo bor edi va nega qaror kerak bo'ldi.

## Qaror
Nima qilindi — qisqa va aniq.

## Sabab
Nega aynan shunday. Muqobillar nega tanlanmadi.

## Oqibatlari
Bu qaror nimani osonlashtiradi va nimani qiyinlashtiradi. Qachon qayta ko'riladi.
```

### Holat qiymatlari

| Qiymat | Ma'nosi |
| --- | --- |
| `Qabul qilindi` | Kuchda |
| `Qabul qilindi (vaqtinchalik)` | Kuchda, lekin ma'lum shart bajarilgach almashadi |
| `O'rin bosildi — [NNNN]` | Yangi qaror bilan almashtirilgan |
| `Taklif` | Muhokamada, hali amalga oshirilmagan |
