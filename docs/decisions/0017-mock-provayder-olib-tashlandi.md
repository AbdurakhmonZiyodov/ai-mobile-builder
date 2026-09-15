# 0017. Mock provayder butunlay olib tashlandi

| | |
| --- | --- |
| **Holat** | Qabul qilindi |
| **Sana** | 2026-09-15 |
| **Tegishli** | `apps/api/src/config/env.schema.ts`, `apps/api/src/main.ts` |
| **Bog'liq qarorlar** | [0013](./0013-verify-otkazib-yuborilgan-qadam.md) |

## Kontekst

Avval model kaliti bo'lmasa ishlaydigan soxta (mock) provayder bor edi. U
ishga tushirishni osonlashtirardi, lekin mijozga **ilovasi ishlayotganday**
ko'rsatardi.

## Qaror

Model kaliti bo'lmasa, server umuman **ishga tushmaydi**:

```
✗ Server ishga tushmadi

Model kaliti yo'q. AI_GATEWAY_API_KEY ni .env ga qo'shing…
```

Sozlama NestJS ko'tarilishidan **oldin** tekshiriladi.

Shu bilan birga shablondan ham namunaviy (seed) ma'lumot olib tashlandi.
Ekranlar haqiqiy manbadan o'qiydi; baza ulanmagan bo'lsa `not-connected`
holatini ochiq ko'rsatadi — bu «xato» ham emas, bo'sh ro'yxat ham emas,
**uchinchi holat**.

## Sabab

Soxta ma'lumot ikki xil zarar keltiradi: mijoz ishlamaydigan narsani
ishlayapti deb qabul qiladi, va nosozlik keyinroq — do'kon oldida — chiqadi.

Sozlama tekshiruvi Nest'dan oldin turishining sababi ham shu: aks holda xato
Nest'ning DI stack trace'i ichida ko'milib qoladi va sabab ko'rinmaydi.

## Oqibatlari

- Kalitsiz demo qilib bo'lmaydi — ishga tushirish uchun haqiqiy kalit shart.
- Har bir yangi ekran uch holatni qo'llab-quvvatlashi kerak: ma'lumot,
  bo'sh ro'yxat, `not-connected`.
- Bu [0013](./0013-verify-otkazib-yuborilgan-qadam.md) bilan bir qoidaning
  ikki ko'rinishi: ishlamagan narsa ishlaganday ko'rsatilmaydi.
