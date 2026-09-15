# Arxitektura — backend

Bu fayl **nima qayerda turishi va nega aynan shu yerda** turishini
tushuntiradi. Fayl ro'yxati emas — qarorlar va ularning sabablari.

---

## 1. Qatlamlar

> Nima uchun: har qatlamning bitta ishi bor. Chegara buzilsa, o'zgarish
> bitta fayl o'rniga o'nta faylga tegadi.

```
                      HTTP / SSE
                          │
                    ┌─────▼──────┐
                    │ controller │  faqat: so'rovni olish, javobni berish
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │  service   │  faqat: biznes qoidalari
                    └─────┬──────┘
                          │
              ┌───────────┴────────────┐
        ┌─────▼─────┐          ┌───────▼────────┐
        │ repository│          │ infrastructure │
        │   (SQL)   │          │ llm, workspace │
        └───────────┘          └────────────────┘
```

| Qatlam | Nima qiladi | Nima QILMAYDI |
| --- | --- | --- |
| `controller` | HTTP/SSE, validatsiya chaqirig'i | Biznes qarori qabul qilmaydi, SQL yozmaydi |
| `service` | Biznes qoidasi, qatlamlarni bog'lash | SQL yozmaydi, HTTP bilmaydi |
| `repository` | Faqat drizzle so'rovlari | Biznes qoidasini bilmaydi |
| `infrastructure` | Tashqi dunyo: baza, model, fayl tizimi, shifr | `modules/` dan hech narsa import qilmaydi |
| `common` | Filtr, pipe, interceptor, dekorator | Biznesga tegishli hech narsa |
| `config` | Tekshirilgan sozlama | |

**Bog'liqlik faqat pastga.** Buzilsa, bazani yoki workspace drayverini
almashtirish butun biznes mantiqqa tegib ketadi.

---

## 2. Modullar

| Modul | Javobgarligi | README |
| --- | --- | --- |
| `projects` | Loyiha yaratish, ro'yxat, fayllar, versiyalar, qaytarish | — |
| `agent` | Agent tsikli: tasniflash → kontekst → bajarish → verify | [bor](../src/modules/agent/README.md) |
| `verify` | Verify gate: typecheck → lint → bundle | — |
| `billing` | O'zgarishlar hisobi | [bor](../src/modules/billing/README.md) |
| `preview` | To'rt yo'lli preview qarori va veb yig'ish | — |
| `review` | Do'kon bandlari tekshiruvi | [bor](../src/modules/review/README.md) |
| `backend-connection` | Mijozning Supabase/Firebase kalitlari | — |
| `handoff` | Dasturchiga topshirish paketi | — |
| `catalog` | Bloklar, domenlar, narx — o'zgarmas ma'lumot | — |
| `health` | Server holati va sozlangan modellar | — |

`DatabaseModule`, `CryptoModule`, `LlmModule` va `AppConfigModule` —
**global**: deyarli hamma joyda kerak, har modulga alohida import qilish
ortiqcha shovqin bo'lardi.

---

## 3. Agent tsikli

> Nima uchun: mahsulotning yuragi. Har qadam SSE orqali mijozga uzatiladi —
> u nima bo'layotganini va nima uchun pul olinganini (yoki olinmaganini)
> real vaqtda ko'radi.

Manba: `modules/agent/agent.service.ts` → `run()`.

