# Do'kon talablari

App Store Review Guidelines va Google Play talablari — kodda qayerda
qoplanganini ko'rsatadi.

## Blokerlar

| Band | Talab | Qayerda qoplanadi |
| --- | --- | --- |
| **4.2** | Minimum functionality — eng ko'p rad etish sababi | Domen paketi `minScreens` beradi |
| **2.1** | To'liqlik: «Lorem ipsum», ishlamaydigan tugma yo'q | Review Checker + bo'sh `onPress` taqiqi |
| **5.1.1(v)** | Akkaunt yaratish bo'lsa — **o'chirish ham majburiy** | `auth` bloki `delete-account` ekranini beradi |
| **4.8** | Uchinchi tomon login bo'lsa — Apple login ham | `auth` bloki |
| **5.1.1** | Har ruxsat sababi `Info.plist` da | `media`, `notifications` bloklari |
| **3.1.1** | Raqamli kontent → faqat IAP | To'lov bloki tanlovi |
| **4.3** | Spam / duplicate | Har mijozga alohida palitra va struktura |
| Privacy | Siyosat havolasi ishlashi kerak | `app.json` + ilova ichida havola |

## 5.1.1(v) — eng oson unutiladigan

Apple 2022-yildan buni majburiy qildi: ilovada akkaunt yaratish bo'lsa,
uni **ilova ichidan** o'chirish ham bo'lishi shart. Sozlamalarga havola
yoki «bizga yozing» yetarli emas.

`auth` bloki `app/(app)/settings/delete-account.tsx` ekranini beradi.
Uni o'chirmang.

## 3.1.1 — eng qimmat xato

| Toifa | Misol | To'lov |
| --- | --- | --- |
| Raqamli | Obuna, premium funksiya, kursga kirish, virtual tovar | **Faqat IAP** |
| Jismoniy / xizmat | Yetkazib berish, taksi, sartaroshxona broni, do'kondan xarid | Tashqi to'lov ruxsat etiladi |

Payme, Click va Uzum faqat ikkinchi toifada ishlatilishi mumkin.
Birinchi toifada ular aniq rad etishga olib keladi.

## Google Play — 12 tester, 14 kun

Yangi shaxsiy dasturchi akkauntlari uchun: ilova production'ga
chiqishidan oldin **12 ta tester 14 kun davomida** yopiq testda
qatnashishi kerak.

Bu onboarding'da, **birinchi kunda** aytiladi — keyin aytilsa, mijoz
ikki hafta kutishni bilmay reja tuzadi.

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
