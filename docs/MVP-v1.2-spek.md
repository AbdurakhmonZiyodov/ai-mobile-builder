MVP SPETSIFIKATSIYASI · VERSIYA 1.2
AI mobil ilova builder
Biznes g'oyasi bor odam ilovasini do'konga chiqarsin va tirik ushlab tursin. 11 platforma tahlili asosida qayta yozilgan.
Versiya: 1.2 — narx, backend, preview va Expo xavfi qo'shilgan
Sana: 13-sentabr 2026
Loyiha egasi: Diyor Abjalilov
Asos: Lovable · Bolt.new · v0 · Cursor · Replit · Rocket.new · Google Stitch · Base44 · Emergent · a0.dev · Rork
Ko'rib chiqildi: non-tech biznes egasi · Team Lead fullstack muhandis · Staff React Native muhandis (10+ yil) · App Store va Google Play mutaxassisi


Mundarija
1. Hujjat haqida
2. Bozor va mijoz
3. Pozitsiyalash
4. Mahsulot arxitekturasi: bloklar va domen paketlari
5. Nima uchun kredit emas, «o'zgarish»
6. Narx modeli
7. MVP doirasi
8. Texnik arxitektura
9. Backend ulanish (yangi bo'lim)
10. Preview arxitekturasi: to'rt yo'l
11. Expo platformasi: xavflar va imkoniyatlar
12. E2E tekshiruv agenti
13. Do'konga chiqarish
14. O'zbekiston bozori
15. Ko'rik: non-tech biznes egasi
16. Ko'rik: Team Lead fullstack muhandis
17. Ko'rik: staff React Native muhandis
18. Ko'rik: App Store va Google Play mutaxassisi
19. Metrikalar
20. Yo'l xaritasi (16 hafta)
21. Birinchi hafta
22. Manbalar



## [Heading1] 1. Hujjat haqida
Bu MVP spetsifikatsiyasining uchinchi versiyasi. v1.1 dan keyin uchta jiddiy savol ochildi va ularning javoblari strategiyani o'zgartirdi.

## [Heading2] 1.1. v1.1 dan nima o'zgardi

--- TABLE ---
Savol | v1.1 da edi | v1.2 da bo'ldi
Narx: ilova hech qachon tugamaydi | Qat'iy narx + cheksiz iteratsiya | «O'zgarish so'rovi» birligi. Hisoblash bor, lekin birligi token emas (6-bo'lim)
Backend ulanish | Faqat bizning Supabase | Mijoz o'z Supabase yoki Firebase kalitlarini beradi (9-bo'lim)
Preview | Expo Go asosiy yo'l | To'rt yo'l, Expo Go yagona emas (10-bo'lim)
Expo platformasi xavfi | Hisobga olinmagan | Alohida bo'lim (11-bo'lim)
Expo UI | Yo'q edi | SDK 56 dan stabil: native SwiftUI va Compose (11.3)
--- END TABLE ---



--- TABLE ---
Uchinchi savolning javobi eng muhim bo'ldi Rork Expo'ni birdan tashlamagan: bir yil davomida butun biznes Expo ustida ishlagan, odamlar ilovalarini do'konga chiqarib pul topishgan. Ularning muammosi Expo sifati emas, Expo Go'ga bog'liqlik edi. Bu farqni tushunish bizning preview arxitekturamizni butunlay o'zgartiradi.
--- END TABLE ---



## [Heading1] 2. Bozor va mijoz

## [Heading2] 2.1. Raqobat tahlilining uchta xulosasi
Generatsiya tovarga aylandi. Google Stitch dizaynni bepul qilyapti va SwiftUI hamda Flutter eksport qiladi. Barcha platforma bir xil stek va bir xil modellardan foydalanadi. Rork o'z publish relsini ochiq kodga chiqargan.
Mobil segment eng kam to'ldirilgan. Lovable, Bolt, v0, Base44 — native mobil yo'q. Rork Swift'ga o'tib qimmatlashdi ($200/oy). a0.dev eng yaqin, lekin yetilmagan.
Uchta universal shikoyat: AI o'z xatosiga pul yeydi, kreditlar yonadi, obuna tugasa loyiha qulflanadi. Uchalasi ham mahsulot qarori, texnik muammo emas.

## [Heading2] 2.2. Bizning mijozimiz

--- TABLE ---
Aniq ta'rif Biznes g'oyasi va puli bor, lekin texnik jamoasi yo'q odam. Uning asl qo'rquvi «qimmat» emas — «pul to'layman, keyin tiqilib qolaman va nima qilishni bilmayman».
--- END TABLE ---



--- TABLE ---
 | U nima istaydi | U nimadan qo'rqadi
Boshida | G'oyani bir kunda ko'rish | Uch hafta kutib, kutgani chiqmasligidan
O'rtada | O'zgartirishni o'zi qila olish | Har kichik o'zgarish uchun dasturchiga qaram bo'lishdan
Do'konda | Ilovasi App Store'da bo'lishi | Rad etilib, sababini tushunmaslikdan
Keyin | Ilova ishlab turishi | Platforma yopilib, ilovasi bilan qolishdan
--- END TABLE ---



## [Heading1] 3. Pozitsiyalash

--- TABLE ---
Bir jumlada Boshqalar tez chiqarish uchun. Biz ishlab turishi uchun.
--- END TABLE ---



## [Heading2] 3.1. Uchta ustun

## [Heading3] Ustun 1: E2E tekshiruv agenti
Hech bir AI builder «sen yozgan ilova rostdan ishlaydimi?» degan savolga javob berolmaydi — ular faqat «kompilyatsiya bo'ldi» deydi. Bizda ikkinchi agent ilovani simulyatorda haqiqatan ochadi va bosib ko'radi.
Iqtisodiy asos: Replit Agent 3 ning o'zini test qilish sessiyasi mediana $0,20 turadi va Computer Use modellaridan 10 barobar arzon.

## [Heading3] Ustun 2: Rad etishlar korpusi
Har do'kon rad etishi tizimli yoziladi: qaysi band, qaysi soha, qaysi ekran va nima yordam berdi. Bu ma'lumot sotib olinmaydi va nusxa ko'chirilmaydi — faqat vaqt bilan yig'iladi.

## [Heading3] Ustun 3: Kafolat

--- TABLE ---
Mahsulot qarori «Apple rad qilsa, o'tgunicha bepul tuzatamiz.» Raqobatchilar buni aytolmaydi, chunki o'z sifatini o'lchamaydi.
--- END TABLE ---



## [Heading2] 3.2. Uchta va'da

--- TABLE ---
Bozor shikoyati | Bizning va'damiz | Amalga oshirish
AI o'z xatosiga pul yeydi | Xato tuzatish bepul | Verify gate o'tmasa hisoblanmaydi
Kreditlar oy oxirida yonadi | Qoldiq yonmaydi | Sotib olingan o'zgarishlar muddatsiz
Obuna tugasa loyiha qulflanadi | Kod har doim sizniki | GitHub sync va eksport hamma tarifda
--- END TABLE ---