```
POST /chat
  │
  ├─ Loyiha topiladi (yo'q bo'lsa 404) · emit run.started
  │
  ├─ 1. TASNIFLASH
  │     designMode: true  → kind = "design", modelga so'rov YUBORILMAYDI
  │     aks holda         → classifier.classify() — ARZON model
  │     emit run.classified
  │
  ├─ 2. Workspace tayyorlanadi (yo'q bo'lsa shablondan yaratiladi)
  │
  ├─ 3. BEPUL YO'LLAR — tsikl shu yerda tugaydi
  │     unclear  → emit clarify   → hisob 0
  │     question → STANDART model bilan javob (maxSteps 1) → hisob 0
  │
  ├─ 4. QOLDIQ TEKSHIRUVI (design'dan tashqari)
  │     qoldiq yo'q → emit error → hisob 0, ok = false
  │
  ├─ 5. KONTEKST
  │     DESIGN.md + PROJECT.md + MAP.md + suhbat + 3–8 tegishli fayl
  │     butun repo HECH QACHON yuborilmaydi
  │
  ├─ 6. BAJARISH (tool tsikli)
  │     tier:     large → strong, aks holda standard
  │     maxSteps: large → 24,     aks holda 12
  │     edit_file — nuqtali diff, to'liq qayta yozish taqiqlangan
  │
  ├─ 7. DIFF BO'SHMI
  │     ha → "hech narsa o'zgarmadi" → hisob 0, tsikl tugaydi
  │
  ├─ 8. DESIGN MODE bo'lsa
  │     git commit "design: …" → hisob 0
  │     (typecheck/lint/bundle o'tkazilmaydi — ilova kodi tegilmagan)
  │
  ├─ 9. VERIFY GATE + BEPUL TUZATISH (ko'pi bilan 3 urinish)
  │
  ├─ 10. O'TMADI → discardUncommitted()
  │      unavailable → "bu bizning tomonda" → hisob 0, ok = false
  │      aks holda   → emit repair.gaveUp   → hisob 0, ok = false
  │
  ├─ 11. O'TDI → git commit "<kind>: <so'rov>" = yangi versiya
  │
  └─ 12. HISOB: emit charge (doim) · emit run.finished
```

**Nega `discardUncommitted()` 10-qadamda MAJBURIY:** aks holda buzuq fayllar
diskda qoladi, preview ulardan qayta yig'iladi va keyingi muvaffaqiyatli
run'ning `git add -A` si ularni **begona versiyaga** qo'shib yuboradi.

**Nega tasniflash birinchi:** mahsulot va'dasi «savol bepul, noaniq so'rov
bepul, xato tuzatish bepul». Nima hisoblanishini oldindan bilmasak, bu
va'dani bajarib bo'lmaydi.

**Run natijasi qachon bazaga yoziladi:** oqim tugagach, `AgentController.persist()`
da. Mijoz natijani darhol ko'rishi kerak — baza yozuvi uni kutib turmaydi.

---

## 4. Verify gate

> Nima uchun: «kompilyatsiya bo'ldi» yetarli emas. O'tmagan natija mijozga
> ko'rsatilmaydi va hisoblanmaydi — mahsulotning markaziy va'dasi shu.

Manba: `modules/verify/verify.service.ts`.

| № | Qadam | Buyruq | Timeout | O'tkazib yuborilsa |
| --- | --- | --- | --- | --- |
| 1 | `typecheck` | `tsc --noEmit --pretty false` | 180 s | — |
| 2 | `lint` | `eslint . --max-warnings 0` | 180 s | typecheck yiqilgan bo'lsa |
| 3 | `bundle` | `expo export --platform web --output-dir .amb-bundle` | 300 s | kichik tahrirda, yoki oldingi qadam yiqilgan bo'lsa |

**Nega typecheck yiqilsa lint o'tkazib yuboriladi:** bitta tur xatosi o'nlab
lint xabarini keltirib chiqaradi va bu shovqin modelni chalg'itadi.

**Nega kichik tahrirda bundle yo'q:** u 30–90 soniya oladi, rang o'zgarishi
esa Metro yig'ilishini buzolmaydi.

**Vositalar `resolveBin()` bilan topiladi** — `node_modules/.bin` dan
to'g'ridan-to'g'ri. `npm exec` ishlatilmaydi: u vosita topilmasa reyestrdan
shu nomli paketni yuklab bajaradi.

### `unavailable` — alohida holat

