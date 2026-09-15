# Do'kon talablari

App Store Review Guidelines va Google Play talablari — va ularning har
biri **kodda qayerda** qoplanishi.

Review Checker loyihani nashrdan oldin shu bandlar bo'yicha tekshiradi.
U ixtiyoriy vosita emas: «Apple rad qilsa, bepul tuzatamiz» kafolatini
birinchi urinishda o'tish darajasi 70% bo'lgandagina berish mumkin.

## Bandlar va qoplama

| Band | Talab | Checker nimani qidiradi | Qoplaydi |
| --- | --- | --- | --- |
| **4.2** | Minimum functionality | `app/` dagi `.tsx` ekranlar soni (`_layout` sanalmaydi) domen paketining chegarasidan kam | Domen paketi + agent qo'shgan ekranlar |
| **2.1** | To'liqlik | `Lorem ipsum` · `TODO` · `FIXME` · `Coming soon` · `Tez orada` · `placeholder text`; bo'sh `onPress={() => {}}` | [`AI-GUIDE.md`](./AI-GUIDE.md) 10-qoida |
| **5.1.1(v)** | Akkaunt o'chirish | `auth` bloki tanlangan bo'lsa: `delete-account` fayli yoki matni bormi | `auth` bloki |
| **4.8** | Uchinchi tomon login bo'lsa — Apple login ham | Kodda `google-sign-in` / `signInWithOAuth` / `facebook` bor, `expo-apple-authentication` yo'q | `auth` bloki |
| **5.1.1** | Ruxsat sababi | Kamera / galereya / joylashuv / mikrofon ishlatilsa, `app.json` → `ios.infoPlist` da mos kalit va **15 belgidan uzun** sabab | `media`, `notifications` bloklari |
| **3.1.1** | Raqamli kontent → faqat IAP | `payme` · `click.uz` · `uzum` · `paynet` · `checkout.stripe` naqshlari raqamli mahsulot loyihasida | To'lov bloki tanlovi |
| **4.3** | Spam / duplicate | `app.json` dagi umumiy `slug` (`amb-new-app`, `my-app`, `template`…) yoki bo'sh `name` | Har mijozga alohida palitra va struktura |
| Privacy | Maxfiylik siyosati | Kodda yoki `app.json` da `privacy`/`maxfiylik` so'zi (**ogohlantirish**, bloker emas) | `app/(app)/settings.tsx` |

Blokerlar o'tish ehtimolini har biri 35%, ogohlantirishlar 8% tushiradi.
Bitta bloker qolsa nashr to'xtaydi.

## Shablon holidan chiqadigan ikkita natija

Yangi loyiha shablonnikicha qoldirilsa, Checker darhol ikkita narsani
topadi. Ikkalasi ham agentning **birinchi** ishi:

| Nima | Nega | Yechim |
| --- | --- | --- |
| 4.2 bloker | Shablonda 3 ta ekran (`index`, `settings`, `+not-found`), sohalar uchun kamida 5–7 ta kerak | Domen oqimlari bo'yicha ekranlar qo'shiladi |
| 4.3 ogohlantirish | `slug: "amb-new-app"` umumiy nomlar ro'yxatida | `name`, `slug`, `ios.bundleIdentifier`, `android.package`, `scheme` mijozning brendiga o'zgartiriladi |

Domen bo'yicha kerakli ekran soni: ichki vosita 5 · bron 6 · do'kon 6 ·
kurslar 7 · yetkazib berish 7.

## 5.1.1(v) — eng oson unutiladigan

Apple 2022-yildan buni majburiy qildi: ilovada akkaunt yaratish bo'lsa,
uni **ilova ichidan** o'chirish ham bo'lishi shart. Sozlamalarga havola,
«bizga yozing» yoki veb-saytga yo'naltirish yetarli emas.

`auth` bloki `app/(app)/settings/delete-account.tsx` ekranini beradi.
**Uni o'chirmang va ko'chirmang** — Checker fayl nomi bo'yicha ham
qidiradi.

## 3.1.1 — eng qimmat xato

