# review — do'kon bandlari tekshiruvi

Bu ixtiyoriy vosita emas — **kafolatning sharti**. «Apple rad qilsa, bepul
tuzatamiz» deb va'da berish uchun birinchi urinishda o'tish darajasi kamida
50% bo'lishi kerak. Maqsad: 70%.

Endpoint: `GET /review/:id`. Javob shakli: [`docs/API.md`](../../../docs/API.md).

---

## 1. Fayllar

| Fayl | Javobgarligi |
| --- | --- |
| `review.controller.ts` | `GET /review/:id` |
| `review.service.ts` | Fayllarni yig'ish, `app.json` ni o'qish, qoidalarni ishga tushirish |
| `review.types.ts` | `CheckerInput`, `Finding`, `Rule` va yordamchilar (`getIn`, `allSource`) |
| `rules/` | Har qoida alohida faylda |
| `rules/index.ts` | `ALL_RULES` — ishga tushirish tartibi |

---

## 2. Qoidalar

| Fayl | Band | Og'irligi | Nimani tutadi |
| --- | --- | --- | --- |
| `minimum-functionality.rule.ts` | 4.2 | blocker | Mazmunli ekran soni domen paketining `minScreens` idan kam. **Eng ko'p rad etish sababi** |
| `completeness.rule.ts` | 2.1 | blocker | «Lorem ipsum», `TODO`, «Tez orada» matni; bosilganda hech narsa qilmaydigan tugma |
| `account-deletion.rule.ts` | 5.1.1(v) | blocker | `auth` bloki bor, lekin akkauntni o'chirish ekrani yo'q |
| `apple-sign-in.rule.ts` | 4.8 | blocker | Google/Facebook bilan kirish bor, Apple bilan kirish yo'q |
| `usage-descriptions.rule.ts` | 5.1.1 | blocker | Kamera, galereya, joylashuv yoki mikrofon ishlatiladi, `app.json` da sabab yo'q yoki 15 belgidan qisqa |
| `payment-clause.rule.ts` | 3.1.1 | blocker / info | Raqamli mahsulot tashqi to'lov bilan (blocker); jismoniy tovarga IAP qo'yilgan (info — ortiqcha 30% komissiya) |
| `privacy-policy.rule.ts` | Privacy | warning | Kodda va `app.json` da maxfiylik havolasi topilmadi |
| `uniqueness.rule.ts` | 4.3 | warning | `app.json` dagi slug shablon nomiga o'xshaydi yoki `expo.name` bo'sh |

Har qoida — **sof funksiya** (`CheckerInput` → `Finding[]`). Shuning uchun
yangi rad etish holati uchragach, faqat bitta fayl qo'shiladi va u bazasiz
testlanadi.

---

## 3. Ehtimol qanday hisoblanadi

```
passLikelihood = max(0, 1 − blocker_soni × 0.35 − warning_soni × 0.08)
ok             = blocker_soni === 0
```

`info` darajasi ehtimolga ta'sir qilmaydi — u maslahat, xato emas
(masalan «IAP shart emas, 30% komissiyani to'lamasligingiz mumkin»).

Natijalar og'irligi bo'yicha saralanadi: `blocker` → `warning` → `info`.
**Nega:** mijoz birinchi navbatda uni to'sib turgan narsani ko'rishi kerak.

> Koeffitsiyentlar (`0.35`, `0.08`) o'lchov emas, **taxmin**. Rad etishlar
> korpusi to'lgach ular haqiqiy statistikaga almashtiriladi.

---

## 4. Nima tekshiriladi va nima tekshirilmaydi

| Narsa | Holati |
| --- | --- |
| Manba fayllar (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`) | Tekshiriladi, 300 tagacha |
| `app.json` | Alohida o'qiladi (`expo.ios.infoPlist` kabi yo'llar uchun) |
| `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` | **Chetlatiladi** |
| Ilovaning ishlashi (E2E) | Tekshirilmaydi — bu boshqa vositaning ishi |
| Google Play talablari | Hozircha tekshirilmaydi — faqat Apple bandlari |

> **Nega lock fayllar chetlatiladi:** `package-lock.json` yuzlab paket
> nomini o'z ichiga oladi va unda «pay», «auth», «camera» kabi so'zlar
> albatta uchraydi. Kalit so'z qidiruvi ularni soxta natija sifatida
> tutardi.

Bitta fayl o'qilmasa, tekshiruv **to'xtamaydi** — u fayl o'tkazib
yuboriladi. Yarim natija hech qanday natijadan yaxshi.

---

## 5. Nega 4.3 biz uchun tizimli xavf

Agar bizdan chiqqan 50 ta ilova bir-biriga o'xshasa, Apple buni naqsh
sifatida aniqlaydi va **hammasini** rad etishi mumkin. Bitta mijozning
muammosi emas — butun mahsulotning.

Uch himoya chizig'i:

1. Domen paketlari — har soha uchun boshqa model, oqim va ekranlar.
2. Har mijoz uchun alohida dizayn tizimi.
3. Akkauntlar mijozlarda — bu ilovalar orasidagi bog'lanishni uzadi.

`uniqueness.rule.ts` esa eng oddiy belgini tutadi: shablon nomi
o'zgartirilmagan.

---

## 6. Qattiq qoidalar

| Qoida | Nega |
| --- | --- |
| Har qoida sof funksiya, I/O yo'q | Bazasiz va workspace'siz testlanadi; tekshiruv tez ishlaydi |
| `Finding.titleUz` «nima qilish kerak» ni aytadi | Mijozga «rad etish sababi» emas, yechim kerak. U texnik bo'lmagan odam |
| Naqshlar (regex) **chegara bilan** yoziladi | `payme` oddiy qism-satr edi va inglizcha `payment`, `handlePayment` so'zlarini tutardi — har raqamli loyihaga soxta 3.1.1 blokeri chiqardi |
| Soxta blocker — haqiqiy blokerdan yomonroq | U mijozni bo'lmagan muammoni tuzatishga majbur qiladi va tekshiruvga bo'lgan ishonchni yo'q qiladi |
| `severity` tanlash asoslanadi | `blocker` — aniq rad etish. `warning` — ehtimol. `info` — maslahat |

## Nima qilish TAQIQLANGAN

- Qoidaga baza, tarmoq yoki fayl tizimi murojaatini qo'shish.
- `ALL_RULES` dan qoidani olib tashlash (u xato bersa — naqshini
  aniqlashtiring, o'chirmang).
- `passLikelihood` ni 1 dan katta yoki 0 dan kichik qiymatga olib chiqish.
- Chegara belgilarisiz (`\b`) kalit so'z qidirish.
- Tekshiruvni do'konga chiqarishdan keyinga qoldirish — uning butun ma'nosi
  **oldindan** topishda.

---

## 7. Yangi qoida qo'shish

1. `rules/<mavzu>.rule.ts` — sof funksiya, `CheckerInput` oladi,
   `Finding[]` qaytaradi.
2. Fayl boshida izoh: **qaysi band, nega tekshiriladi, qanday xato
   kuzatilgan.**
3. `rules/index.ts` dagi `ALL_RULES` ga qo'shing.
4. Shu fayldagi jadvalni yangilang.

Rad etishlar korpusi (`rejections` jadvali) vaqt bilan aynan shu ro'yxatni
boyitadi — bu mahsulotning nusxa ko'chirib bo'lmaydigan qismi. Jadval
hozircha kodga ulanmagan: qoidalar qo'lda qo'shiladi.
