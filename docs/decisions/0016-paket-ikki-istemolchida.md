# 0016. Paket faqat ikki iste'molchi bo'lganda yaratiladi

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `packages/` — `core-rules`, `contracts`, `blocks`, `domains`, `design-tokens` |
| **Bog'liq qarorlar** | [0020](./0020-frontend-xususiyat-boyicha.md) |

## Kontekst

Avvalgi tuzilishda 10 ta paket bor edi. Ularning yarmi — `db`, `ai`, `agent`,
`workspace`, `verify`, `review-checker` — faqat **backend** tomonidan
ishlatilardi. Ya'ni ular umumiy emas, shunchaki alohida papkaga chiqarilgan
backend kodi edi.

## Qaror

Bitta iste'molchisi bor paketlar NestJS ichidagi modullarga aylantirildi.
`packages/` da chindan ikki tomon ishlatadigan 5 ta narsa qoldi:
`core-rules`, `contracts`, `blocks`, `domains`, `design-tokens`.

Qoida: **paket faqat ikki yoki undan ko'p iste'molchisi bo'lganda yaratiladi.**

## Sabab

Har ortiqcha paket uchta narxni keltiradi:

- build grafigiga yana bitta tugun qo'shadi;
- import yo'lini uzaytiradi;
- «bu kod kimga tegishli?» degan savolni noaniq qoldiradi.

Bitta iste'molchisi bor kod uchun bu narx hech narsa qaytarmaydi.

## Oqibatlari

- Backend kodi bir joyda — `apps/api/src/modules/` va
  `apps/api/src/infrastructure/`.
- Yangi umumiy kod yozilganda avval «ikkinchi iste'molchi kim?» degan savolga
  javob kerak. Javob yo'q bo'lsa, kod o'z ilovasi ichida qoladi.
- Backend moduli keyinchalik ikkinchi iste'molchi topsa, uni paketga chiqarish
  mumkin — bu yo'nalish ochiq.