| Toifa | Misol | To'lov |
| --- | --- | --- |
| Raqamli | Obuna, premium funksiya, kursga kirish, virtual tovar | **Faqat IAP** |
| Jismoniy / xizmat | Yetkazib berish, taksi, sartaroshxona broni, do'kondan xarid | Tashqi to'lov ruxsat etiladi |

Payme, Click va Uzum faqat ikkinchi toifada ishlatilishi mumkin.
Birinchi toifada ular aniq rad etishga olib keladi va tuzatish ilovani
qayta qurishni talab qiladi — shuning uchun bu xato eng qimmati.

Teskarisi ham xato bo'lmasa-da, zarar: jismoniy tovar uchun IAP
qo'yilsa, Apple talab qilmagan 30% komissiya bekorga to'lanadi.

## 5.1.1 — ruxsat sabablari

Checker shu to'rt kalitni kuzatadi. Har biri kodda mos paket
ishlatilgandagina talab qilinadi:

| Kalit | Qachon kerak |
| --- | --- |
| `NSCameraUsageDescription` | `expo-camera`, `launchCameraAsync` |
| `NSPhotoLibraryUsageDescription` | `expo-image-picker`, `launchImageLibraryAsync` |
| `NSMicrophoneUsageDescription` | `expo-av`, `Audio.Recording` |
| `NSLocationWhenInUseUsageDescription` | `expo-location`, `getCurrentPositionAsync` |

Sabab **15 belgidan uzun** va foydalanuvchi tilida bo'lishi kerak.
«Kerak» yoki «Ruxsat bering» — rad etish. «Buyurtmangizga rasm biriktirish
uchun galereyaga kirish kerak» — to'g'ri.

## Checker tutmaydigan, lekin majburiy narsalar

| Nima | Holati |
| --- | --- |
| Ilova ikonkasi (1024×1024, alfa-kanalsiz) | Shablonda **yo'q**. `assets/` bo'sh, `app.json` da `icon` kaliti yo'q — nashrdan oldin qo'shiladi |
| Android adaptiv ikonka (`foregroundImage`) | Shablonda faqat `backgroundColor` bor |
| Splash ekran | Shablonda yo'q |
| Do'kon skrinshotlari va tavsif | App Store Connect / Play Console'da |
| Yosh reytingi anketasi | Play Console'da |
| App Privacy nutrition labels | App Store Connect'da, `analytics` bloki ma'lumot beradi |

`ITSAppUsesNonExemptEncryption: false` `app.json` da allaqachon
qo'yilgan — u bo'lmasa har TestFlight yuklashda eksport muvofiqligi
savoli chiqadi va build kutib qoladi.

## Google Play — 12 tester, 14 kun

Yangi **shaxsiy** (individual) dasturchi akkauntlari uchun: ilova
production'ga chiqishidan oldin **12 ta tester 14 kun davomida** yopiq
testda uzluksiz qatnashishi kerak. Tester soni 12 dan tushsa, hisob
qaytadan boshlanadi.

Bu onboarding'da, **birinchi kunda** aytiladi. Keyin aytilsa, mijoz ikki
hafta kutishni bilmay reja tuzadi va bu bizning kechikishimiz bo'lib
ko'rinadi.

Tashkilot (company) akkauntiga bu talab tegishli emas — lekin u D-U-N-S
raqamini talab qiladi.

## Apple akkaunti — yashirin to'siq

Bu auditoriya uchun eng og'riqli joy kod emas, **akkaunt ochish**:

1. Kompaniya nomidan ro'yxat — D-U-N-S raqami, bir necha kun
2. Soliq shakllari
3. Bank rekvizitlari
4. Paid Applications shartnomasi
5. 2FA

Birinchi marta qilayotgan odam bir hafta yo'qotadi yoki tashlab qo'yadi.

**Biz hech qachon Apple yoki Google akkauntining egasi bo'lmaymiz.**
Aks holda bitta mijozning qoidabuzarligi butun akkauntimizni yopadi va
o'sha akkauntdagi hamma ilova yo'qoladi.

Xavfsiz yo'l: mijoz o'z akkauntini ochadi va bizni **App Manager** roli
bilan taklif qiladi.
