# review — do'kon bandlari tekshiruvi

Bu ixtiyoriy vosita emas — **kafolatning sharti**. «Apple rad qilsa,
bepul tuzatamiz» deb va'da berish uchun birinchi urinishda o'tish darajasi
kamida 50% bo'lishi kerak. Maqsad: 70%.

## Qoidalar

| Fayl | Band | Nega |
| --- | --- | --- |
| `minimum-functionality.rule.ts` | 4.2 | Eng ko'p rad etish sababi |
| `completeness.rule.ts` | 2.1 | «Lorem ipsum», ishlamaydigan tugma |
| `account-deletion.rule.ts` | 5.1.1(v) | 2022-dan majburiy, oson unutiladi |
| `apple-sign-in.rule.ts` | 4.8 | Google bor, Apple yo'q |
| `usage-descriptions.rule.ts` | 5.1.1 | Ruxsat sababi yozilmagan |
| `payment-clause.rule.ts` | 3.1.1 | **Eng qimmat xato** |
| `privacy-policy.rule.ts` | Privacy | Havola ishlashi kerak |
| `uniqueness.rule.ts` | 4.3 | Bizdan chiqqan ilovalar o'xshamasin |

## Nega 4.3 biz uchun tizimli xavf

Agar bizdan chiqqan 50 ta ilova bir-biriga o'xshasa, Apple buni naqsh
sifatida aniqlaydi va **hammasini** rad etishi mumkin. Shuning uchun
domen paketlari va har mijoz uchun alohida dizayn tizimi bor.

Akkauntlar ham mijozlarda — bu bog'lanishni uzadi.

## Yangi qoida qo'shish

1. `rules/<mavzu>.rule.ts` — sof funksiya, `CheckerInput` oladi
2. `rules/index.ts` dagi `ALL_RULES` ga qo'shing
3. Shu jadvalni yangilang

Rad etishlar korpusi vaqt bilan aynan shu ro'yxatni boyitadi — bu
mahsulotning nusxa ko'chirib bo'lmaydigan qismi.