## [Heading1] 4. Mahsulot arxitekturasi: bloklar va domen paketlari

## [Heading2] 4.1. Nega oddiy shablon ishlamaydi
Do'kon xavfi. Apple'ning 4.2 va 4.3 bandlari o'xshash ilovalar oqimiga qarshi. 50 ta mijoz bitta shablondan chiqsa, Apple naqsh sifatida ko'radi.
Texnik xavf. Prompt shablondan uzoqlashgan sayin agent begona kodni buzadi.
Base44 dalili. Sotib olinishdan keyin agent kattaroq qayta generatsiyaga o'tgan va kredit sarfi oshgan.

## [Heading2] 4.2. Qatlam 1: Bloklar
Kichik, qayta ishlatiladigan, do'kon qoidalariga oldindan moslangan qismlar. Agent har safar noldan yozganda detallarni goh unutadi. Blok hech qachon unutmaydi.

--- TABLE ---
Blok | Ichida nima bor | Preview
Auth | Email/parol, Apple bilan kirish (majburiy), akkauntni o'chirish ekrani (5.1.1(v)), maxfiylik matnlari | Expo Go
Ma'lumot | Supabase sxema, RLS naqshlari, offline kesh, migratsiya | Expo Go
To'lov (global) | IAP raqamli kontent uchun (3.1.1) | Dev client
To'lov (mahalliy) | Payme, Click, Uzum — faqat jismoniy tovar va xizmat uchun | Expo Go
Bildirishnoma | Ruxsat kontekst bilan, sozlamalar, opt-out | Dev client
Media | Kamera va galereya, `NSUsageDescription` to'ldirilgan | Dev client
Analitika | Ixtiyoriy, rozilik bilan; privacy labels avtomatik | Expo Go
Onboarding | Kirish oqimi, ruxsatlarni to'g'ri tartibda so'rash | Expo Go
--- END TABLE ---



--- TABLE ---
«Preview» ustuni nima uchun Har blok yonida u Expo Go'da ishlaydimi yoki dev client kerakmi ko'rsatilgan. Mijoz buni blok tanlashdan oldin ko'rishi kerak — aks holda «ilovam telefonimda ochilmayapti» degan support oqimi boshlanadi.
--- END TABLE ---



## [Heading2] 4.3. Qatlam 2: Domen paketlari
Kod emas, bilim. Har paketda uchta narsa: ma'lumot modeli, oqimlar, va eval ro'yxati (shu soha uchun «tayyor» nimani anglatishi). E2E test agenti aynan shu ro'yxat bo'yicha tekshiradi.
Birinchi beshta paket: xizmat va bron (sartaroshxona, klinika, avtoservis), kichik do'kon va katalog, kurs va ta'lim, yetkazib berish va buyurtma, ichki vosita.

--- TABLE ---
Farqi Shablonda 50 ta ilova bir xil ko'rinadi. Bloklar va domen bilimida 50 ta ilova har xil ko'rinadi, lekin bir xil to'g'ri bo'ladi.
--- END TABLE ---



## [Heading1] 5. Nima uchun kredit emas, «o'zgarish»

## [Heading2] 5.1. Muammoning ikki tomoni
Bu MVP'ning eng qiyin qarori va ikkala tomon ham haq.

--- TABLE ---
Kredit tarafdori argumenti | Kreditga qarshi argument
Ilova hech qachon tugamaydi. Mijoz bugun rang o'zgartiradi, ertaga ekran qo'shadi, indinga «bu ishlamayapti» deydi | Non-tech mijoz «necha kredit ketdi» savolini yomon ko'radi. U xarajatni oldindan bilolmaydi
Sarf o'zgaruvchan. Bitta mijoz 20 ta prompt yozadi, boshqasi 400 ta. Farq 20 barobar | Bozordagi barcha shikoyat aynan shu haqida. Lovable: ikonka almashtirishga 4,5 kredit. Replit: bir sessiyada $350
Katta kompaniyalar buni pulsizlikdan qilmagan | Ular dasturchilarga sotadi, biz biznes egalariga sotamiz
--- END TABLE ---



## [Heading2] 5.2. Yechim: hisoblash bor, birligi boshqa
Mijoz uchun tushunarli bo'lgan yagona birlik — u so'ragan ish. Token emas, kredit emas, o'zgarish.

--- TABLE ---
Qoida | Mazmuni
1 o'zgarish = 1 birlik | Mijoz nima so'rasa o'sha bitta hisoblanadi: «tugmani yashil qil» ham, «yangi ekran qo'sh» ham
Verify gate o'tmasa | Hisoblanmaydi. Bu va'da va o'zgarmaydi
Design mode bepul | Ekranlarni ko'rish, fikr o'zgartirish — cheksiz
Savol bepul | «Bu qanday ishlaydi?» pul yemaydi
Noaniq so'rov bepul | Agent avval aniqlashtiruvchi savol beradi; faqat aniq vazifa boshlanganda hisoblanadi
Qoldiq ko'rinib turadi | «Bu oy 10 tadan 4 tasi ishlatildi»
Qoldiq yonmaydi | Sotib olingan o'zgarishlar muddatsiz
--- END TABLE ---


Bizning ichki xarajatimiz o'zgaruvchan: ba'zi o'zgarish $0,05 ga, ba'zisi $2 ga tushadi. Mijoz uchun narx qat'iy, biz o'rtacha bilan yashaymiz. Bu sug'urta mantiqi.

## [Heading2] 5.3. Noaniq so'rov masalasi
Non-tech mijoz o'zgarishni noaniq so'raydi: «chiroyliroq qil», «biror narsa noto'g'ri». Har noaniq so'rov agentni bir necha urinishga majbur qiladi va bizning marjamizni yeydi.
Yechim: noaniq so'rov kelganda agent avval aniqlashtiruvchi savol beradi va bu bepul. Faqat aniq vazifa boshlanganda hisoblanadi. Bu xarajatni ham tushiradi, mijoz tajribasini ham yaxshilaydi.

## [Heading1] 6. Narx modeli

--- TABLE ---
Daraja | Narx | Nima kiradi
Sinov | $0 | Design mode cheksiz, veb preview, telefonda ko'rish, kod ko'rish. Build yo'q
Qurish | $299 bir marta | To'liq ilova + 40 o'zgarish + E2E tekshiruv + TestFlight + topshirish paketi
Yashash | $79/oy | Oyiga 10 o'zgarish + SDK yangilanishlari + crash monitoring + do'kon javoblari
Faol | $199/oy | Oyiga 40 o'zgarish + ustuvor navbat
Qo'shimcha | $5 / o'zgarish | Dona-dona. Muddatsiz, yonmaydi
Yordam bilan chiqarish | +$199 | Biz App Manager sifatida kiramiz: listing, skrinshot, submission
--- END TABLE ---



