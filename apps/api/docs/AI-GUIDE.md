# AI uchun qo'llanma — backend

> Bu loyihada ishlaydigan har qanday AI (Claude, Codex, boshqa) SHU FAYLDAN
> boshlaydi. Kod yozishdan oldin oxirigacha o'qing.

## Loyiha nima qiladi

Mijoz o'z tilida biznesini aytadi → biz Expo (React Native) ilovasini quramiz,
tekshiramiz, App Store va Google Play'ga chiqaramiz va keyin ham ishlab
turishini ta'minlaymiz.

Bu backend — **orkestrator**. U kod yozmaydi, model yozadi. Backend model
uchun kontekst tayyorlaydi, tool beradi, natijani tekshiradi va hisobni
yuritadi.

## Qatlamlar va bog'liqlik yo'nalishi

```
modules/          biznes mantiq (projects, agent, verify, billing, …)
   ↓ ishlatadi
infrastructure/   tashqi dunyo (database, llm, workspace, crypto)
   ↓ ishlatadi
common/ + config/ umumiy qismlar
```

**Bog'liqlik faqat pastga yo'naladi.** `infrastructure` hech qachon
`modules` dan hech narsa import qilmaydi. Buzsangiz, bazani almashtirish
butun biznes mantiqqa tegib ketadi.

Modullar bir-birini **faqat service orqali** chaqiradi, repository orqali
emas. Boshqa modulning repository'siga to'g'ridan-to'g'ri kirish uning
ichki qoidalarini chetlab o'tadi.

## Yangi kod qayerga yoziladi

| Nima qo'shyapsiz | Qayerga |
| --- | --- |
| Yangi endpoint | `modules/<modul>/<modul>.controller.ts` |
| Biznes qoidasi | `modules/<modul>/<modul>.service.ts` |
| SQL so'rov | `modules/<modul>/<modul>.repository.ts` |
| So'rov/javob shakli | `modules/<modul>/dto/` |
| Yangi jadval | `infrastructure/database/schema/<nom>.schema.ts` + `index.ts` ga qo'shing |
| Agent tool | `modules/agent/tools/<nom>.tool.ts` + `tool.registry.ts` ga qo'shing |
| Model prompti | `modules/agent/prompts/<nom>.prompt.ts` |
| Do'kon qoidasi | `modules/review/rules/<nom>.rule.ts` + `rules/index.ts` ga qo'shing |
| Narx yoki hisob qoidasi | `packages/core-rules` — **backendda emas** |

## Qattiq qoidalar

1. **Har fayl bitta ish qiladi.** Controller faqat HTTP, service faqat
   mantiq, repository faqat baza. 200 qatordan oshgan fayl bo'linadi.

2. **`process.env` ga to'g'ridan-to'g'ri murojaat qilmang.** Sozlama
   `config/configuration.ts` dan `APP_CONFIG` orqali keladi. Sabab: testda
   almashtirish va qaysi o'zgaruvchi qayerda ishlatilishini ko'rish.

3. **Xato xabarlari o'zbek tilida va `messageUz` maydonida.** Mijoz —
   texnik bo'lmagan biznes egasi. «Internal Server Error» unga hech narsa
   aytmaydi.

4. **Validatsiya faqat zod bilan**, sxema `@amb/contracts` da. Frontend ham
   aynan o'shani ishlatadi — ikkita alohida tekshiruv qatlami vaqt o'tib
   bir-biridan uzoqlashadi.

5. **Mock ma'lumot yozmang.** Model kaliti yo'q bo'lsa server ishga
   tushmaydi va buni aniq aytadi. Soxta natija mijozga ilovasi
   ishlayotgandek ko'rsatadi — bu eng qimmat xato.

6. **Har endpoint va har muhim funksiya ustida o'zbekcha izoh.** U nima
   qilishini emas — **NEGA borligini** tushuntiradi.

7. **`npm exec` dan keyin `--` majburiy.** Usiz npm bayroqlarni o'zi yeb
   qo'yadi (amalda uchragan xato, `docs/CONVENTIONS.md` ga qarang).

## Nima qilish TAQIQLANGAN

- `any` turini ishlatish
- Yangi ORM yoki HTTP kutubxona qo'shish (drizzle va fetch yetarli)
- Kalitlarni log qilish yoki javobda qaytarish
- Hisobni `modules/billing` dan tashqarida yuritish
- `modules/` dan `infrastructure/` ga teskari bog'liqlik yaratish

## Keyin nimani o'qish

| Savol | Fayl |
| --- | --- |
| Qanday endpointlar bor? | [`API.md`](./API.md) |
| Jadvallar nega shunday? | [`DATABASE.md`](./DATABASE.md) |
| Nomlash va uslub qoidalari? | [`CONVENTIONS.md`](./CONVENTIONS.md) |
| Qatlamlar qanday ishlaydi? | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Mahsulot nega shunday qilingan? | `../../docs/MVP-v1.2-spek.md` |
