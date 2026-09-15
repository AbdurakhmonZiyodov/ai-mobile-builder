# AI uchun qo'llanma — backend

> Bu loyihada ishlaydigan har qanday AI (Claude, Codex, boshqa) SHU FAYLDAN
> boshlaydi. Kod yozishdan oldin oxirigacha o'qing.
>
> Bu fayl ikki savolga javob beradi: **nima qilish kerak** va **nimaga
> tegish mumkin emas**. Ikkinchisi birinchisidan muhimroq.

---

## 1. Loyiha nima qiladi

Mijoz o'z tilida biznesini aytadi → biz Expo (React Native) ilovasini quramiz,
tekshiramiz, App Store va Google Play'ga chiqaramiz va keyin ham ishlab
turishini ta'minlaymiz.

Bu backend — **orkestrator**. U kod yozmaydi, **model yozadi**. Backend model
uchun kontekst tayyorlaydi, tool beradi, natijani tekshiradi va hisobni
yuritadi.

Mijoz — texnik bo'lmagan biznes egasi. Shundan ikkita natija kelib chiqadi:
har xabar o'zbek tilida va sodda; har xato «nima bo'ldi va endi nima
qilaman» degan savolga javob beradi.

---

## 2. Qatlamlar va bog'liqlik yo'nalishi

> Bu bo'lim nima uchun: import yo'nalishini bilmasdan yozilgan bitta qator
> butun tuzilmani buzadi va buni faqat oylar o'tib sezamiz.

```
modules/          biznes mantiq (projects, agent, verify, billing, …)
   ↓ ishlatadi
infrastructure/   tashqi dunyo (database, llm, workspace, crypto)
   ↓ ishlatadi
common/ + config/ umumiy qismlar
```

**Bog'liqlik faqat pastga yo'naladi.** `infrastructure` hech qachon
`modules` dan hech narsa import qilmaydi. Buzsangiz, bazani yoki workspace
drayverini almashtirish butun biznes mantiqqa tegib ketadi.

Modullar bir-birini **faqat service orqali** chaqiradi, repository orqali
emas. Boshqa modulning repository'siga to'g'ridan-to'g'ri kirish uning
biznes qoidalarini (masalan hisob qoidasini) chetlab o'tadi.

Bunga yagona ruxsat etilgan chekinish: `AgentController` va `PreviewService`
`ProjectsRepository` ni to'g'ridan-to'g'ri ishlatadi — ikkalasi ham
o'qish va tarixga yozish uchun, biznes qarori uchun emas.

---

## 3. Yangi kod qayerga yoziladi

| Nima qo'shyapsiz | Qayerga |
| --- | --- |
| Yangi endpoint | `modules/<modul>/<modul>.controller.ts` |
| Biznes qoidasi | `modules/<modul>/<modul>.service.ts` |
| SQL so'rov | `modules/<modul>/<modul>.repository.ts` |
| So'rov/javob shakli | `packages/contracts` da zod sxema + `modules/<modul>/dto/` da re-export |
| Yangi jadval | `infrastructure/database/schema/<nom>.schema.ts` + `schema/index.ts` ga `export *` |
| Agent tool | `modules/agent/tools/<nom>.tool.ts` + `tools/tool.registry.ts` |
| Model prompti | `modules/agent/prompts/<nom>.prompt.ts` + `prompts/index.ts` |
| Do'kon qoidasi | `modules/review/rules/<nom>.rule.ts` + `rules/index.ts` dagi `ALL_RULES` |
| Narx, hisob, preview yoki SDK qoidasi | `packages/core-rules` — **backendda emas** |

---

## 4. QATTIQ QOIDALAR

> Bu bo'lim nima uchun: quyidagi bandlarning har biri **amalda uchragan**
> xatoning oldini oladi. Ularni «yaxshilash» niyatida ham buzmang.