Vosita topilmasa yoki ishga tushmasa (`code === 127`, `ENOENT`, `EACCES`),
hisobot `unavailable: true` bo'ladi. Uch natijasi bor:

1. `ok` **doim** `false` — tekshirilmagan kod uchun pul olinmaydi.
2. Tuzatish tsikli **ishga tushmaydi** — model muhit xatosini tuzata olmaydi
   va uchta bepul urinishni bekorga sarflaydi.
3. Mijozga «bu bizning tomondagi nosozlik, sizning kodingizda emas» deyiladi.

> Avval bu holat «o'tkazib yuborildi, gate o'tdi» deb belgilanardi. Natijada
> noto'g'ri sozlangan serverda har run «tekshirildi» deb ko'rsatilardi va
> tekshirilmagan kod uchun pul olinardi.

### Tuzatish tsikli

Manba: `modules/agent/repair.service.ts`, `MAX_REPAIR_ATTEMPTS = 3`.

| Holat | Xatti-harakat |
| --- | --- |
| `unavailable` | Darhol chiqiladi, urinish 0 |
| Xato boshqacha | O'sha tier'da qayta urinish |
| **Bir xil xato ikki marta** | `standard` → `strong` ga o'tiladi |
| 3 urinish yetmadi | Halol to'xtash, o'zgarishlar bekor qilinadi |

Tuzatish konteksti **ataylab tor**: faqat xato matni (`errorDigest`) va
`MAP.md`. Keng kontekst modelni o'sha xato yo'ldan yana olib ketadi.

---

## 5. Kontekst byudjeti

