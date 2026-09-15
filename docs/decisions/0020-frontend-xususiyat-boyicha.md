# 0020. Frontend xususiyat bo'yicha ajratilgan

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `apps/web/src/features/`, `apps/web/src/app/` |
| **Bog'liq qarorlar** | [0016](./0016-paket-ikki-istemolchida.md), [0021](./0021-ilova-markazda-chat-qoplama.md) |

## Kontekst

Next.js'ning standart namunasi — `components/` va `hooks/` papkalari, ya'ni
kodni **turi** bo'yicha ajratish.

## Qaror

`app/` da faqat marshrut qoladi. Mantiq `features/` da, har bir xususiyat
o'z papkasida: `workspace`, `billing`, `blocks-picker`, `project-create`,
`verify-report`.

## Sabab

«Workspace» bitta ekran emas — u telefon ramkasi, chat qoplamasi, yuqori
panel va SSE hook'idan iborat. Ularni `components/` va `hooks/` papkalariga
sochib tashlasak, **birini o'zgartirish uchun uch joyga qarash** kerak
bo'ladi.

Bu [0016](./0016-paket-ikki-istemolchida.md) bilan bir xil mantiq: kod o'zi
tegishli bo'lgan joyda tursin, sun'iy chegara yaratilmasin.

## Oqibatlari

- Bir xususiyatga tegish — bitta papkaga tegish.
- Ikki xususiyat orasida umumiy bo'lgan narsa `shared/` ga chiqadi, lekin
  faqat ikkinchi iste'molchi paydo bo'lganda.
- `app/` dagi fayl qalinlashib ketsa, bu mantiq noto'g'ri qatlamga
  tushayotganining belgisi.
