# 0013. Verify gate'da o'tkazib yuborilgan qadam "o'tdi" deb ko'rsatilmaydi

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `apps/api/src/modules/verify/verify.service.ts`, `verify.finished` hodisasi |
| **Bog'liq qarorlar** | [0011](./0011-bosh-ekranda-asosiy-rang.md), [0017](./0017-mock-provayder-olib-tashlandi.md) |

## Kontekst

Kichik tahrirlarda bundle qadami bajarilmaydi — tezlik uchun. Lekin UI uni
«o'tdi» deb ko'rsatardi.

Bu yolg'on, mahsulotning butun va'dasi esa ishonchga qurilgan: mijoz
«tekshirildi» degan yozuvga ishonib do'konga chiqaradi.

## Qaror

`verify.finished` hodisasiga `skipped` maydoni qo'shildi. UI bunday qadamni
«bu o'zgarish uchun kerak emas edi — o'tkazib yuborildi» deb yozadi.

## Sabab

Uch xil holatni ikkitaga siqib bo'lmaydi. «O'tdi», «yiqildi» va «bajarilmadi»
— uchinchisi alohida ko'rsatilishi kerak, aks holda tizim o'zi haqida
noto'g'ri ma'lumot beradi.

Bu [0017](./0017-mock-provayder-olib-tashlandi.md) dagi bilan bir xil qoida:
ishlamagan narsa ishlaganday ko'rsatilmaydi.

## Oqibatlari

- Verify natijasini o'qiydigan har bir joy (UI, hisobot, handoff) uch holatni
  qo'llab-quvvatlashi kerak.
- Yangi verify qadami qo'shilganda u ham `skipped` ni qaytara olishi lozim.