--- TABLE ---
Nega «Yashash» eng muhim qator Ilova nashr qilinganda tugamaydi, endi boshlanadi. Narx o'zgaradi, yangi xizmat qo'shiladi, Apple SDK talabini yangilaydi, crash chiqadi. Barcha raqobatchi shu momentda foydalanuvchini yolg'iz qoldiradi. Biz qoldirmasak, oylik to'lov o'z-o'zidan asoslanadi. Va sizning asosiy e'tirozingizga javob: to'xtamay o'zgartiradigan mijoz endi muammo emas, u yuqori tarifga o'tadi.
--- END TABLE ---



## [Heading2] 6.1. Birlik iqtisodiyoti

--- TABLE ---
Element | Taxminiy | Izoh
Bitta ilovaning AI xarajati | $12–18 | 30–50 xabar, marshrutizatsiya va caching bilan
E2E tekshiruv sessiyalari | $2–4 | Sessiyasiga ~$0,20
Infratuzilma | $3–6 | Konteyner, build, saqlash
Jami | $17–28 | 
$299 dan marja | ~$270 | Bundan support vaqti chiqadi
O'rtacha bitta o'zgarish | $0,30–0,60 | $5 narxda sog'lom marja
O'rtacha kafolat xarajati | ~$15 / ilova | 15.4-bo'limdagi hisob
--- END TABLE ---


Diqqat: non-tech mijoz ko'p savol beradi. Bitta murakkab support holati bir soatlik vaqtingizni yeydi. $299 mahsulot narxi emas, xizmat narxi.

## [Heading2] 6.2. O'zbekiston uchun narx
Qurish: 1 900 000 so'm (40 o'zgarish bilan)
Yashash: 490 000 so'm/oy (10 o'zgarish)
Faol: 1 200 000 so'm/oy (40 o'zgarish)
Qo'shimcha o'zgarish: 45 000 so'm
Global narxdan taxminan 40% past, lekin xarajatni qoplaydi.

## [Heading1] 7. MVP doirasi

