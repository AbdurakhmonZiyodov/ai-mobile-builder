# AI uchun qo'llanma — mijoz ilovasi

> **Agent shu fayldan boshlaydi.** Bu — mijozning ilovasi, bizning
> mahsulotimiz emas. Mijoz uni App Store va Google Play'ga chiqaradi.

## Nima bu

Expo SDK 57 shabloni. Har yangi loyiha shundan nusxa olinadi va agent uni
mijozning sohasiga moslaydi.

## Tuzilish — QOTIRILGAN

```
app/                Expo Router. FAQAT ekranlar, mantiq yo'q
├── _layout.tsx     ← agent TEGMAYDI
└── (app)/
    ├── _layout.tsx ← agent TEGMAYDI
    └── *.tsx

src/
├── components/     UI qismlari (Button, Card, Screen, EmptyState)
├── features/       domen mantiqi: <soha>/use-<narsa>.ts
├── blocks/         tayyor bloklar (auth, data, to'lov) — parametrlashtiring
├── lib/            theme, supabase, format
├── hooks/          umumiy hook'lar
└── types/          umumiy turlar
```

Papka nomlari o'zgarmaydi. Agent ularni o'zgartirsa, keyingi run'da
loyiha xaritasi (`MAP.md`) noto'g'ri bo'lib qoladi.

## Qattiq qoidalar

1. **Navigatsiyani yozmang.** `app/_layout.tsx` va `app/(app)/_layout.tsx`
   qotirilgan. AI eng ko'p xatoni aynan navigatsiyada qiladi: orqaga
   qaytish buziladi va ilova yopilib ketadi.

2. **Ro'yxat uchun doim `FlatList`.** Hech qachon `ScrollView` ichida
   `.map()` — 50 tadan ortiq element bo'lganda ilova qotib qoladi.
   ESLint buni xato deb belgilaydi.

3. **Fayl 300 qatordan oshsa — bo'ling.** Uzun faylda model adashadi.

4. **`any` yo'q.** TypeScript strict yoqilgan.

5. **Mock ma'lumot yozmang.** Ro'yxatlar haqiqiy manbadan keladi
   (`src/features/*/use-*.ts`). Baza ulanmagan bo'lsa, ekran buni ochiq
   aytadi — `not-connected` holati.

   Soxta yozuvlar mijozga ilovasi ishlayotgandek ko'rsatadi, aslida baza
   ulanmagan. U buni do'konga chiqargandan keyin biladi — eng qimmat payt.

6. **Bo'sh `onPress` qoldirmang.** Apple 2.1 bandi bo'yicha bu rad etish
   sababi va Review Checker uni topadi.

7. **Yangi paket:** `npx expo install <paket>`, `npm install` emas.
   SDK 55 dan boshlab barcha `expo-*` paketlar SDK bilan bir xil major
   versiyada bo'lishi shart.

8. **Matn o'zbek tilida.** Ikkinchi til — rus.

## Har ekran uchta holatni ko'rsatishi shart

| Holat | Nega |
| --- | --- |
| Yuklanmoqda | Bo'sh oq ekran «ilova qotdi» degan taassurot beradi |
| Bo'sh | «Hozircha bo'sh» + nima qilish kerakligi |
| Xato | Tushunarli matn, texnik xabar emas |

E2E tekshiruv agenti bularni alohida tekshiradi.

## Keyin nimani o'qish

| Savol | Fayl |
| --- | --- |
| Kod qayerga yoziladi? | [`STRUCTURE.md`](./STRUCTURE.md) |
| Ranglar, oraliq, tipografiya? | [`STYLE-GUIDE.md`](./STYLE-GUIDE.md) |
| Bloklar qanday ishlaydi? | [`BLOCKS.md`](./BLOCKS.md) |
| Do'kon nimani talab qiladi? | [`STORE-RULES.md`](./STORE-RULES.md) |
| SDK nega qotirilgan? | [`../SDK.md`](../SDK.md) |