| № | Qoida | Nega |
| --- | --- | --- |
| 1 | `process.env` ga to'g'ridan-to'g'ri murojaat qilinmaydi | Sozlama `config/configuration.ts` dan `APP_CONFIG` orqali keladi. Shunda testda almashtirish mumkin va qaysi o'zgaruvchi qayerda ishlatilishi bitta joyda ko'rinadi |
| 2 | Har xato `messageUz` maydoni bilan tashlanadi | Mijoz — texnik bo'lmagan biznes egasi. «Internal Server Error» unga hech narsa aytmaydi |
| 3 | Validatsiya faqat zod bilan, sxema `@amb/contracts` da | Frontend ham aynan o'shani ishlatadi. Ikkita alohida tekshiruv qatlami vaqt o'tib bir-biridan uzoqlashadi |
| 4 | Mock (soxta) ma'lumot yozilmaydi | Model kaliti yo'q bo'lsa server ishga tushmaydi. Soxta natija mijozga ilovasi ishlayotgandek ko'rsatadi — bu eng qimmat xato |
| 5 | Workspace ichida vosita `resolveBin()` bilan topiladi | `npm exec` vosita topilmasa **reyestrdan** shu nomli paketni yuklab bajaradi. `tsc` uchun bu TypeScript emas, begona paket bo'lib chiqdi |
| 6 | Modelga `system` xabar `instructions` orqali beriladi | AI SDK 7 da `system` rolli xabar `messages` ichida bo'lolmaydi — so'rov `AI_InvalidPromptError` bilan yiqiladi. Ajratish `gateway.provider.ts` dagi `splitMessages()` da |
| 7 | Verify gate o'tmasa `discardUncommitted()` chaqiriladi | Aks holda buzuq fayllar diskda qoladi, preview ulardan yig'iladi va keyingi run'ning `git add -A` si ularni begona versiyaga qo'shib yuboradi |
| 8 | Vosita topilmasa `VerifyReport.unavailable = true` | Bu muhit nosozligi, model xatosi emas: tuzatish tsikli ishga tushmaydi, hisob 0, mijozga «bu bizning tomonda» deyiladi |
| 9 | Model xatolari `classifyLlmError()` dan o'tadi | Xom provayder xatosi yuqoriga chiqmaydi. Mijoz «401 Unauthorized» ni ko'rmasligi, biz esa aniq sababni bilishimiz kerak |
| 10 | Hisob faqat `modules/billing` orqali | Qaror `@amb/core-rules` dagi `decideCharge()` da, yozuv `BillingRepository.consumeOneChange()` da. Uchinchi joy yo'q |
| 11 | Izoh **NEGA** borligini tushuntiradi, nima qilishini emas | «Loyiha xarajatini qaytaradi» — buni kodning o'zi aytadi. Izoh qarorning sababini saqlaydi |

---

## 5. Nima qilish TAQIQLANGAN

> Bu bo'lim nima uchun: AI odatda «foydali bo'lay» deb qo'shimcha narsa
> qo'shadi. Quyidagilar foydali emas, zarar.

