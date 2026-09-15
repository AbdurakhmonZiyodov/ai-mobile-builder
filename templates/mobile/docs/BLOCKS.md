# Bloklar

Blok — kichik, qayta ishlatiladigan, **do'kon qoidalariga oldindan
moslangan** qism.

## Nega blok, shablon emas

**Do'kon xavfi.** Apple'ning 4.2 va 4.3 bandlari o'xshash ilovalar
oqimiga qarshi. 50 ta mijoz bitta shablondan chiqsa, Apple buni naqsh
sifatida ko'radi va hammasini rad etishi mumkin.

**Texnik xavf.** Prompt shablondan uzoqlashgan sayin agent begona kodni
buzadi.

Bloklar va domen bilimi bilan 50 ta ilova **har xil ko'rinadi, lekin bir
xil to'g'ri bo'ladi**.

## Agent bloklarni NOLDAN YOZMAYDI

Har blok `generationPolicy` bilan keladi:

| Siyosat | Ma'nosi | Qaysi bloklar |
| --- | --- | --- |
| `parameterize_only` | Fayllari tayyor. Agent faqat qiymat, matn va uslubni moslaydi | `onboarding` dan boshqa hammasi |
| `extend_allowed` | Ustiga yangi qadam qo'shish mumkin | `onboarding` |

Sabab: agent har safar noldan yozganda detallarni goh unutadi —
akkauntni o'chirish ekranini, ruxsat sababini, RLS qoidasini. Blok hech
qachon unutmaydi, chunki u bir marta yozilgan va sinovdan o'tgan.

## Mavjud bloklar

| Blok | Preview | Qo'shadigan paketlar | Do'kon bandi |
| --- | --- | --- | --- |
| `auth` | Expo Go | `expo-apple-authentication`, `expo-secure-store`, `@supabase/supabase-js` | 4.8 · 5.1.1(v) |
| `data` | Expo Go | `@tanstack/react-query`, `expo-sqlite`, `@supabase/supabase-js` | — |
| `payments_iap` | Dev client | `react-native-purchases` | 3.1.1 |
| `payments_local` | Expo Go | — | 3.1.1 |
| `notifications` | Dev client | `expo-notifications`, `expo-device` | 5.1.1 |
| `media` | Dev client | `expo-image-picker`, `expo-camera`, `expo-image` | 5.1.1 |
| `analytics` | Expo Go | — | Privacy |
| `onboarding` | Expo Go | — | — |
| `navigation` | Expo Go | `expo-router` | — |

`navigation` bloki `app/_layout.tsx` va `app/(app)/_layout.tsx` fayllarini
egallaydi — ular **qotirilgan**, agent tegmaydi.

## Paket faqat blok orqali keladi

Jadvaldagi «paketlar» ustuni — ilovaga native modul kirishining **yagona**
yo'li. Agent `package.json` ga qator qo'sha olmaydi: uning terminali yo'q
va workspace'ning `node_modules` i shablonga symlink
([`../SDK.md`](../SDK.md)).

Ya'ni «RevenueCat qo'shaman» degan qaror agentniki emas — u blok tanlash
qarori va u preview yo'lini ham o'zgartiradi.

## «Preview» ustuni nega bor

Mijoz blok **tanlashdan oldin** uning telefonda darhol ochilishini yoki
build kutishini ko'rishi kerak.

Expo Go — App Store'dagi tayyor ilova va u faqat **o'zi ichiga yig'ilgan**
native modullarni ishlata oladi. `expo-notifications`, `expo-camera`,
`react-native-purchases` kabi modullar ilovaga qo'shilishi bilan Expo Go
ishlamay qoladi va dev client kerak bo'ladi — EAS orqali 5–15 daqiqada
yig'iladi.

Bu oldindan aytilmasa, «ilovam telefonimda ochilmayapti» degan support
oqimi boshlanadi va u kod muammosi emas, kutish muammosi.

Bitta dev client bloki butun loyihani dev client'ga o'tkazadi — preview
qarori eng yuqori talab bo'yicha olinadi.

## RLS — kod emas, blok

AI generatsiya qilgan RLS qoidalari eng xavfli joy: **bitta xato butun
bazani ochib qo'yadi**.

`auth` va `data` bloklari sinovdan o'tgan RLS naqshlari bilan keladi
(`policies.sql`). Agent ularni faqat parametrlashtiradi.

Ilovada faqat Supabase `anon` kaliti bo'ladi. `service_role` RLS'ni
butunlay chetlab o'tadi va u ilova kodiga **hech qachon** tushmaydi —
`EXPO_PUBLIC_*` qiymatlari bundle ichiga yoziladi va ilovani yuklab
olgan har kim ularni o'qiy oladi.

## To'lov bloki — 3.1.1 qorovuli

| Nima sotiladi | Qaysi blok |
| --- | --- |
| Obuna, premium funksiya, kursga kirish, virtual tovar | `payments_iap` — **majburiy** |
| Yetkazib berish, taksi, bron, do'kondan xarid | `payments_local` — ruxsat etiladi |

Raqamli kontent uchun tashqi to'lov — **aniq rad etish**. Backend buni
blok tanlanayotganda tekshiradi (`checkPaymentChoice`) va noto'g'ri
tanlovda to'xtatadi.

Teskari holat ham tekshiriladi: jismoniy tovar uchun IAP tanlansa,
mijozga bu **kerak emasligi** aytiladi — Apple bunda IAP talab qilmaydi
va 30% komissiya bekorga to'lanadi.

Review Checker keyin kodning o'zida ham qidiradi: `payme`, `click.uz`,
`uzum`, `paynet`, `checkout.stripe` naqshlari raqamli mahsulot
loyihasida topilsa — bloker.
