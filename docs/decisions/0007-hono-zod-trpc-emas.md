# 0007. tRPC emas, zod shartnomalar

| | |
| --- | --- |
| **Holat** | Qabul qilindi · transport qismi [0015](./0015-nestjs-cli-siz.md) bilan o'rin bosildi |
| **Sana** | 2026-09-14 |
| **Tegishli** | `packages/contracts/` (`contracts.ts`, `events.ts`) |
| **Bog'liq qarorlar** | [0015](./0015-nestjs-cli-siz.md), [0019](./0019-global-validationpipe-yoq.md) |

## Kontekst

Spekda: «API / Orkestrator — Node 20+ yoki Bun, tRPC, SSE».

## Qaror

tRPC ishlatilmaydi. Turlar va validatsiya `packages/contracts` dagi **zod
sxemalari** orqali beriladi; API esa oddiy HTTP + SSE.

Dastlab transport sifatida Hono tanlangan edi; qayta tuzishdan keyin uning
o'rnini NestJS egalladi (qarang [0015](./0015-nestjs-cli-siz.md)). Shartnomalar
bo'yicha qismi o'zgarmadi.

## Sabab

Asosiy kanal — **SSE oqimi**. tRPC uni qo'shimcha qatlam bilan o'raydi, lekin
oqim semantikasini yaxshilamaydi.

Turlar baribir bitta manbadan keladi: `contracts.ts` va `events.ts`. Ya'ni
tRPC bergan asosiy foyda (uchidan-uchiga turlar) bizda allaqachon bor —
qatlamsiz.

## Oqibatlari

- Frontend va backend aynan bir xil zod sxemalarini import qiladi; ikkinchi
  validatsiya qatlami yaratilmaydi (qarang
  [0019](./0019-global-validationpipe-yoq.md)).
- Kerak bo'lsa tRPC keyinchalik ustiga qo'yilishi mumkin — shartnomalar
  allaqachon ajratilgan, bu yo'l yopilmagan.