| Taqiq | Nega |
| --- | --- |
| `any` turini ishlatish | `strict` va `noUncheckedIndexedAccess` yoqilgan. `any` ularni butunlay o'chiradi |
| Yangi ORM, HTTP yoki validatsiya kutubxonasi qo'shish | drizzle, `fetch` va zod yetarli. Har yangi kutubxona — yangi yangilanish yuki va yangi xavfsizlik yuzasi |
| `class-validator` yoki global `ValidationPipe` qo'shish | Ataylab olib tashlangan (`main.ts` dagi izohga qarang). Sxema manbai bitta: `@amb/contracts` |
| Kalitni, parolni yoki mijoz kontentini log qilish | Log ishlab chiqarishda saqlanadi va uzatiladi. `service_role` kaliti bilan butun bazani o'qish mumkin |
| `service_role` kalitini javobda qaytarish | U RLS'ni butunlay chetlab o'tadi. Faqat serverda, shifrlangan holda yashaydi |
| `modules/` dan `infrastructure/` ga teskari bog'liqlik | 2-bo'limga qarang |
| Design mode'da tahrir tool'i berish | «Design mode» belgisi cheksiz bepul o'zgarish eshigiga aylanadi. Marja teshigi |
| `edit_file` o'rniga to'liq faylni qayta yozish | Narx (~6000 token vs ~200) va sifat (model tegishi shart bo'lmagan joyni buzadi) |
| `npm exec` bilan vosita ishga tushirish | 4-bo'lim, 5-qoida |
| Hisobni verify gate'dan oldin yozish | Tekshirilmagan kod uchun pul olinadi — mahsulotning markaziy va'dasi buziladi |

---

## 6. O'zgartirilmaydigan qarorlar

> Bu bo'lim nima uchun: quyidagilar «hali qilinmagan» emas — **ataylab
> shunday**. Ularni «tuzatish» qayta ishlangan muammoni qaytaradi.

| Qaror | Nega shunday |
| --- | --- |
| Nest CLI ishlatilmaydi, `tsc` bilan quriladi | `@nestjs/cli` TypeScript 6 ning dasturiy API'sini talab qiladi; TS 7.0 uni bermaydi, TS 6 ning barqaror relizi yo'q |
| `tsx` va `esbuild` ishlatilmaydi | Ular `emitDecoratorMetadata` ni bermaydi va NestJS'ning turga asoslangan DI'si buziladi |
| Nisbiy import yo'llari, `@/` taxallusi emas | TypeScript 7 `baseUrl` ni olib tashladi |
| Import'da `.js` kengaytmasi majburiy | `moduleResolution: NodeNext` shuni talab qiladi |
| Hisob birligi — «o'zgarish», token yoki kredit emas | Mahsulot qarori (spek 5, 6-bo'lim) |
| Loyiha bitta Expo SDK'da qotiriladi | Avtomatik yangilanish ishlab turgan ilovani buzadi |
| Tuzatish urinishi ko'pi bilan 3 ta | Cheksiz urinish marjani ham, mijozning ishonchini ham yeydi |
| Mijoz kalitlari mijozniki, biz Supabase loyihasi yaratmaymiz | Aks holda mijoz ketganda ma'lumoti bizda qoladi — bu lock-in |

---

## 7. Hali tugallanmagan joylar

> Bu bo'lim nima uchun: quyidagilar **bilib qoldirilgan bo'shliqlar**.
> Ularni o'z tashabbusingiz bilan to'ldirmang — avval so'rang.

| Bo'shliq | Holati |
| --- | --- |
| Autentifikatsiya | Yo'q. `CurrentUser` dekoratori doim `usr_demo` qaytaradi (`common/decorators/current-user.decorator.ts`). `users` jadvali bor, lekin unga hech qayerdan yozilmaydi |
| `rejections` va `builds` jadvallari | Sxema tayyor, kod ulanmagan. Rad etishlar korpusi va EAS build hali yozilmagan |
| Test | `vitest` sozlangan (`npm run test`), lekin **birorta ham test fayli yo'q** |
| `apps/api` uchun ESLint | `lint` skripti bor, konfiguratsiya fayli va `eslint` bog'liqligi yo'q. Verify gate'dagi ESLint boshqa narsa: u **workspace** ichida, `templates/mobile/eslint.config.js` bilan ishlaydi |
| Konteyner izolyatsiyasi | Yo'q. MVP shu mashinaning fayl tizimida ishlaydi va ishlab chiqarishga tayyor emas |
| Kalitlar uchun KMS | Yo'q. Master kalit `.env` da (`AMB_SECRET_KEY`) |

---

## 8. Keyin nimani o'qish

| Savol | Fayl |
| --- | --- |
| Qanday endpointlar bor, so'rov va javob shakli qanday? | [`API.md`](./API.md) |
| Qatlamlar va agent tsikli qanday ishlaydi? | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Jadvallar nega shunday? | [`DATABASE.md`](./DATABASE.md) |
| Nomlash, izoh, xato va log qoidalari? | [`CONVENTIONS.md`](./CONVENTIONS.md) |
| Agent tsikli ichida nima bo'ladi? | [`../src/modules/agent/README.md`](../src/modules/agent/README.md) |
| Nima hisoblanadi, nima bepul? | [`../src/modules/billing/README.md`](../src/modules/billing/README.md) |
| Do'kon tekshiruvi qanday ishlaydi? | [`../src/modules/review/README.md`](../src/modules/review/README.md) |
| Mahsulot nega shunday qilingan? | `../../../docs/MVP-v1.2-spek.md` |
