# 0012. Turbo concurrency 16

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `turbo.json` -> `concurrency: "16"` |
| **Bog'liq qarorlar** | [0016](./0016-paket-ikki-istemolchida.md) |

## Kontekst

Har paketning `dev` skripti — `tsc --watch`, ya'ni **doimiy** vazifa.
Doimiy vazifalar soni 11 taga yetgan edi, turbo'ning standart chegarasi esa
10. Natijada `npm run dev` umuman ishga tushmasdi.

## Qaror

`turbo.json` da `concurrency: "16"`.

## Sabab

Chegara mashina resursidan emas, turbo'ning standart sozlamasidan kelib
chiqqan edi — `tsc --watch` jarayonlari deyarli butun vaqt bo'sh turadi.

Yengilroq variant ham qoldirildi: `npm run dev:app` faqat `api` va `web` ni
ko'taradi.

## Oqibatlari

- Paketlar soni kamaygach ([0016](./0016-paket-ikki-istemolchida.md)) bu
  chegara endi zarur emas, lekin zapas sifatida qoldirilgan.
- Yangi paket qo'shilganda `dev` vazifalari soni 16 dan oshmasligini
  tekshirish kerak.