--- TABLE ---
Funksiya | v1.2 | v1.3 | Keyin
Prompt → Expo (React Native) ilova | ✓ |  | 
Design mode (ekranlar, kodsiz, bepul) | ✓ |  | 
Bloklar tizimi (preview belgisi bilan) | ✓ |  | 
Domen paketlari (5 ta) | ✓ |  | 
Veb preview (birinchi yo'l) | ✓ |  | 
Expo Go preview (ikkinchi yo'l) | ✓ |  | 
`eas go` — o'z Expo Go build'i (uchinchi yo'l) | ✓ |  | 
Dev client (to'rtinchi yo'l) | ✓ |  | 
Expo UI (native SwiftUI / Compose primitivlar) | ✓ |  | 
SDK versiyasini qotirish va migratsiya boshqaruvi | ✓ |  | 
Nuqtali diff, versiya tarixi, Undo/Revert | ✓ |  | 
Verify gate (typecheck, lint, bundle) | ✓ |  | 
E2E tekshiruv agenti | ✓ |  | 
Xatoni bepul tuzatish (3 urinish, halol to'xtash) | ✓ |  | 
Mijozning Supabase yoki Firebase kalitlariga ulanish | ✓ |  | 
O'zgarish hisoblagichi va qoldiq ko'rsatkichi | ✓ |  | 
Kod ko'rish va GitHub eksport | ✓ |  | 
Dasturchiga topshirish paketi | ✓ |  | 
EAS Build → IPA/AAB | ✓ |  | 
TestFlight publish (`asc` CLI) | ✓ |  | 
Review Checker | ✓ |  | 
Vizual muharrir (elementni bosib tahrirlash) |  | ✓ | 
Skrinshot studiyasi |  | ✓ | 
App Manager rejimi |  | ✓ | 
Payme / Click / Uzum bloki |  | ✓ | 
O'z preview ilovamiz (Expo Go o'rniga) |  | ✓ | 
Rad etishlar dashboardi |  | ✓ | 
Google Play to'liq oqimi |  | ✓ | 
Bulutli simulyator (Mac ferma) |  |  | ✓
Native Swift / Kotlin |  |  | ✓
--- END TABLE ---



## [Heading1] 8. Texnik arxitektura

--- TABLE ---
Qatlam | Tarkibi | Texnologiya
Mijoz | Chat, preview, fayl daraxti, diff, Publish sehrgari | Next.js, React, Tailwind, Monaco
API / Orkestrator | Sessiya, navbat, agent tsikli, o'zgarish hisobi, SSE | Node 20+ yoki Bun, tRPC, SSE
Agent yadrosi | Marshrutizatsiya, kontekst yig'ish, tool-calling | TypeScript
Model qatlami | Abstraksiya: `generate(messages, tools, tier)` | Vercel AI Gateway yoki o'z qatlam
Workspace | Izolyatsiyalangan FS, npm, Metro, typecheck | Firecracker microVM yoki Docker + gVisor
Preview | To'rt yo'l (10-bo'lim) | Metro, tunnel, `eas go`, EAS dev client
E2E tekshiruv | Simulyatorda avtomatik bosib chiqish | Maestro + vision model
Build | EAS Build, holat kuzatuvi | EAS API + job runner
Publish | `asc` CLI, ASC API, skrinshot | Go binary + SSE
Ma'lumot | Loyiha, versiya, xabar, o'zgarishlar, rad etishlar | Postgres + S3-mos saqlash
--- END TABLE ---



## [Heading2] 8.1. Agent pipeline
Qabul va tasniflash (arzon model): kichik tahrir / o'rta / katta / savol / noaniq. Noaniq bo'lsa — aniqlashtiruvchi savol, bepul.
Kontekst yig'ish: `DESIGN.md`, `PROJECT.md`, `MAP.md`, oxirgi 5 xabar, qidiruv orqali 3–8 fayl. Butun repo hech qachon yuborilmaydi.
Reja (katta vazifada).
Bajarish tsikli tool'lar bilan; `edit_file` nuqtali diff, to'liq qayta yozish taqiqlangan.
Verify gate: typecheck, ESLint, Metro bundle. O'tmasa foydalanuvchiga ko'rsatilmaydi.
E2E tekshiruv (katta o'zgarishda).
Preview yangilanishi va versiya (git commit).
Hisob: o'zgarish yoziladi, qoldiq ko'rsatiladi.

## [Heading2] 8.2. Kontekst byudjeti

--- TABLE ---
Bo'lak | Hajm | Qoida
Tizim prompti va tool ta'riflari | ~3 000 | Statik, keshlanadi
`DESIGN.md` + `PROJECT.md` | ~1 500 | Har biri 60 qatordan oshmasin
`MAP.md` | ~1 000 | Har xabarda
Suhbat xulosasi | ~1 500 | Oxirgi 5 to'liq, qolgani xulosa
Tegishli fayllar | ~15 000 | Qidiruv natijasi, chegara qattiq
Tool javoblari | ~20 000 | 4 000 dan oshsa qisqartiriladi
--- END TABLE ---



## [Heading2] 8.3. Xato tuzatish
Verify gate o'tmasa agent avtomatik tuzatadi, hisoblanmaydi.
Ko'pi bilan 3 urinish, har safar kontekst toraytiriladi.
3 dan keyin halol to'xtash: «Bu xatoni hal qila olmadim. Oxirgi ishlagan versiyaga qaytaraymi?»
Bir xil xato ikki marta — model arzondan kuchligiga.
Hech qachon «tuzatdim» deb aytib, diff bo'sh bo'lmasin.

## [Heading1] 9. Backend ulanish (yangi bo'lim)

## [Heading2] 9.1. Mijoz o'z kalitlarini beradi
Ha, bu aynan shunday ishlaydi va Rork'da ham, Lovable'da ham, a0.dev'da ham shu tarzda. Mijoz o'z loyihasini yaratadi va bizga ulanish ma'lumotlarini beradi.

--- TABLE ---
Xizmat | Nima kerak | Qayerda ishlatiladi
Supabase (standart) | Loyiha URL'i, `anon` kalit, `service_role` kalit | `anon` — ilovada; `service_role` — faqat serverda, sxema yaratish uchun
Firebase (ixtiyoriy) | `google-services.json`, `GoogleService-Info.plist`, veb konfiguratsiya | Ilovada
--- END TABLE ---


Agent shundan keyin sxema yaratadi, RLS qoidalarini yozadi, klientni sozlaydi va ilovani ulaydi.

## [Heading2] 9.2. Uchta qat'iy qoida

--- TABLE ---
1. Kalitlar mijozniki bo'lishi shart Agar biz Supabase loyihasini o'zimiz yaratsak, mijoz ketganda ma'lumoti bizda qoladi — bu lock-in. Rork buni tushungani uchun backend'ni bir marta mijozning Supabase tashkilotiga o'tkazish imkonini bergan, URL va ma'lumot saqlanib qolgan holda. Base44'ning eng katta zaifligi esa aynan buning yo'qligi.
--- END TABLE ---



--- TABLE ---
2. `service_role` kaliti o'ta xavfli U RLS'ni butunlay chetlab o'tadi. Shuning uchun: hech qachon generatsiya qilingan kodga tushmasin, faqat serverda shifrlangan holda (KMS), sxema o'zgarishi tugagach sessiyadan o'chirilsin, ilovaga faqat `anon` kalit ketsin. Base44 ikkita jiddiy zaiflik ko'rgani bejiz emas: ularning ruxsat modeli standart holatda ochiq edi.
--- END TABLE ---



--- TABLE ---
3. RLS kod emas, blok bo'lishi kerak AI generatsiya qilgan RLS qoidalari eng xavfli joy: bitta xato butun bazani ochib qo'yadi. Auth blokimiz tayyor, sinovdan o'tgan RLS naqshlari bilan kelsin va agent ularni faqat parametrlashtirsin, noldan yozmasin.
--- END TABLE ---



## [Heading2] 9.3. Nega Supabase standart
Supabase Postgres, ya'ni mijoz istalgan payt ma'lumotini oddiy SQL dump bilan ko'chira oladi. Firebase'dan chiqish ancha og'ir va bu bizning «kod va ma'lumot sizniki» va'damizga zid. Firebase qo'llab-quvvatlanadi, lekin standart emas.

## [Heading2] 9.4. Ulanish oqimi
Mijoz «Ma'lumotlar bazasi kerak» deydi yoki blok tanlaydi.
Bizda ikki tugma: «Menda bor» yoki «Yaratishga yordam bering».
«Yaratishga yordam bering» — qadamba-qadam yo'riqnoma (rasmlar bilan), lekin loyiha mijozning akkauntida yaratiladi.
Kalitlar shifrlangan holda saqlanadi; `service_role` ishlatilgach o'chiriladi.
Agent sxema va RLS'ni Auth blokidagi naqshlar asosida yozadi.
Test: E2E agent ro'yxatdan o'tish va ma'lumot saqlashni haqiqatan sinab ko'radi.

## [Heading1] 10. Preview arxitekturasi: to'rt yo'l

## [Heading2] 10.1. Nega bitta yo'l yetarli emas

--- TABLE ---
Rork'ning haqiqiy muammosi Rork'ning preview'i Android'da Expo Go orqali ishlardi. Bu degani sizning mahsulotingiz Apple'ning boshqa kompaniya ilovasini tasdiqlashiga bog'liq bo'lib qoladi. Bu nazariy xavf emas: Expo Go'ning SDK 55 versiyasi 2026-yil fevraldan mayga qadar Apple ko'rigida qolib ketdi va Expo muddat aytolmadi. App Store'dagi versiya SDK 54 da qoldi. Tasavvur qiling: mijozlaringiz ilovasini telefonida ko'ra olmayapti va siz buni tuzata olmaysiz, chunki bu sizning ilovangiz emas.
--- END TABLE ---



## [Heading2] 10.2. To'rt yo'l

--- TABLE ---
Yo'l | Qachon | Kim boshqaradi | Cheklovi
1. Veb preview | Har doim birinchi, darhol | Biz | Native modullar yo'q
2. Expo Go | Oddiy ilovalar, tez ko'rish | Expo va Apple | Faqat Expo SDK modullari; SDK versiyasi Expo Go'nikiga bog'liq
3. `eas go` | Expo Go ishlamasa yoki SDK mos kelmasa | Biz (mijozning TestFlight'ida) | Apple Developer akkaunti kerak
4. Dev client | Uchinchi tomon native modul kerak bo'lganda | Biz | EAS build 5–15 daqiqa
--- END TABLE ---



## [Heading2] 10.3. `eas go` — eng muhim topilma
Bu 2026-da qo'shilgan buyruq va aynan shu muammo uchun yaratilgan: o'zingizning Expo Go build'ingizni yasab, o'z Apple akkauntingiz orqali TestFlight'ga yuklaysiz. Ya'ni Apple'ning Expo ilovasini tasdiqlashini kutmaysiz.
Bu Rork qilgan narsaning (o'z preview ilovasini qurish) rasmiy va arzon versiyasi. Expo SDK 55 va 56 ni `eas go` bilan qo'llab-quvvatlashini e'lon qilgan.

## [Heading2] 10.4. Qaror mantig'i
Loyiha yaratilganda veb preview darhol ishlaydi — mijoz 90 soniyada natijani ko'radi.
Tanlangan bloklar tekshiriladi. Hammasi Expo Go'da ishlasa → QR kod beriladi.
Agar blok dev client talab qilsa yoki Expo Go SDK'si mos kelmasa → mijozdan Apple akkaunti so'raladi va `eas go` yoki dev client yig'iladi.
Har holatda mijozga nima uchun shunday ekani bir jumlada tushuntiriladi.

## [Heading2] 10.5. O'z preview ilovamiz (v1.3)
Uzoq muddatda o'z ilovamiz kerak — Rork ham shu yo'ldan borgan. Muhim tafsilot: App Store'dagi Rork ilovasi Developer Tools kategoriyasida va tavsifida «dasturchilar uchun mo'ljallangan, biroz dasturlash bilimi tavsiya etiladi» deb yozilgan.
Bu ularning non-tech marketingiga zid, lekin bu muvofiqlik manevri: Apple bunday ilovalarni faqat dasturchi vositasi sifatida qabul qiladi. Va bu ham kafolat bermaydi — Rork ilovasi bir muddat App Store'dan yo'q bo'lgan va keyin qaytgan.
Xulosa: o'z ilovamiz bo'lsin, lekin u ham yagona yo'l bo'lmasin.

## [Heading1] 11. Expo platformasi: xavflar va imkoniyatlar

## [Heading2] 11.1. Rork Expo'ni birdan tashlamagan

--- TABLE ---
Vaqt | Holat
2025-fevral | Expo/React Native bilan ishga tushdi
2025-aprel | 550 ming $ ARR — sof Expo ustida
2025-iyun | 1 mln $ ARR, 4 kishi — hali Expo
2026-fevral | Rork Max: native Swift
Bugun | Yangi Expo loyihalari yaratilmaydi, eskilari ishlaydi
--- END TABLE ---


Bir yil davomida butun biznes Expo ustida qurilgan, odamlar ilovalarini do'konga chiqarib pul topishgan. Muammo Expo sifati emas, Expo Go'ga bog'liqlik edi.

## [Heading2] 11.2. Expo o'zi Expo Go'dan uzoqlashtirmoqda
Expo rasman aytdi: Expo Go — tez boshlash uchun, birinchi navbatda ta'limiy vosita. Boshqa maqsadda ishlatilayotgan bo'lsa, development build'ga o'tish tavsiya etiladi. Va qo'shimcha qildi: Expo Go'ning moslashuvchanligi uni boshqa maqsadlarga moslashtirishga imkon berganini tushunishadi va bu yangilik ba'zilar uchun umidsizlantiruvchi bo'lishini bilishadi.
Bu to'g'ridan-to'g'ri bizdek mahsulotlarga aytilgan. Reja shunga ko'ra tuzilishi kerak.

## [Heading2] 11.3. Expo UI: bizning foydamizga o'zgarish

--- TABLE ---
SDK 56 (2026-may): `@expo/ui` stabil Bitta JS importi iOS'da SwiftUI, Android'da Jetpack Compose beradi. JavaScript'da qayta yozilgan taqlid emas — haqiqiy native primitivlar. Expo'ning tushuntirishi: Apple va Google SwiftUI hamda Compose'ga katta sarmoya kiritmoqda, eng yangi API'lar avval o'sha yerda paydo bo'ladi; ularni JS'da qayta yozish behuda mehnat. Eng muhim jumla: API'lar SwiftUI va Compose konvensiyalariga amal qilgani uchun, o'sha freymvorklarni biladigan har qanday dasturchi yoki AI yangi narsa o'rganmasdan Expo UI kodini yoza oladi.
--- END TABLE ---


Bu to'g'ridan-to'g'ri Rork'ning «agent Swift'da yaxshiroq yozadi» degan dalilini zaiflashtiradi. SDK 56 dan keyin agent React Native ichida turib SwiftUI komponentlarini yoza oladi.
Expo UI `create-expo-app` standart shablonida va Expo Go ichida bor.
SDK 56 mashhur kutubxonalar uchun drop-in almashtiruvchilar qo'shdi: segmented control, picker, datetimepicker, masked view, bottom sheet. Ko'pincha faqat import o'zgaradi.
Biz uni birinchi kundan standart qilamiz — chiqish sifati native darajasida bo'ladi va agent SwiftUI hujjatlariga tayanadi.

## [Heading2] 11.4. SDK versiyasini qotirish
Expo yiliga uch marta SDK chiqaradi, har biri buzuvchi o'zgarishlar bilan:
SDK 55 Legacy Architecture qo'llab-quvvatlashini to'xtatdi.
SDK 56 da Hermes V1 xotira regressiyasi bor edi (`react-native-worklets` va `reanimated` ishlatgan ilovalarga ta'sir qilgan), SDK 57 da tuzatildi.
SDK 55 dan boshlab barcha paketlar SDK bilan bir xil major versiyani ishlatadi va paketlar SDK'lar orasida mos kelmasligi rasman e'lon qilingan.

--- TABLE ---
Qoida | Sabab
Mijoz loyihasi bitta SDK'da qotiriladi | Avtomatik yangilanish mavjud ilovani buzadi
Migratsiya alohida, pullik xizmat | Bu haqiqiy ish va vaqt talab qiladi
Biz bir vaqtda ko'pi bilan ikki SDK ni qo'llab-quvvatlaymiz | Ko'proq bo'lsa test yuki ko'tarilmaydi
Yangi SDK chiqqach 3 oy sinov davri | Regressiyalar odatda shu vaqtda topiladi
--- END TABLE ---



## [Heading2] 11.5. Xavf registri

--- TABLE ---
Xavf | Ehtimol | Rejamiz
Expo Go yangi SDK bilan App Store'da kechikadi | Yuqori (2026-da bo'lgan) | `eas go` ikkinchi yo'l sifatida tayyor turadi
Expo Go butunlay to'xtatiladi | O'rta | To'rt yo'lning uchtasi baribir ishlaydi
Bizning preview ilovamiz App Store'dan olinadi | O'rta (Rork'da bo'lgan) | Developer Tools kategoriyasi; veb preview va `eas go` zaxira
SDK yangilanishi loyihalarni buzadi | Yuqori | Qotirish + 3 oylik sinov davri
EAS narxi oshadi yoki siyosat o'zgaradi | O'rta | Build'ni o'z Mac fermamizga ko'chirish rejasi (v2)
Expo sotib olinadi yoki yo'nalish o'zgartiradi | Past | Kod React Native, Expo'siz ham ishlaydi (bare workflow)
--- END TABLE ---



## [Heading1] 12. E2E tekshiruv agenti

## [Heading2] 12.1. Bosqichlar

--- TABLE ---
Bosqich | Nima qilinadi | Texnologiya
1. Ssenariy tuzish | Domen paketining eval ro'yxati + generatsiya qilingan ekranlardan | LLM + paket metadata
2. Ishga tushirish | Simulyator yoki emulyatorda ilova ochiladi | `xcrun simctl` / Android emulator
3. Bosib chiqish | Har ekran, asosiy tugmalar, forma to'ldirish, navigatsiya | Maestro
4. Ko'rish | Har qadamda skrinshot va vision model tekshiruvi | Vision model
5. Hisobot | Nima ishladi, nima yo'q, qayerda to'xtadi | JSON + mijozga sodda til
--- END TABLE ---



## [Heading2] 12.2. Nimani tekshiradi
Oqim butunligi: ro'yxatdan o'tish → asosiy ekran → asosiy amal → natija.
Ma'lumot saqlanishi: kiritilgan narsa qayta ochilganda joyidami. Backend ulangan bo'lsa — haqiqiy Supabase'ga yozilyaptimi.
Navigatsiya: orqaga qaytish buzilmaydimi. AI eng ko'p shu yerda xato qiladi.
Bo'sh va xato holatlari.
Qulaylik: kontrast va bosish maydoni o'lchami.
Do'kon talablari: placeholder matn, ishlamaydigan tugma.

## [Heading2] 12.3. Beqarorlik muammosi
E2E testlar tabiatan «flaky»: bir xil ilova bir safar o'tadi, bir safar yo'q. Yechim: uch marta takrorlash va ko'pchilik natijasi. Aniq muvaffaqiyatsizliklar (crash, bo'sh ekran) alohida ajratiladi va darhol xabar qilinadi.

## [Heading1] 13. Do'konga chiqarish

## [Heading2] 13.1. Akkauntlar kimda

--- TABLE ---
Qat'iy qoida Biz hech qachon Apple yoki Google akkauntining egasi bo'lmaymiz. Aks holda bitta mijozning qoidabuzarligi butun akkauntimizni yopadi va o'sha akkauntdagi hamma ilova yo'qoladi. Xavfsiz yo'l Apple'ning o'z tizimida: mijoz o'z akkauntini ochadi va bizni App Manager roli bilan taklif qiladi.
--- END TABLE ---



## [Heading2] 13.2. Apple akkaunti — yashirin to'siq
Bu auditoriya uchun eng og'riqli joy kod emas, akkaunt ochish. Kompaniya nomidan ro'yxatdan o'tish D-U-N-S raqamini talab qiladi va u bir necha kun oladi. Keyin soliq shakllari, bank rekvizitlari, Paid Applications shartnomasi, 2FA. Birinchi marta qilayotgan odam bir hafta yo'qotadi yoki tashlab qo'yadi.
Bizning mahsulotimiz shu jarayonni qadamba-qadam olib borsa, bu kod generatsiyasidan ko'ra ko'proq minnatdorchilik keltiradi — va buni hech bir raqobatchi jiddiy qilmayapti.

## [Heading2] 13.3. Review Checker

--- TABLE ---
Band | Nima | Checker nimani qidiradi
4.2 | Minimum functionality — eng ko'p rad etish sababi | Ekranlar soni, o'ziga xos funksiya
4.3 | Spam / duplicate | Oldingi ilovalar bilan o'xshashlik
5.1.1 | Ruxsat so'rovlari sababsiz | Har `NSUsageDescription` bormi va mazmunlimi
5.1.1(v) | Akkaunt o'chirish majburiy | Auth bor, «o'chirish» ekrani yo'q
3.1.1 | Raqamli kontent uchun IAP | Tashqi to'lov havolasi bormi
2.1 | To'liqlik | «Lorem ipsum», «TODO», bo'sh `onPress`
Privacy | Siyosat havolasi va nutrition labels | Havola ishlaydimi
Login | Uchinchi tomon login bo'lsa Apple login ham | Google/Facebook bor, Apple yo'q
--- END TABLE ---



## [Heading2] 13.4. Dasturchiga topshirish paketi
Bitta tugma generatsiya qiladi: repo va toza commit tarixi, `README.md`, `ARCHITECTURE.md` (ekranlar xaritasi, ma'lumot modeli, tashqi API'lar), `HANDOFF.md` (nima tugallangan, nima yo'q, texnik qarz), `.env.example`, akkauntlar jadvali, va taxminiy soatlar.

--- TABLE ---
Nega bu kuchli Bu biznes egasiga dasturchi bilan gaplashish uchun til beradi. U endi «menga ilova kerak» demaydi, «mana kod, mana hujjat, mana qolgan ishlar» deydi. Freelancer narxni aniq aytadi.
--- END TABLE ---



## [Heading1] 14. O'zbekiston bozori

## [Heading2] 14.1. Nega mahalliy bozordan boshlash
Global o'yinchilar Payme, Click va Uzum integratsiyasini hech qachon qilmaydi.
O'zbek va rus tilidagi interfeys hamda support — haqiqiy to'siq.
Birinchi 100 mijoz bilan yuzma-yuz ishlab, mahsulotni haqiqiy foydalanishda charxlash mumkin.
Rad etishlar korpusi shu yerda boshlanadi.

## [Heading2] 14.2. To'lov bloki

--- TABLE ---
Tizim | Integratsiya | Bizning blokda
Payme | Merchant API (JSON-RPC): `CheckPerformTransaction`, `CreateTransaction`, `PerformTransaction`, `CancelTransaction` | Tayyor webhook handler, test rejimi, summa tiyinlarda
Click | Click-up: `service_id`, `merchant_id`, `merchant_user_id`, `secret_key` | Prepare/Complete oqimi
Uzum | Biller / open-service | Webhook handler
Paynet | Merchant ID | Ixtiyoriy
--- END TABLE ---


Tayyor poydevor bor: `paytechuz` kutubxonasi Payme, Click, Uzum, Paynet va Octo ni bitta interfeysda birlashtiradi (Django va FastAPI uchun), hamda TypeScript SDK'lari mavjud. Biz shularni React Native tomoniga moslab beramiz.

--- TABLE ---
Diqqat: 3.1.1 bandi Raqamli kontent yoki xizmat → In-App Purchase majburiy. Obuna, premium funksiya, virtual tovar, kursga kirish huquqi — hammasi raqamli. Jismoniy tovar yoki real dunyo xizmati → tashqi to'lov ruxsat etiladi. Yetkazib berish, taksi, sartaroshxona broni, do'kondan xarid. Payme, Click va Uzum faqat ikkinchi toifada ishlatilishi mumkin. Birinchi toifada ular aniq rad etishga olib keladi. To'lov blokimiz buni avtomatik aniqlashi va noto'g'ri tanlovda build'ni to'xtatishi shart.
--- END TABLE ---



## [Heading2] 14.3. Mahalliy xususiyatlar
Telegram integratsiyasi. Bizda biznesning katta qismi Telegram orqali ishlaydi. «Buyurtma kelganda Telegram'ga xabar» — juda talab qilinadigan funksiya.
SMS: mahalliy provayderlar (Eskiz, Playmobile) orqali tasdiqlash kodi.
So'm formati va katta summalar.
Offline rejim — internet uzilishlari hisobga olinadi.
Ikki til: o'zbek (lotin) va rus.

## [Heading2] 14.4. Birinchi mijozlar
Tanish biznes egalari orasidan 5 ta pilot — bepul, natija evaziga.
Ularning ilovalarini do'konga chiqarib, keys sifatida ko'rsatish.
Telegram kanallar va mahalliy biznes hamjamiyatlari.
Base44 darsi: pullik marketingsiz, og'izdan-og'izga. Birinchi haftalarda 10 000 foydalanuvchi faqat mahsulot sifati hisobiga.

## [Heading1] 15. Ko'rik: non-tech biznes egasi

## [Heading2] 15.1. Nima yaxshi
«Oyiga 10 ta o'zgarish» tushunarli jumla. «100 kredit» esa yo'q.
Kafolat mening asosiy qo'rquvimga javob beradi.
Yordam bilan chiqarish — men App Store Connect'ni ochishni ham bilmayman.
Kod menda qoladi.

## [Heading2] 15.2. Nima tushunarsiz

--- TABLE ---
Mijozning savoli | Biz nima qilishimiz kerak
«Apple Developer akkaunti nima? D-U-N-S nima?» | Video yo'riqnoma o'zbek tilida + checklist + «biz siz uchun to'ldiramiz» opsiyasi
«$99 yana alohidami?» | Barcha xarajatlar bitta jadvalda: bizning narx + Apple $99/yil + Google $25 + Supabase (bepul tarif yetadi)
«Nima bitta o'zgarish hisoblanadi?» | Misollar bilan sahifa: «rangni o'zgartirish — 1», «yangi ekran — 1», «savol berish — 0», «xato tuzatish — 0»
«E2E tekshiruv nima?» | Bu so'zni ishlatmang. «Ilovangizni o'zimiz ochib, har tugmasini bosib tekshiramiz»
«Nega telefonimda ochilmayapti?» | Blok tanlashda oldindan ko'rsatish: bu blok dev client talab qiladi
«12 ta tester 14 kun nima degani?» | Google Play talabini onboardingda, birinchi kunda aytish
--- END TABLE ---



--- TABLE ---
Mijoz tili Har ekran, har email uchta savolga javob berishi kerak: 1. Qancha turadi? 2. Qachon tayyor bo'ladi? 3. Ishlamasa nima bo'ladi?
--- END TABLE ---



## [Heading1] 16. Ko'rik: Team Lead fullstack muhandis

## [Heading2] 16.1. Qizil chiroq

--- TABLE ---
Xavf | Nima bo'ladi | Yechim
Noaniq so'rovlar marjani yeydi | «Chiroyliroq qil» → agent 5 marta urinadi | Aniqlashtiruvchi savol bepul va majburiy noaniq so'rovda
Support yuki | 20 mijoz = kuningizning yarmi | FAQ, video, Telegram bot birinchi daraja; inson ikkinchi
E2E beqarorligi | Flaky testlar | 3 marta takrorlash, ko'pchilik natijasi
Sovuq start | 3 daqiqadan oshsa mijozning yarmi ketadi | Isitilgan konteyner hovuzi 1-haftada
Xavfsizlik | Begona kod bizning infrastrukturada | 16.2-bo'lim
Ma'lumot yo'qolishi | Konteyner o'chadi | Har xabar git commit, snapshot, konteyner vaqtinchalik
Model drifti | Provayder modelni yangilaydi | 30 vazifalik eval; yangilashdan oldin ishga tushiriladi
Bir kishi charchaydi | Eng real xavf | Doira qattiq ushlansin
--- END TABLE ---



## [Heading2] 16.2. Xavfsizlik

--- TABLE ---
Qatlam | Talab
Izolyatsiya | Firecracker microVM yoki gVisor. Oddiy Docker yetarli emas
Tarmoq | Standart holat yopiq. Oq ro'yxat: npm, GitHub, Supabase, model API'lari
Sirlar | Hech qachon faylda emas. Mijoz kalitlari KMS'da shifrlangan. `service_role` ishlatilgach o'chiriladi
Ruxsatlar | Standart holat yopiq (deny by default). Base44'ning xatosi teskarisi edi
Ma'lumot ajratish | Har mijoz o'z Supabase loyihasida. Umumiy baza yo'q
Kod xavfsizligi | Har buildda `npm audit`
Publish kalitlari | Apple kalitlari mijozniki, bizda vaqtinchalik shifrlangan; publish'dan keyin o'chiriladi
Audit log | Publish va akkaunt amallari uchun majburiy
--- END TABLE ---



## [Heading2] 16.3. Serverlar

--- TABLE ---
Bosqich | Nima kerak | Taxminiy xarajat
MVP (0–50 mijoz) | 1 app server (4 vCPU), 1 Postgres, 3–5 workspace konteyner, S3-mos saqlash | $150–300/oy
O'sish (50–300) | Auto-scaling hovuz, job runner, Redis navbat, CDN | $800–2000/oy
Miqyos (300+) | Ko'p mintaqa, ajratilgan build runnerlar, monitoring | $5000+/oy
--- END TABLE ---


Mintaqa: Yevropa (Frankfurt yoki Amsterdam) — O'zbekistonga kechikish maqbul.
Provayder: MVP uchun Hetzner + Cloudflare R2.
Monitoring 1-kundan: Sentry, uptime, va har mijoz uchun AI xarajati dashboard'i.

## [Heading1] 17. Ko'rik: staff React Native muhandis

## [Heading2] 17.1. Expo Go devori

--- TABLE ---
Onboardingda ochiq ayting Expo Go faqat Expo SDK ichidagi native modullarni ishlatadi. Uchinchi tomon native paket (RevenueCat, maxsus kamera, MMKV) qo'shilishi bilan Expo Go ishlamay qoladi. Shundan keyin dev client kerak: EAS orqali 5–15 daqiqada yig'iladi. Bloklar jadvalida har blok yonida preview turi ko'rsatilgan (4.2-bo'lim) — aynan shu muammoni oldini olish uchun.
--- END TABLE ---



## [Heading2] 17.2. Amaliy cheklovlar

--- TABLE ---
Cheklov | Nima bo'ladi | Nima qilamiz
Push bildirishnoma | Simulyatorda kelmaydi | E2E'da sinamaymiz; alohida qo'lda qadam
Kamera | Simulyatorda yo'q | «Telefonda tekshiring» deb aytiladi
SDK yangilanishi | Mavjud loyihalarni buzadi | Qotirish + 3 oylik sinov davri (11.4)
Metro | Katta loyihada sekinlashadi | RAM limiti; loyiha hajmi ~200 fayl
Navigatsiya | AI eng ko'p shu yerda xato qiladi | Navigatsiya blok, agent generatsiya qilmaydi
Ro'yxat unumdorligi | AI `FlatList` o'rniga `map` ishlatadi | Lint qoidasi majburiy
Ilova hajmi | Expo ilovalari katta bo'ladi | Keraksiz paketlarni tozalash, hajm hisoboti
--- END TABLE ---



## [Heading2] 17.3. Kod sifati talablari
TypeScript strict — modelga ko'proq cheklov, kamroq xato.
Expo UI standart (11.3) — native primitivlar, agent SwiftUI hujjatlariga tayanadi.
ESLint + RN qoidalari verify gate'da majburiy.
Fayl hajmi: 300 qatordan katta komponent bo'linadi. AI uzun fayllarda adashadi.
Papka strukturasi qotirilgan: `app/`, `components/`, `lib/`, `hooks/`, `types/`.
`edit_file` majburiy, to'liq qayta yozish taqiqlangan. 400 qatorli ekranni qayta yozish ~6000 token, nuqtali diff ~200.

## [Heading2] 17.4. Nima qilib bo'lmaydi (narx sahifasida bo'lsin)
Murakkab animatsiyalar va o'yin mexanikasi.
Chuqur native integratsiyalar: Bluetooth, NFC, maxsus SDK'lar.
Og'ir offline sinxronizatsiya konflikt yechimi bilan.
Real vaqtdagi video yoki ovoz.
Apple Watch, widget, Live Activities.

## [Heading1] 18. Ko'rik: App Store va Google Play mutaxassisi

## [Heading2] 18.1. Eng katta xavf: 4.2 va 4.3

--- TABLE ---
Xavf | Nega | Yumshatish
4.2 | Ilova shablon yoki juda sodda ko'rinsa | Domen paketlari o'ziga xoslikni talab qiladi; Checker ekran va funksiya sonini baholaydi
4.3 | Bizdan chiqqan ilovalar o'xshash bo'lsa | Har mijoz uchun dizayn tizimi alohida. Kod strukturasi ham xilma-xil bo'lsin
Ommaviy rad etish | Apple bizni naqsh sifatida aniqlasa | Akkauntlar mijozlarda — bog'lanish yo'q
--- END TABLE ---



## [Heading2] 18.2. Kafolatning moliyaviy modeli

--- TABLE ---
Ssenariy | Ehtimol | Bizga xarajat
Birinchi urinishda o'tadi | Maqsad: 70% | $0
Bir marta rad etilib, tuzatilgach o'tadi | ~25% | ~$30
Ikki-uch marta rad etiladi | ~5% | ~$150
--- END TABLE ---


O'rtacha ~$15 bitta ilovaga. Lekin birinchi urinishda o'tish 50% dan pastga tushsa, model buziladi. Review Checker va E2E tekshiruv ixtiyoriy emas — ular kafolatning shartidir.

## [Heading1] 19. Metrikalar

--- TABLE ---
Metrika | Maqsad | Nega muhim
Birinchi preview vaqti | < 90 soniya | Mijozni yo'qotmaslik chegarasi
Birinchi urinishda kompilyatsiya | ≥ 85% | Verify gate yuki
E2E tekshiruvdan o'tish | ≥ 75% | «Ishlaydi» so'zining o'lchovi
Do'konda birinchi urinishda o'tish | ≥ 70% | Kafolatning moliyaviy asosi
Bitta ilovaning AI xarajati | < $20 | Marja
Bitta o'zgarishning xarajati | < $0,60 | $5 narxda marja
Noaniq so'rov ulushi | < 25% | Aniqlashtiruvchi savol samaradorligi
Support soati bitta mijozga | < 1,5 soat | Masshtablanish
Oylik tarif retention (6 oy) | ≥ 60% | Barqaror daromad
--- END TABLE ---



## [Heading1] 20. Yo'l xaritasi (16 hafta)

--- TABLE ---
Hafta | Bosqich | Natija
1 | Riskni oldinga surish | Konteynerda Expo ilova ishga tushadi, tunnel ochiladi, telefonda Expo Go bilan ko'rinadi. `eas go` ham sinab ko'riladi. AI yo'q
2 | Workspace | Isitilgan hovuz, fayl API, Metro, loglar, xavfsizlik izolyatsiyasi
3–4 | Agent yadrosi | Tool to'plami, tsikl, kontekst, model abstraksiyasi, `MAP.md`
5 | Bloklar | Auth, ma'lumot, bildirishnoma. Har biri do'kon talablari va preview belgisi bilan
6 | Verify gate + xato tsikli + o'zgarish hisobi | Typecheck, lint, bundle. 3 urinish bepul. Hisoblagich va qoldiq
7 | Frontend | Chat, preview, fayl daraxti, diff, versiya tarixi, qoldiq ko'rsatkichi
8 | Design mode + to'rt yo'lli preview | Savollar, ekran taklifi, `DESIGN.md`. Veb, Expo Go, `eas go`, dev client
9–10 | E2E tekshiruv agenti | Maestro, ssenariy generatsiyasi, vision tekshiruv, hisobot
11 | Backend ulanish | Supabase va Firebase kalitlari, RLS bloklari, sxema generatsiyasi
12 | Domen paketlari | 5 ta paket: model, oqimlar, eval ro'yxati
13 | EAS Build + TestFlight | `asc` integratsiyasi, publish sehrgari, jonli log
14 | Review Checker + topshirish paketi | Apple bandlari tekshiruvi; README, ARCHITECTURE, HANDOFF
15 | Billing va eval | Stripe + mahalliy to'lov; 30 vazifalik to'plam, xarajat optimizatsiyasi
16 | 5 ta pilot mijoz | Bepul, natija evaziga. Ilovalari do'konga chiqadi
--- END TABLE ---


v1.3 (17–24-haftalar): vizual muharrir, skrinshot studiyasi, App Manager rejimi, Payme/Click/Uzum bloki, o'z preview ilovamiz, rad etishlar dashboardi, Google Play to'liq oqimi.

## [Heading1] 21. Birinchi hafta
`rorkai/App-Store-Connect-CLI` va `rorkai/rork-local` ni fork qilib ishga tushirish.
Expo shabloni: TypeScript strict, Expo Router, Expo UI (SDK 56+), NativeWind, ESLint, qotirilgan struktura.
Docker образ: shablon + `node_modules` oldindan. Ishga tushish vaqtini o'lchash.
Metro'ni konteynerda ishga tushirish, tunnel, telefonda Expo Go bilan ochish.
`eas go` ni sinab ko'rish — ikkinchi preview yo'li qanchalik real ekanini erta bilish.
Maestro'ni oddiy Expo ilovada sinash — E2E tekshiruv qanchalik real ekanini bilish.
Birinchi preview'gacha ketgan vaqtni yozib qo'yish.

--- TABLE ---
Oxirgi izoh Base44 yakka asoschi tomonidan, investitsiyasiz, yon loyiha sifatida boshlangan va olti oyda 80 mln dollarga sotilgan. Rork ikki kishi va 15 ming dollar qarz bilan boshlagan va bir yil davomida sof Expo ustida ishlagan. Ikkalasi ham bitta narsani qilgan: tor joyni topib, uni boshqalardan yaxshiroq bajargan.
--- END TABLE ---



## [Heading1] 22. Manbalar
Expo rasmiy: expo.dev/changelog (SDK 55, SDK 56, «Expo Go and the App Store in May 2026»), expo.dev/blog («Expo UI is now stable»), docs.expo.dev.
Rork: docs.rork.com, github.com/rorkai (asc, rork-local, rork-device), App Store listing.
Boshqa platformalar: har biri uchun alohida hujjat (00–11 raqamli fayllar).
To'lov: PayTechUz/paytechuz, bek-shoyatbek/payme-uzum-click-integration-example.
Do'kon qoidalari: Apple App Store Review Guidelines (4.2, 4.3, 3.1.1, 5.1.1), Google Play Console Help.