> Nima uchun: butun repo modelga hech qachon yuborilmaydi. Ikki sabab —
> narx (har token pul) va sifat (katta kontekstda model kerakli joyni
> yo'qotadi).

Manba: `modules/agent/context-builder.service.ts` → `CONTEXT_BUDGET`.

| Bo'lak | Chegara (token) | Qayerda qo'llanadi |
| --- | --- | --- |
| `DESIGN.md` + `PROJECT.md` | 1 500 (teng ikkiga bo'linadi) | `loadDocs()` |
| `MAP.md` | 1 000 | `loadDocs()` |
| Suhbat xulosasi | 1 500 | `buildConversation()` — oxirgi 5 xabardan oldingilari |
| Tegishli fayllar | 15 000 | `findRelevantFiles()` — 6 tagacha fayl |
| Tool javobi | 4 000 (e'lon qilingan) | **Amalda qo'llanmaydi** |

**Diqqat:** `CONTEXT_BUDGET.toolResponse` e'lon qilingan, lekin hech qayerda
ishlatilmaydi. Tool javobining haqiqiy chegarasi —
`infrastructure/llm/providers/gateway.provider.ts` dagi
`MAX_TOOL_OUTPUT_CHARS = 16 000` **belgi**.

Token hisobi taxminiy: `estimateTokens(text) = text.length / 3.6`. Aniq
tokenizer o'rniga — chegara nazorati uchun bu yetarli va tezroq.

Oxirgi 5 xabar to'liq kiradi (har biri 2 000 tokengacha), qolgani bitta
xulosa qatoriga siqiladi. **Nega 5:** mijoz odatda oxirgi bir-ikki xabarga
ishora qiladi («yo'q, uni emas, boshqasini»).

`MAP.md` har safar qaytadan quriladi (`infrastructure/workspace/project-map.builder.ts`):
ekranlar va ularning marshrutlari, komponentlar, `lib/` va `hooks/` dagi
eksportlar, 12 KB dan katta fayllar ro'yxati.

**Diqqat:** `MAP.md` diskda **fayl emas** — u har run'da xotirada quriladi
va to'g'ridan-to'g'ri modelga beriladi. Workspace'da uni qidirmang.
`DESIGN.md` va `PROJECT.md` esa haqiqiy fayllar: ular loyiha yaratilganda
`seedProjectDocs()` bilan yoziladi va mijoz kodni eksport qilganda ham
ketadi.

---

## 6. Model qatlami

> Nima uchun: provayder almashsa, o'zgarish bitta faylda tugashi kerak.

```
AgentService / ClassifierService / RepairService
        ↓ faqat shuni biladi
   LlmService  (infrastructure/llm/llm.service.ts)
        ↓
  GatewayProvider  (providers/gateway.provider.ts)
        ↓
   Vercel AI Gateway  →  model
```

### Tier'lar

Model ID'lari sozlamadan keladi (`AMB_MODEL_CHEAP/STANDARD/STRONG`).
Provayder modelni yangilasa, kod tegilmaydi.

| Tier | Standart model | Narx 1M token (kirish/chiqish) | Qayerda ishlatiladi |
| --- | --- | --- | --- |
| `cheap` | `anthropic/claude-haiku-4.5` | $1 / $5 | **Faqat** tasniflash — har xabarda |
| `standard` | `anthropic/claude-sonnet-5` | $2 / $10 | Kichik va o'rta tahrir, savolga javob, tuzatishning birinchi urinishlari |
| `strong` | `anthropic/claude-opus-5` | $5 / $25 | Katta o'zgarish; bir xil xato takrorlanganda |

Narxlar `infrastructure/llm/model-registry.ts` da va ular **bizning
xarajatimiz**, mijoz narxi emas.

### Ikkita qattiq qoida

1. **`system` xabar `instructions` orqali beriladi.** AI SDK 7 da `system`
   rolli xabar `messages` ichida bo'lolmaydi — so'rov `AI_InvalidPromptError`
   bilan yiqiladi. `splitMessages()` barcha `system` bo'laklarini tartibini
   saqlagan holda bitta matnga birlashtiradi.

2. **Har xato `classifyLlmError()` dan o'tadi.** Xom provayder xatosi
   yuqoriga chiqmaydi. Turkumlar: `auth`, `quota`, `rate_limit`,
   `bad_request`, `unknown` — har biriga o'zbekcha, «bu bizning tomondan»
   deb ochiq aytadigan xabar biriktirilgan.

**Mock (soxta) provayder ataylab yo'q.** U kalitsiz ham «ishlayapti»
taassuroti beradi va eng yomon nosozlikka yo'l ochadi: mijoz ilovasi tayyor
deb o'ylaydi, aslida hech narsa yaratilmagan.

---

## 7. Workspace qatlami

> Nima uchun: mijozning kodi shu yerda yashaydi va agent faqat shu orqali
> unga tegadi.

`WorkspaceService` loyiha ID'sidan drayver beradi. Interfeys —
`drivers/driver.interface.ts`, MVP amalga oshiruvi — `drivers/local.driver.ts`
(shu mashinaning fayl tizimi).

| Amal | Izoh |
| --- | --- |
| `create(templateDir)` | Shablondan nusxa, `git init`, birinchi commit |
| `tree()` / `list()` / `read()` | O'qish. 400 fayldan oshmaydi |
| `write()` / `edit()` / `remove()` | Yozish. `edit()` — nuqtali diff |
| `search()` | Loyiha bo'ylab matn qidirish |
| `exec(cmd, args)` | `shell: false`, `CI=1`, `NO_COLOR=1`, standart timeout 120 s |
| `resolveBin(name)` | `node_modules/.bin` dan vosita; yo'q bo'lsa `null` |
| `commit()` / `revertTo()` | Git. Bo'sh commit yasalmaydi — `null` qaytadi |
| `discardUncommitted()` | `git reset --hard HEAD` + `git clean -fd` |

**Nega `clean` da `-x` yo'q:** u `.gitignore` dagi fayllarni ham o'chirardi —
har xatodan keyin `node_modules` va Metro keshi yo'qolib ketardi.

**Bog'liqliklar symlink bilan ulanadi.** Shablonning `node_modules` iga
symlink — 0 ms, nusxa ko'chirish esa APFS clone bilan ham ~10 s (o'lchandi).
Cheklovi: bog'liqliklar shablon bilan **umumiy**. Workspace ichida yangi
paket o'rnatishdan oldin `isolateDependencies()` chaqirilishi shart, aks
holda o'rnatish shablonni o'zgartiradi va boshqa loyihalarga ta'sir qiladi.

> `isolateDependencies()` `LocalWorkspace` da bor, lekin `WorkspaceDriver`
> interfeysida yo'q va hozircha hech qayerdan chaqirilmaydi. Workspace ichida
> paket o'rnatish imkoniyati qo'shilganda — birinchi ish shu.

---

## 8. Xavfsizlik chegaralari

> Nima uchun: har chegara aniq bitta hujum yo'lini yopadi. Qaysi biri
> qayerda ekanini bilmasdan kod o'zgartirish — chegarani jimgina ochish.

| Chegara | Qayerda | Nimani to'sadi |
| --- | --- | --- |
| Fayl yo'li workspace ichida | `LocalWorkspace.resolve()` | Agent bergan `../../` yo'li bilan begona faylni o'qish |
| Loyiha ID formati | `WorkspaceService.assertSafeId()` | ID fayl yo'lining bir qismiga aylanadi |
| Preview statik fayllari | `preview-static.controller.ts` | `.amb-web` papkasidan chiqib ketish |
| Vosita reyestrdan yuklanmaydi | `LocalWorkspace.resolveBin()` | `npm exec` ning begona paketni bajarishi |
| `shell: false` | `LocalWorkspace.exec()` | Buyruq satri orqali inyeksiya |
| Mijoz kalitlari AES-256-GCM | `infrastructure/crypto/secret-cipher.ts` | Bazadan o'qilgan kalitning ochiq bo'lishi |
| `service_role` javobda qaytmaydi | `backend-connection.service.ts` | RLS'ni chetlab o'tuvchi kalitning tarqalishi |
| Sozlama ishga tushishda tekshiriladi | `config/env.schema.ts` | Noto'g'ri sozlama bilan ishlab ketish |
| Xato tafsiloti faqat dev'da | `common/filters/http-exception.filter.ts` | Ichki tuzilma haqida ma'lumot sizishi |

### Hali yo'q

| Nima | Holati |
| --- | --- |
| Autentifikatsiya | Yo'q — `CurrentUser` doim `usr_demo` |
| Konteyner izolyatsiyasi (Firecracker / gVisor) | Yo'q — agent kodi shu mashinada ishlaydi |
| Tarmoq oq ro'yxati | Yo'q |
| Kalitlar uchun KMS | Yo'q — master kalit `.env` da |
| Rate limiting | Yo'q |

**MVP shu mashinaning fayl tizimida ishlaydi va ishlab chiqarishga tayyor
emas.** Bu bilib qabul qilingan qaror, kamchilik emas — lekin uni unutib
ishlab chiqarishga chiqarish mumkin emas.

---

## 9. Qurish va ishga tushirish

| Nima | Nega shunday |
| --- | --- |
| `tsc` bilan quriladi, Nest CLI'siz | `@nestjs/cli` TS 6 ning dasturiy API'sini talab qiladi; TS 7.0 uni bermaydi |
| `tsx`/`esbuild` ishlatilmaydi | Ular `emitDecoratorMetadata` ni bermaydi va NestJS'ning DI'si buziladi |
| Sozlama Nest ko'tarilishidan **oldin** tekshiriladi | Aks holda xato DI stack trace'i ichida ko'milib qoladi |
| `enableShutdownHooks()` | SIGTERM'da Postgres hovuzi va SSE oqimlari toza yopilsin |
| Global `ValidationPipe` yo'q | U `class-validator` ni talab qiladi; bizda validatsiya zod bilan va sxemalar `@amb/contracts` da |
